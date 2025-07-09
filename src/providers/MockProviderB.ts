import { EmailPayload } from '../types/Email';
import { EmailProvider } from './MockProviderA';
import { Logger } from '../utils/Logger';


export class MockProviderB implements EmailProvider {
  async send(email: EmailPayload): Promise<void> {
    Logger.info('MockProviderB: Sending email...');
    
    // Simulate success 80% of the time
    if (Math.random() < 0.8) {
        Logger.info('MockProviderB: Email sent!');
    } else {
        Logger.error('MockProviderB: Failed to send.');
      throw new Error('MockProviderB failed');
    }
  }
}
