import { EmailPayload, SendResult, EmailProvider } from '../types/Email';
import { Logger } from '../utils/Logger';


export class EmailService {
  private providers: EmailProvider[];
  private sentEmails: Set<string>;
  private rateLimitQueue: number[];
  private maxRequests: number = 5; // max 5 per minute
  private rateLimitWindow: number = 60 * 1000; // 1 minute in ms

  private failureCounts: Map<EmailProvider, number> = new Map();
private circuitOpenUntil: Map<EmailProvider, number> = new Map();
private maxFailures = 3;
private cooldownTime = 60 * 1000; // 60 seconds


  constructor(providers: EmailProvider[]) {
    this.providers = providers;
    this.sentEmails = new Set();
    this.rateLimitQueue = [];
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private getBackoffDelay(attempt: number): number {
    return Math.pow(2, attempt) * 100; // 100ms, 200ms, 400ms...
  }

  private isRateLimited(): boolean {
    const now = Date.now();
    this.rateLimitQueue = this.rateLimitQueue.filter((t) => now - t < this.rateLimitWindow);
    return this.rateLimitQueue.length >= this.maxRequests;
  }

  async sendEmail(email: EmailPayload, idempotencyKey: string): Promise<SendResult> {
    if (this.sentEmails.has(idempotencyKey)) {
      Logger.info('Idempotency key hit: Duplicate send prevented.');
      return { status: 'duplicate' };
    }
  
    if (this.isRateLimited()) {
      Logger.info('Rate limit exceeded.');
      return { status: 'rate_limited' };
    }
  
    for (let i = 0; i < this.providers.length; i++) {
      const provider = this.providers[i];
      const now = Date.now();
      const cooldownUntil = this.circuitOpenUntil.get(provider) || 0;
  
      if (now < cooldownUntil) {
        Logger.info(`Provider ${i + 1} is in cooldown. Skipping.`);
        continue;
      }
  
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          await provider.send(email);
          this.sentEmails.add(idempotencyKey);
          this.rateLimitQueue.push(Date.now());
  
          this.failureCounts.set(provider, 0); // reset on success
          return { status: 'sent' };
        } catch (err) {
            Logger.error(`Attempt ${attempt + 1} with provider ${i + 1} failed. Reason: ${(err as Error).message}`);
          await this.delay(this.getBackoffDelay(attempt));
        }
      }

      // All retry attempts failed for this provider, increment failure count once
      const currentFailures = this.failureCounts.get(provider) || 0;
      const newFailureCount = currentFailures + 1;
      this.failureCounts.set(provider, newFailureCount);

      if (newFailureCount >= this.maxFailures) {
        const cooldownUntil = Date.now() + this.cooldownTime;
        this.circuitOpenUntil.set(provider, cooldownUntil);
        Logger.error(`Circuit opened for provider ${i + 1} until ${new Date(cooldownUntil).toISOString()}`);
      }
  
      Logger.info(`Provider ${i + 1} exhausted. Falling back...`);
    }
  
    return { status: 'failed' }; // after all providers tried
  }
}  