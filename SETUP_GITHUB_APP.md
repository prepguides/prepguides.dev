# GitHub App Setup for Content Submission

## Quick Setup Guide

The content submission feature requires a GitHub App to be configured. Follow these steps to set it up:

### 1. Create GitHub App

1. Go to [GitHub Settings → Developer settings → GitHub Apps](https://github.com/settings/apps)
2. Click "New GitHub App"
3. Fill in the details:
   - **App name**: `PrepGuides Content Bot`
   - **Homepage URL**: `https://prepguides.dev`
   - **User authorization callback URL**: `https://prepguides.dev/auth/callback`
   - **Webhook URL**: (leave blank for now)
   - **Webhook secret**: (generate a random string)

### 2. Set App Permissions

**Repository permissions:**
- Contents: Read & write
- Issues: Write  
- Pull requests: Write
- Metadata: Read
- Actions: Write

**Organization permissions:**
- Members: Read (if needed)

### 3. Subscribe to Events
- Pull request
- Issues
- Push

### 4. Install the App

1. After creating the app, click "Install App"
2. Select repository: `prepguides/prepguides.dev`
3. Install the app

### 5. Get Required Credentials

1. **App ID**: Found in the app settings (General tab)
2. **Private Key**: 
   - Go to the app settings
   - Scroll down to "Private keys"
   - Click "Generate a private key"
   - Download the `.pem` file
   - Copy the entire content including `-----BEGIN RSA PRIVATE KEY-----` and `-----END RSA PRIVATE KEY-----`
3. **Installation ID**: 
   - After installing the app, go to the installation page
   - The Installation ID is in the URL: `https://github.com/settings/installations/[INSTALLATION_ID]`

### 6. Set Environment Variables

Create a `.env` file in the project root with:

```bash
# GitHub OAuth Configuration (already configured)
GITHUB_CLIENT_ID=Ov23liX9YTDE0e7OaBLs
GITHUB_CLIENT_SECRET=your_github_client_secret_here

# Repository Configuration
GITHUB_REPO_OWNER=prepguides
GITHUB_REPO_NAME=prepguides.dev

# GitHub App Configuration (add these)
GITHUB_APP_ID=123456
GITHUB_APP_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\nMIIEpAIBAAKCAQEA...\n-----END RSA PRIVATE KEY-----"
GITHUB_APP_INSTALLATION_ID=789012
```

### 7. Deploy to Vercel

If deploying to Vercel, add the environment variables:

```bash
vercel env add GITHUB_APP_ID
vercel env add GITHUB_APP_PRIVATE_KEY  
vercel env add GITHUB_APP_INSTALLATION_ID
```

### 8. Test the Setup

1. Start the development server: `npm run dev`
2. Try submitting content through the form
3. Check the browser console for any errors

## Troubleshooting

### Common Issues

1. **"GitHub App not configured" error**
   - Make sure all three environment variables are set
   - Check that the private key includes the full PEM format
   - Verify the Installation ID is correct

2. **"Authentication failed" error**
   - Make sure the GitHub App is installed on the repository
   - Check that the app has the correct permissions

3. **"Invalid content data" error**
   - Make sure all required form fields are filled
   - Check the content data structure

### Testing the Bot API

You can test the bot API directly:

```bash
node test-bot-api.js
```

## Security Notes

- Never commit the `.env` file to version control
- Keep the private key secure
- Regularly rotate the private key if needed
- Use environment variables in production

## Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify all environment variables are set correctly
3. Ensure the GitHub App has the correct permissions
4. Check the GitHub App installation status
