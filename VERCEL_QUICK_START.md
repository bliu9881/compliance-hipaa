# Vercel Quick Start

## Deploy in 5 Minutes

### 1. Push to GitHub
```bash
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

### 2. Import to Vercel
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Select `compliance-hipaa` as root directory
4. Click **Deploy**

### 3. Add Environment Variables
In Vercel Dashboard → Settings → Environment Variables:

```
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here
```

### 4. Redeploy
Deployments → [Latest] → ⋯ → Redeploy

### 5. Test
Open your Vercel URL and scan a repository!

---

## What's Deployed

- ✅ Frontend (React + Vite)
- ✅ `/api/analyze` - AWS Bedrock HIPAA analysis
- ✅ `/api/github-proxy` - GitHub API proxy
- ✅ Automatic HTTPS
- ✅ Global CDN

---

## Troubleshooting

**"Analysis Service Error"**
→ Check AWS credentials in Vercel environment variables

**"API request failed"**
→ Check Vercel function logs in Dashboard

**GitHub proxy not working**
→ Verify `vercel.json` exists in root

---

## Full Documentation

See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for complete guide.
