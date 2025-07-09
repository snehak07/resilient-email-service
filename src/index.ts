import { EmailService } from './services/EmailService';
import { MockProviderA } from './providers/MockProviderA';
import { MockProviderB } from './providers/MockProviderB';
import { EmailPayload } from './types/Email';
import { EmailQueue } from './utils/EmailQueue';
import { Logger } from './utils/Logger';

// Setup mock providers
const providerA = new MockProviderA();
const providerB = new MockProviderB();
const emailService = new EmailService([providerA, providerB]);
const emailQueue = new EmailQueue(emailService);

// Sample email payload
const email: EmailPayload = {
  to: 'sneha@example.com',
  subject: 'Test Email',
  body: 'This is a test email from the resilient service.'
};

// Unique key to prevent duplicates
const idempotencyKey = 'email-123';

// Enqueue the email
emailQueue.enqueue(email, idempotencyKey);

// No need for async IIFE — the queue will handle it
