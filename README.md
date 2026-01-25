<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# GuardPHI - HIPAA Compliance Sentinel

Professional-grade HIPAA compliance auditing tool for healthcare applications.

## 🚀 Quick Start

### Deploy to Vercel (Recommended)
See **[VERCEL_QUICK_START.md](./VERCEL_QUICK_START.md)** for 5-minute deployment.

### Run Locally
```bash
npm install
npm run dev
```

**Note**: Local development will show "Analysis Service Error" because the `/api/analyze` endpoint requires deployment to Vercel or AWS Lambda.

## 📚 Documentation

- **[VERCEL_QUICK_START.md](./VERCEL_QUICK_START.md)** - Deploy to Vercel in 5 minutes
- **[VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)** - Complete Vercel deployment guide  
- **[DEPLOYMENT_COMPLETE.md](./DEPLOYMENT_COMPLETE.md)** - AWS Lambda proxy status

## 🏗️ Architecture

```
Frontend (React + Vite)
    ↓
Vercel Serverless Functions
    ├─ /api/analyze → AWS Bedrock (Claude)
    └─ /api/github-proxy → GitHub API
```

## 🔑 Environment Variables

For Vercel deployment, add these in Dashboard → Settings → Environment Variables:

```bash
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
```

## 🎯 Features

- ✅ GitHub repository scanning (public & private)
- ✅ Local file upload scanning  
- ✅ AI-powered HIPAA compliance analysis
- ✅ Real-time progress tracking
- ✅ Historical audit tracking
- ✅ Detailed compliance reports
- ✅ Actionable fix recommendations

## 🧪 Testing

```bash
npm test              # Run all tests
npm run test:watch    # Watch mode
```

## 🛠️ Tech Stack

- React 19.2.3 + TypeScript 5.8.2
- Vite 6.2.0
- AWS Bedrock (Claude)
- Supabase
- Tailwind CSS

## 📄 License

MIT
