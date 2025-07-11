# Resilient Email Sending Service

A TypeScript-based email service that supports multiple providers with built-in **retry logic**, **provider fallback**, **rate limiting**, **idempotency**, **status tracking**, and a **circuit breaker** pattern.

## 📌 Features

- ✅ Retry mechanism with exponential backoff
- ✅ Fallback to alternate providers on failure
- ✅ Rate limiting (5 requests per minute)
- ✅ Idempotency to avoid duplicate sends
- ✅ Status tracking for email attempts
- ✅ Circuit breaker to prevent repeated failures
- ✅ Logger for clean info and error outputs


## 📁 Project Structure

resilient-email-service/
├── src/
│ ├── index.ts # Entry point
│ ├── services/
│ │ └── EmailService.ts # Core logic
│ ├── providers/
│ │ ├── MockProviderA.ts
│ │ └── MockProviderB.ts
│ ├── utils/
│ │ └── Logger.ts
│ ├── types/
│ │ └── Email.ts
├── tests/
│ └── (to be added)
├── package.json
├── tsconfig.json
├── README.md



---

## 🚀 Getting Started

### Prerequisites

- Node.js installed (v16+ recommended)
- Git installed
- TypeScript (`npm install -g typescript`)
- ts-node (`npm install -g ts-node`) for running TypeScript without compiling

### 🔧 Setup Instructions

1. **Clone the repository**  
   ```bash
   git clone https://github.com/snehak07/resilient-email-service.git
   cd resilient-email-service
2.Install dependencies
npm install

3.Run the service
npx ts-node src/index.ts

📦 How It Works
The service attempts to send an email through Provider A.

If it fails, it retries 3 times with exponential backoff.

After 3 failures, a circuit breaker prevents that provider from being used for 60 seconds.

The service falls back to Provider B and attempts sending there.

Each request is tracked by an idempotency key to avoid duplicates.

A rate limit ensures no more than 5 emails per minute are sent.

All logs are handled by a central Logger utility.

Assumptions
Email delivery is simulated; no real provider is used.

MockProviderA has a 70% success rate; MockProviderB has an 80% success rate.

All emails are assumed to be unique unless the same idempotencyKey is reused.

Only 2 providers are used for simplicity.
