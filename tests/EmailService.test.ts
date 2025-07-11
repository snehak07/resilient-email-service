
import { EmailService } from '../src/services/EmailService';
import { EmailPayload } from '../src/types/Email';

class AlwaysFailProvider {
  async send(): Promise<void> {
    throw new Error('Simulated failure');
  }
}

class AlwaysPassProvider {
  async send(): Promise<void> {
    return;
  }
}

describe('EmailService', () => {
  const payload: EmailPayload = {
    to: 'test@example.com',
    subject: 'Test Subject',
    body: 'Test Body',
  };

  it('should fallback to second provider when first fails', async () => {
    const emailService = new EmailService([
      new AlwaysFailProvider(),
      new AlwaysPassProvider()
    ]);

    const result = await emailService.sendEmail(payload, 'unique-key-123');
    expect(result.status).toBe('sent');
  });
});
