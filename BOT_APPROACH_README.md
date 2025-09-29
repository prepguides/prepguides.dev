# 🤖 Git-Bot Content Submission System

## Overview

The content submission system has been redesigned to use a **git-bot approach** that creates PRs directly on the origin repository. This eliminates the complexity and permission issues associated with fork-based workflows.

## Architecture

```
User Form → Bot API → Origin Repository → GitHub Actions → Admin Review → Merge
```

### Flow:
1. **User submits form** → Frontend sends data to bot API
2. **Bot API** → Creates branch on origin repo with payload files
3. **Bot API** → Creates PR from that branch
4. **GitHub Actions** → Simple workflow for branch-based PRs
5. **Admins** → Review and merge PRs normally

## Key Benefits

✅ **Simplified Workflow**: No more fork complexity or permission issues  
✅ **Reliable**: Bot has full access to origin repository  
✅ **Consistent**: All PRs follow the same branch-based pattern  
✅ **Maintainable**: Single workflow handles all content submissions  
✅ **Secure**: User authentication verified before PR creation  

## Files Modified

### New Files:
- `api/github/create-content-pr.js` - Bot API endpoint
- `test-bot-api.js` - Test script for bot API
- `BOT_APPROACH_README.md` - This documentation

### Modified Files:
- `github-auth.js` - Updated to use bot API instead of fork workflow
- `.github/workflows/payload-pr-handler.yml` - Simplified for branch-based PRs
- `package.json` - Added @octokit/rest dependency

## Bot API Endpoint

**Endpoint**: `POST /api/github/create-content-pr`

**Request Body**:
```json
{
  "contentData": {
    "id": "unique-content-id",
    "title": "Content Title",
    "description": "Content Description",
    "category": "algorithms",
    "subtopic": "sorting",
    "type": "guide",
    "repo": "owner/repo",
    "path": "path/to/file.md"
  },
  "userToken": "github_access_token"
}
```

**Response**:
```json
{
  "success": true,
  "pr": {
    "number": 123,
    "html_url": "https://github.com/prepguides/prepguides.dev/pull/123",
    "title": "Content Submission: Title",
    "state": "open",
    "created_at": "2025-01-27T10:00:00Z"
  },
  "branch": "content-submission-username-1234567890",
  "message": "Content submission PR created successfully!"
}
```

## Environment Variables Required

```bash
# GitHub App Configuration
GITHUB_APP_ID=123456                    # Your GitHub App ID
GITHUB_APP_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\n..."  # App private key
GITHUB_APP_INSTALLATION_ID=789012       # Installation ID after installing app

# User Authentication (existing)
GITHUB_CLIENT_ID=your_client_id         # For user authentication
GITHUB_CLIENT_SECRET=your_client_secret # For user authentication
```

## GitHub App Setup

### Step 1: Create GitHub App
1. Go to GitHub Settings → Developer settings → GitHub Apps
2. Click "New GitHub App"
3. Fill in details:
   - **Name**: PrepGuides Content Bot
   - **Homepage URL**: https://prepguides.dev
   - **User authorization callback URL**: https://prepguides.dev/auth/callback
   - **Webhook URL**: (leave blank)
   - **Webhook secret**: (generate random string)

### Step 2: Set Permissions
- **Repository permissions:**
  - Contents: Read & write
  - Issues: Write
  - Pull requests: Write
  - Metadata: Read
  - Actions: Write
- **Organization permissions:**
  - Members: Read (if needed)

### Step 3: Subscribe to Events
- Pull request
- Issues
- Push

### Step 4: Install App
1. After creating, click "Install App"
2. Select repository: `prepguides/prepguides.dev`
3. Install the app

### Step 5: Get Credentials
1. **App ID**: Found in app settings
2. **Private Key**: Download the `.pem` file
3. **Installation ID**: Found after installing the app

## Testing

Run the test script to verify the bot API works:

```bash
node test-bot-api.js
```

## Workflow Changes

The GitHub Actions workflow has been simplified:

1. **Removed**: Fork detection logic
2. **Removed**: Complex git diff commands for fork-based PRs
3. **Simplified**: Back to standard `git diff HEAD~1 HEAD`
4. **Restored**: Direct commit and push to PR branches

## Migration from Fork Approach

The old fork-based approach has been completely replaced:

- ❌ `ensureFork()` method - Removed
- ❌ `createBranch()` method - Removed  
- ❌ `createContentFile()` method - Removed
- ❌ `formatContentAsJson()` method - Removed
- ❌ `generatePRDescription()` method - Removed

All of these are now handled by the bot API.

## Error Handling

The bot API includes comprehensive error handling:

- **User Authentication**: Verifies user token before proceeding
- **Branch Creation**: Handles branch creation failures
- **PR Creation**: Handles PR creation failures
- **Cleanup**: Removes failed branches automatically
- **Logging**: Detailed logging for debugging

## Security Considerations

- User tokens are only used for authentication verification
- Bot token is used for all repository operations
- No user credentials are stored or logged
- All operations are logged for audit purposes

## Future Enhancements

- [ ] Add PR template for bot-created PRs
- [ ] Implement automatic labeling based on content type
- [ ] Add support for multiple content files per submission
- [ ] Implement content validation before PR creation
- [ ] Add metrics and monitoring for bot operations