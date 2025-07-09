export interface EmailPayload {
    to: string;
    subject: string;
    body: string;
  }
  
  export interface SendResult {
    status: 'sent' | 'failed' | 'duplicate' | 'rate_limited';
  }
  