# Vercel Deployment Setup Guide

## 🔧 **Required GitHub Secrets**

To enable Vercel deployment, you need to add these secrets to your GitHub repository:

### 1. **VERCEL_TOKEN**
- Go to [Vercel Dashboard](https://vercel.com/account/tokens)
- Create a new token with appropriate permissions
- Copy the token value

### 2. **VERCEL_ORG_ID**
- Go to [Vercel Dashboard](https://vercel.com/account)
- Copy your Organization ID from the URL or settings

### 3. **VERCEL_PROJECT_ID**
- Go to your project in Vercel Dashboard
- Copy the Project ID from the project settings

## 📋 **How to Add Secrets to GitHub**

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add each secret:
   - Name: `VERCEL_TOKEN`, Value: `[your-vercel-token]`
   - Name: `VERCEL_ORG_ID`, Value: `[your-org-id]`
   - Name: `VERCEL_PROJECT_ID`, Value: `[your-project-id]`

## 🚀 **Expected Results**

Once secrets are configured:
- ✅ Vercel deployments will work automatically
- ✅ GitHub will show deployment stats and counts
- ✅ Site will be deployed to: `https://prepguides-dev.vercel.app`
- ✅ Preview deployments will work for PRs

## 🔍 **Troubleshooting**

If deployments still fail:
1. Verify all three secrets are correctly set
2. Check Vercel token permissions
3. Ensure project exists in Vercel dashboard
4. Check GitHub Actions logs for specific error messages
