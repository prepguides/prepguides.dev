# Content Submission System Setup

This document explains how to set up the GitHub-integrated content submission system for PrepGuides.dev.

## Features

- **GitHub OAuth Authentication**: Users must log in with GitHub to submit content
- **Automated PR Creation**: Content submissions automatically create pull requests
- **Form-based Interface**: User-friendly form for content submission
- **Preview System**: Users can preview their content before submission
- **Quality Control**: All submissions go through PR review process

## Setup Instructions

### 1. GitHub OAuth App Setup

1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Click "New OAuth App"
3. Fill in the details:
   - **Application name**: PrepGuides.dev Content Submission
   - **Homepage URL**: `https://your-domain.com`
   - **Authorization callback URL**: `https://your-domain.com/auth/callback`
4. Note down the Client ID and generate a Client Secret

### 2. Environment Variables

Create a `.env` file in the project root with:

```bash
GITHUB_CLIENT_ID=your_github_client_id_here
GITHUB_CLIENT_SECRET=your_github_client_secret_here
```

### 3. Vercel Deployment

1. Install Vercel CLI: `npm install -g vercel`
2. Set environment variables in Vercel:
   ```bash
   vercel env add GITHUB_CLIENT_ID
   vercel env add GITHUB_CLIENT_SECRET
   ```
3. Deploy: `vercel --prod`

### 4. Repository Permissions

Ensure the GitHub OAuth app has the following scopes:
- `repo` - Full control of private repositories
- `user:email` - Access to user email addresses

## How It Works

### Authentication Flow

1. User clicks "Login with GitHub"
2. Redirected to GitHub OAuth
3. User authorizes the application
4. GitHub redirects back with authorization code
5. Server exchanges code for access token
6. User is authenticated and can submit content

### Content Submission Flow

1. Authenticated user fills out the content form
2. User previews their content
3. User confirms submission
4. System creates a new branch in the repository
5. Content file is created in the appropriate category folder
6. Pull request is created with proper labels
7. User receives confirmation with PR link

### File Structure

Submitted content is organized as follows:
```
{category}/
  {sanitized-title}.html
```

Example:
```
algorithms/
  advanced-sorting-algorithms.html
kubernetes/
  pod-lifecycle-management.html
```

## API Endpoints

### POST /api/auth/github
Exchanges OAuth code for access token.

**Request:**
```json
{
  "code": "github_oauth_code"
}
```

**Response:**
```json
{
  "access_token": "gho_...",
  "token_type": "bearer",
  "scope": "repo,user:email"
}
```

### POST /api/github/create-pr
Creates a pull request for content submission.

**Request:**
```json
{
  "title": "Content Submission: Advanced Sorting",
  "body": "PR description...",
  "head": "username:branch-name",
  "base": "main"
}
```

**Response:**
```json
{
  "number": 123,
  "html_url": "https://github.com/prepguides/prepguides.dev/pull/123",
  "title": "Content Submission: Advanced Sorting",
  "state": "open",
  "created_at": "2024-01-01T00:00:00Z"
}
```

## Security Considerations

1. **OAuth Scopes**: Only request necessary scopes
2. **Token Storage**: Access tokens are stored in localStorage (client-side)
3. **HTTPS Only**: All authentication must happen over HTTPS
4. **State Parameter**: OAuth flow includes state parameter for CSRF protection
5. **Input Validation**: All form inputs are validated before submission

## Troubleshooting

### Common Issues

1. **"Invalid redirect URI"**
   - Ensure callback URL in GitHub OAuth app matches exactly
   - Check for trailing slashes or protocol mismatches

2. **"Insufficient permissions"**
   - Verify OAuth app has correct scopes
   - Check if user has access to the target repository

3. **"Failed to create PR"**
   - Ensure user has write access to the repository
   - Check if branch name conflicts exist

### Debug Mode

Enable debug logging by adding to the browser console:
```javascript
localStorage.setItem('debug', 'true');
```

## Contributing

When contributing to this system:

1. Test the OAuth flow thoroughly
2. Ensure all error cases are handled gracefully
3. Validate all user inputs
4. Test with different GitHub user permissions
5. Verify PR creation works correctly

## Future Enhancements

- [ ] GitHub App integration for better permissions
- [ ] Content templates and validation
- [ ] Automated content formatting
- [ ] Integration with CI/CD for content validation
- [ ] User dashboard for tracking submissions
- [ ] Content approval workflow
