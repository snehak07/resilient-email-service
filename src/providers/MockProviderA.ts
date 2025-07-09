import { EmailPayload } from '../types/Email';
import { Logger } from '../utils/Logger';

export interface EmailProvider {
  send(email: EmailPayload): Promise<void>;
}

export class MockProviderA implements EmailProvider {
  async send(email: EmailPayload): Promise<void> {
    Logger.info('MockProviderA: Sending email...');

    // Simulate success 50% of the time
    if (Math.random() < 0.5) {
      Logger.info('MockProviderA: Email sent!');
    } else {
      Logger.error('MockProviderA: Failed to send.');
      throw new Error('MockProviderA failed');
    }
  }
}
