import { EmailPayload, EmailProvider } from '../types/Email';
import { Logger } from '../utils/Logger';

export class MockProviderA implements EmailProvider {
  async send(email: EmailPayload): Promise<void> {
    Logger.info('MockProviderA: Sending email...');

    // Simulate success 70% of the time
    if (Math.random() < 0.7) {
      Logger.info('MockProviderA: Email sent!');
    } else {
      Logger.error('MockProviderA: Failed to send.');
      throw new Error('MockProviderA failed');
    }
  }
}
