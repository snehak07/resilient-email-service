import { EmailPayload } from '../types/Email';
import { EmailService } from '../services/EmailService';
import { Logger } from './Logger';

export class EmailQueue {
  private queue: { email: EmailPayload; key: string }[] = [];
  private isProcessing = false;

  constructor(private emailService: EmailService) {}

  enqueue(email: EmailPayload, idempotencyKey: string) {
    this.queue.push({ email, key: idempotencyKey });
    this.processQueue();
  }

  private async processQueue() {
    if (this.isProcessing) return;

    this.isProcessing = true;

    while (this.queue.length > 0) {
      const { email, key } = this.queue.shift()!;
      Logger.info(`Dequeued email to: ${email.to}`);
      const result = await this.emailService.sendEmail(email, key);
      Logger.info(`Email to ${email.to} status: ${result.status}`);
    }

    this.isProcessing = false;
  }
}
