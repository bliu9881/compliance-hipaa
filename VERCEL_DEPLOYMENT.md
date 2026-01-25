# Vercel Deployment Guide

## Overview

This guide explains how to deploy GuardPHI to Vercel with AWS Bedrock integration for HIPAA compliance scanning.

---

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **AWS Account**: With Bedrock access enabled
3. **AWS Credentials**: Access Key ID and Secret Access Key with Bedrock permissions
4. **GitHub Repository**: Your code pushed to GitHub

---

## Step 1: Prepare Your Repository

Ensure these files are in your repository:

- ✅ `vercel.json` - Vercel configuration
- ✅ `api/analyze.ts` - Bedrock analysis endpoint
- ✅ `api/github-proxy.ts` - GitHub proxy endpoint
- ✅ `services/bedrockService.ts` - Frontend service calling API

---

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Configure project:
   - **Framework Preset**: Vite
   - **Root Directory**: `compliance-hipaa`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to project
cd compliance-hipaa

# Deploy
vercel
```

---

## Step 3: Configure Environment Variables

In Vercel Dashboard → Settings → Environment Variables, add:

### Required Variables

| Variable | Value | Environment |
|----------|-------|-------------|
| `AWS_REGION` | `us-east-1` | Production, Preview, Development |
| `AWS_ACCESS_KEY_ID` | Your AWS Access Key | Production, Preview, Development |
| `AWS_SECRET_ACCESS_KEY` | Your AWS Secret Key | Production, Preview, Development |

### How to Add Variables

1. Go to your project in Vercel Dashboard
2. Click **Settings** → **Environment Variables**
3. Add each variable:
   - **Key**: Variable name (e.g., `AWS_REGION`)
   - **Value**: Variable value
   - **Environments**: Select all (Production, Preview, Development)
4. Click **Save**

---

## Step 4: Verify Deployment

### Test the Frontend

1. Open your Vercel deployment URL (e.g., `https://your-app.vercel.app`)
2. Navigate to the Scanner page
3. Try scanning a repository

### Test the API Endpoint

```bash
# Test analyze endpoint
curl -X POST https://your-app.vercel.app/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "code": "const password = \"hardcoded123\";",
    "fileName": "test.js"
  }'
```

Expected response:
```json
{
  "findings": [
    {
      "id": "...",
      "title": "Hardcoded Credentials",
      "severity": "CRITICAL",
      ...
    }
  ]
}
```

### Test GitHub Proxy

```bash
# Test GitHub proxy
curl -X POST https://your-app.vercel.app/api/github-proxy \
  -H "Content-Type: application/json" \
  -d '{
    "action": "getCommitSha",
    "owner": "torvalds",
    "repo": "linux"
  }'
```

---

## Step 5: Update Frontend Configuration (if needed)

If you deployed the GitHub proxy separately to AWS Lambda, update the proxy URL:

**File**: `services/scanService.ts`

```typescript
// Update this line with your Lambda URL
const GITHUB_PROXY_URL = 'https://your-lambda-url.amazonaws.com/dev/proxy';
```

For Vercel deployment, the default `/api/github-proxy` will work automatically.

---

## Architecture

### Vercel Deployment

```
┌─────────────────────────────────────────┐
│         Vercel Deployment               │
├─────────────────────────────────────────┤
│                                         │
│  Frontend (Vite + React)                │
│  ├─ Static files served from CDN       │
│  └─ Calls /api/* endpoints              │
│                                         │
│  Serverless Functions                   │
│  ├─ /api/analyze                        │
│  │   └─ Calls AWS Bedrock              │
│  └─ /api/github-proxy                   │
│      └─ Calls GitHub API                │
│                                         │
└─────────────────────────────────────────┘
         │                    │
         │                    │
         ▼                    ▼
    AWS Bedrock          GitHub API
```

---

## Troubleshooting

### Issue: "Analysis Service Error"

**Cause**: AWS credentials not configured or Bedrock not accessible

**Solution**:
1. Verify environment variables in Vercel Dashboard
2. Check AWS credentials have Bedrock permissions
3. Ensure Bedrock is enabled in your AWS region
4. Check Vercel function logs for detailed errors

### Issue: "API request failed: 500"

**Cause**: Bedrock API error or model not available

**Solution**:
1. Check Vercel function logs: Dashboard → Deployments → [Latest] → Functions
2. Verify Bedrock model access in AWS Console
3. Try different Bedrock model in `api/analyze.ts`

### Issue: GitHub proxy not working

**Cause**: CORS or endpoint configuration

**Solution**:
1. Verify `vercel.json` has correct rewrites
2. Check browser console for CORS errors
3. Test endpoint directly with curl

---

## Cost Estimate

### Vercel Costs
- **Hobby Plan**: Free (includes 100GB bandwidth, 100 serverless function executions/day)
- **Pro Plan**: $20/month (includes 1TB bandwidth, unlimited functions)

### AWS Bedrock Costs
- **Claude 3.5 Sonnet**: ~$0.003 per 1K input tokens, ~$0.015 per 1K output tokens
- **Estimated**: ~$0.10-0.50 per scan (depending on code size)
- **Monthly**: ~$10-50 for moderate usage (100-500 scans)

**Total Estimated Monthly Cost**: $10-70 (depending on usage)

---

## Security Best Practices

1. **Never commit AWS credentials** to your repository
2. **Use Vercel environment variables** for all secrets
3. **Enable Vercel's security features**:
   - Automatic HTTPS
   - DDoS protection
   - Edge caching
4. **Rotate AWS credentials** regularly
5. **Monitor usage** in AWS CloudWatch and Vercel Analytics

---

## Updating Your Deployment

### Update Code

```bash
# Make changes to your code
git add .
git commit -m "Update feature"
git push origin main
```

Vercel will automatically redeploy on push to main branch.

### Update Environment Variables

1. Go to Vercel Dashboard → Settings → Environment Variables
2. Edit the variable
3. Click **Save**
4. Redeploy: Deployments → [Latest] → ⋯ → Redeploy

---

## Monitoring

### Vercel Analytics

- View in Dashboard → Analytics
- Track page views, performance, errors

### AWS CloudWatch

- Monitor Bedrock API calls
- Track costs and usage
- Set up billing alerts

### Function Logs

- View in Vercel Dashboard → Deployments → [Latest] → Functions
- Real-time logs for debugging

---

## Next Steps

1. ✅ Deploy to Vercel
2. ✅ Configure environment variables
3. ✅ Test all endpoints
4. 🎯 Set up custom domain (optional)
5. 🎯 Configure Supabase for user authentication
6. 🎯 Enable monitoring and alerts
7. 🎯 Set up CI/CD pipeline

---

## Support

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **AWS Bedrock Docs**: [docs.aws.amazon.com/bedrock](https://docs.aws.amazon.com/bedrock)
- **Project Issues**: Check GitHub repository issues

---

## Summary

Your GuardPHI app is now deployed to Vercel with:
- ✅ Frontend served from Vercel CDN
- ✅ Serverless API endpoints for analysis and GitHub proxy
- ✅ AWS Bedrock integration for HIPAA compliance scanning
- ✅ Automatic HTTPS and security features
- ✅ Scalable architecture ready for production use
