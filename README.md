# TrickShare MVP

A minimal implementation of TrickShare - a global community for sharing life tricks.

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Set up AWS credentials:
```bash
cp .env.local.example .env.local
# Edit .env.local with your AWS credentials
```

3. Deploy AWS infrastructure:
```bash
npx cdk bootstrap
npx cdk deploy
```

4. Run locally:
```bash
npm run dev
```

Visit http://localhost:3000 to see the app.

## Deployment Options

### Option 1: Simple Script
```bash
./deploy-simple.sh
```

### Option 2: Manual CDK
```bash
npm run build
npm run deploy
```

### Option 3: GitHub Actions (Recommended)
1. Push code to GitHub repository
2. Add AWS credentials to GitHub Secrets:
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`
3. Push to `main` branch - auto-deploys!

### Option 4: AWS CodePipeline
```bash
npm run deploy-pipeline
```
Then configure GitHub webhook in AWS Console.

## Features Implemented

- ✅ Submit tricks (max 3 steps)
- ✅ Browse and filter by country/language
- ✅ Give kudos to tricks
- ✅ DynamoDB backend
- ✅ Static hosting ready

## Next Steps

- Add user authentication (Cognito)
- Implement moderation queue
- Add image uploads (S3)
- Add comments system
- Implement proper search

## Architecture

- Frontend: Next.js (static export)
- Backend: DynamoDB + API routes
- Hosting: S3 + CloudFront
- Infrastructure: AWS CDK
🚀 GitHub Actions CI/CD Pipeline Active!
