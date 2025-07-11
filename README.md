# 📧 Resilient Email Sending Service

A TypeScript-based email service that supports multiple providers with built-in **retry logic**, **provider fallback**, **rate limiting**, **idempotency**, **status tracking**, and a **circuit breaker** pattern.

---

## ✅ Features

- 🔁 Retry mechanism with exponential backoff
- 🔄 Fallback to alternate providers on failure
- 📉 Rate limiting (5 requests per minute)
- 🔐 Idempotency to avoid duplicate sends
- 📊 Status tracking for email attempts
- 🚫 Circuit breaker to prevent repeated failures
- 🧾 Logger for clean info and error outputs

---

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
│ └── EmailService.test.ts # Unit tests
├── package.json
├── tsconfig.json
├── README.md


---

## 🚀 Getting Started

### 🔧 Prerequisites

- Node.js (v16+ recommended)
- Git
- TypeScript:  
  ```bash
  npm install -g typescript
  
ts-node:
npm install -g ts-node

1.Setup Instructions
Clone the repository
git clone https://github.com/snehak07/resilient-email-service.git
cd resilient-email-service

2.Install dependencies
npm install

3.Run the service
npx ts-node src/index.ts

?How It Works
The service attempts to send an email through Provider A.
If it fails, it retries 3 times using exponential backoff.
After 3 failures, a circuit breaker prevents that provider from being used for 60 seconds.
The service then falls back to Provider B and attempts again.
Each request is tracked with an idempotency key to prevent duplicates.
A rate limiter ensures a maximum of 5 emails per minute.
Logs are printed using a custom Logger utility.

->Assumptions
Email delivery is simulated using mock providers.
MockProviderA has a ~70% success rate.
MockProviderB has a ~80% success rate.
All emails are unique unless the same idempotencyKey is reused.
Only two providers are used for simplicity.

Testing
To run the unit tests:
npm test

Tests include scenarios like:
Retry and fallback logic
Idempotency
Circuit breaker behavior

