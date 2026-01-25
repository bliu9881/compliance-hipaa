# Quick Reference - Private GitHub Repository Support

## 🚀 Quick Start (Choose Your Path)

### Path 1: Local Testing Only (5 minutes)
```bash
npm run dev
# Test with public repos (no token needed)
# Test with private repos (token required, but CORS will block)
```

### Path 2: Full Deployment (20 minutes)
```bash
# 1. Deploy Lambda proxy
npm run deploy:lambda

# 2. Copy endpoint from output
# GitHubProxyProxyEndpoint: https://xxxxx.execute-api.us-east-1.amazonaws.com/dev/proxy

# 3. Update scanService.ts with endpoint URL
# Replace GITHUB_PROXY_URL constant

# 4. Test
npm run dev
```

---

## 📋 Key Files

| File | Purpose |
|------|---------|
| `components/Scanner.tsx` | Token input UI |
| `services/scanService.ts` | GitHub API calls + token auth |
| `api/github-proxy.ts` | Lambda proxy function |
| `cdk/github-proxy-stack.ts` | AWS infrastructure |
| `services/scanService.test.ts` | 65 tests (all passing) |

---

## 🔐 Security Checklist

- ✅ Token stored in `sessionStorage` (not `localStorage`)
- ✅ Token cleared on page refresh
- ✅ Token masked in password field
- ✅ Token never logged to console
- ✅ Token never in scan results
- ✅ Token never sent to Supabase

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Expected: 65 tests passed ✅

# Run specific test
npm test -- --grep "Token Storage"

# Test private repo
# See PRIVATE_REPO_TESTING_GUIDE.md
```

---

## 🛠️ Deployment Commands

```bash
# Deploy to dev
npm run deploy:lambda

# Deploy to prod
npm run deploy:lambda:prod

# View logs
aws logs tail /aws/lambda/github-proxy-dev --follow

# Cleanup
npm run cdk:destroy
```

---

## 🔧 Update Frontend (After Deployment)

Open `services/scanService.ts` and replace `callGitHubAPI` function:

```typescript
const GITHUB_PROXY_URL = 'https://xxxxx.execute-api.us-east-1.amazonaws.com/dev/proxy';

const callGitHubAPI = async (
  action: 'getCommitSha' | 'getRepoContents' | 'getFileContent',
  owner: string,
  repo: string,
  path?: string,
  token?: string
): Promise<any> => {
  const response = await fetch(GITHUB_PROXY_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, owner, repo, path, token }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || `Proxy error: ${response.statusText}`);
  }

  const result = await response.json();
  if (!result.success) throw new Error(result.error || 'Proxy request failed');
  return result.data;
};
```

**Replace** `https://xxxxx.execute-api.us-east-1.amazonaws.com/dev/proxy` with your actual endpoint.

---

## 📊 Test Results

```
✓ Token Storage and Retrieval (3 tests)
✓ GitHub Error Handling (6 tests)
✓ Token Validation (5 tests)
✓ Token Non-Persistence (5 tests)
✓ Token Input Masking (5 tests)
✓ Authentication Header Consistency (7 tests)
✓ Private Repository Access (7 tests)
✓ Token Session Isolation - UI Integration (6 tests)
✓ Public Repository Access (5 tests)
✓ UI State Management (16 tests)

Total: 65 tests ✅
```

---

## 💰 Cost

- Lambda: $0.20/month
- API Gateway: $3.50/month
- CloudWatch: $0.50/month
- **Total: ~$4.20/month**

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| "Failed to fetch" | Deploy Lambda proxy or check endpoint URL |
| Lambda timeout | Check logs, increase timeout in CDK |
| Token not stored | Disable private browsing, check sessionStorage |
| Deployment failed | Run `cdk bootstrap`, check AWS credentials |

---

## 📚 Documentation

- **This file**: Quick reference
- `START_HERE_DEPLOYMENT.md`: 20-minute deployment guide
- `QUICK_DEPLOY.md`: 5-minute quick start
- `DEPLOYMENT_GUIDE.md`: Detailed reference
- `PRIVATE_REPO_TESTING_GUIDE.md`: Testing instructions
- `IMPLEMENTATION_SUMMARY.md`: Complete overview

---

## ✅ Verification Checklist

- [ ] All 65 tests passing: `npm test`
- [ ] Lambda deployed: `npm run deploy:lambda`
- [ ] Frontend updated with proxy endpoint
- [ ] Token input appears in Scanner UI
- [ ] Token validation feedback works
- [ ] Private repo scan completes
- [ ] Token not in localStorage
- [ ] Token cleared on page refresh

---

## 🎯 Next Steps

1. **Review**: Read `IMPLEMENTATION_SUMMARY.md`
2. **Test**: Run `npm test` (verify 65 tests pass)
3. **Deploy**: Run `npm run deploy:lambda`
4. **Integrate**: Update `scanService.ts` with endpoint
5. **Verify**: Test with private repository
6. **Monitor**: Check logs with `aws logs tail ...`

---

## 🚀 You're Ready!

Your app can now scan private GitHub repositories securely! 🎉

Questions? Check the documentation files or review the test cases for expected behavior.

