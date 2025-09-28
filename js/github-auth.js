/**
 * GitHub Authentication and Content Submission System
 * Handles OAuth login and automated PR creation for content submission
 */

class GitHubAuth {
    constructor() {
        // Get configuration from window object
        this.clientId = window.GITHUB_CONFIG?.clientId || null;
        this.redirectUri = this.getRedirectUri();
        this.scope = 'repo,user:email';
        this.accessToken = localStorage.getItem('github_access_token');
        this.user = JSON.parse(localStorage.getItem('github_user') || 'null');
        this.isConfigured = window.GITHUB_CONFIG?.isConfigured || false;
        
        // Check if we're returning from OAuth
        this.checkOAuthReturn();
        
        // Still try to check configuration for dynamic updates
        this.checkConfiguration();
    }

    /**
     * Check if we're returning from OAuth flow
     */
    checkOAuthReturn() {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');
        const error = urlParams.get('error');
        
        if (localStorage.getItem('oauth_in_progress') === 'true') {
            if (code) {
                // We have an authorization code, process it
                this.processOAuthCode(code, state);
            } else if (error) {
                // OAuth error
                alert('Authentication failed: ' + error);
                localStorage.removeItem('oauth_in_progress');
            } else {
                // No code, might be a fresh page load
                localStorage.removeItem('oauth_in_progress');
            }
        }
    }

    /**
     * Process OAuth authorization code
     */
    async processOAuthCode(code, state) {
        try {
            // Process the OAuth callback
            const response = await fetch('/api/auth/github', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    code: code,
                    state: state
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Authentication failed');
            }

            const tokenData = await response.json();
            
            // Store the access token
            this.accessToken = tokenData.access_token;
            localStorage.setItem('github_access_token', this.accessToken);
            
            // Get user info
            const userResponse = await fetch('https://api.github.com/user', {
                headers: {
                    'Authorization': `token ${this.accessToken}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (userResponse.ok) {
                this.user = await userResponse.json();
                localStorage.setItem('github_user', JSON.stringify(this.user));
            }

            // Clear OAuth in progress flag
            localStorage.removeItem('oauth_in_progress');
            
            // Clean up URL
            window.history.replaceState({}, document.title, window.location.pathname);
            
            // Update the UI
            if (window.contentForm) {
                window.contentForm.updateAuthStatus();
            }
            
            alert('Successfully authenticated with GitHub!');
            
        } catch (error) {
            console.error('OAuth processing error:', error);
            alert('Authentication failed: ' + error.message);
            localStorage.removeItem('oauth_in_progress');
        }
    }

    /**
     * Get the appropriate redirect URI based on the current environment
     */
    getRedirectUri() {
        const currentOrigin = window.location.origin;
        
        // For production domain
        if (currentOrigin === 'https://prepguides-dev.vercel.app') {
            return 'https://prepguides-dev.vercel.app/auth/callback';
        }
        
        // For any Vercel preview deployment (includes PR previews)
        if (currentOrigin.includes('.vercel.app')) {
            return currentOrigin + '/auth/callback';
        }
        
        // For local development
        if (currentOrigin.includes('localhost') || currentOrigin.includes('127.0.0.1')) {
            return 'http://localhost:3000/auth/callback';
        }
        
        // Fallback to current origin
        return currentOrigin + '/auth/callback';
    }

    /**
     * Check if GitHub OAuth is properly configured
     */
    async checkConfiguration() {
        // For now, assume it's configured since environment variables are set
        // This will be updated when the API endpoints are working
        this.isConfigured = true;
        this.clientId = 'your_github_client_id'; // This should be replaced with actual client ID
        
        // Try to get the actual client ID from the config endpoint
        try {
            const configResponse = await fetch('/api/config');
            if (configResponse.ok) {
                const config = await configResponse.json();
                if (config.client_id) {
                    this.clientId = config.client_id;
                    this.isConfigured = true;
                } else {
                    this.isConfigured = false;
                }
                return;
            }
        } catch (error) {
            console.log('Config endpoint not available, using fallback');
        }

        // Fallback: try the auth endpoint
        try {
            const response = await fetch('/api/auth/github', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code: 'test' })
            });
            
            // If we get a 503, it means OAuth is not configured
            this.isConfigured = response.status !== 503;
        } catch (error) {
            console.log('Auth endpoint not available, using fallback configuration');
            // For now, assume configured since env vars are set in Vercel
            this.isConfigured = true;
        }
    }

    /**
     * Initiate GitHub OAuth flow using popup
     */
    login() {
        if (!this.isConfigured) {
            alert('GitHub OAuth is not configured. Please contact the administrator to set up GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET environment variables.');
            return;
        }

        // For now, let's use a simple approach - redirect to GitHub and handle the callback manually
        const authUrl = `https://github.com/login/oauth/authorize?` +
            `client_id=${this.clientId}&` +
            `scope=${this.scope}&` +
            `state=${this.generateState()}`;
        
        // Store that we're in the middle of OAuth
        localStorage.setItem('oauth_in_progress', 'true');
        
        window.location.href = authUrl;
    }

    /**
     * Get the callback URI for OAuth (handles preview deployment issue)
     */
    getCallbackUri() {
        const currentOrigin = window.location.origin;
        
        // For production, use the current origin
        if (currentOrigin === 'https://prepguides-dev.vercel.app') {
            return currentOrigin + '/auth/callback';
        }
        
        // For preview deployments, use production callback URL
        // This works because the callback page can handle the redirect
        return 'https://prepguides-dev.vercel.app/auth/callback';
    }

    /**
     * Handle OAuth callback
     */
    async handleCallback() {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');

        if (!code) {
            console.error('No authorization code received');
            return false;
        }

        try {
            const tokenResponse = await this.exchangeCodeForToken(code);
            this.accessToken = tokenResponse.access_token;
            localStorage.setItem('github_access_token', this.accessToken);

            const userResponse = await this.getUserInfo();
            this.user = userResponse;
            localStorage.setItem('github_user', JSON.stringify(this.user));

            // Clean up URL
            window.history.replaceState({}, document.title, window.location.pathname);
            return true;
        } catch (error) {
            console.error('Authentication failed:', error);
            return false;
        }
    }

    /**
     * Exchange authorization code for access token
     */
    async exchangeCodeForToken(code) {
        const response = await fetch('/api/auth/github', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code })
        });

        if (!response.ok) {
            throw new Error('Failed to exchange code for token');
        }

        return await response.json();
    }

    /**
     * Get authenticated user information
     */
    async getUserInfo() {
        const response = await fetch('https://api.github.com/user', {
            headers: {
                'Authorization': `token ${this.accessToken}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to get user info');
        }

        return await response.json();
    }

    /**
     * Logout user
     */
    logout() {
        this.accessToken = null;
        this.user = null;
        localStorage.removeItem('github_access_token');
        localStorage.removeItem('github_user');
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated() {
        return !!this.accessToken && !!this.user;
    }

    /**
     * Generate random state for OAuth security
     */
    generateState() {
        return Math.random().toString(36).substring(2, 15) + 
               Math.random().toString(36).substring(2, 15);
    }

    /**
     * Create a pull request with submitted content
     */
    async createPullRequest(contentData) {
        if (!this.isAuthenticated()) {
            throw new Error('User not authenticated');
        }

        const branchName = `content-submission-${Date.now()}`;
        const fileName = this.generateFileName(contentData);
        const filePath = this.getFilePath(contentData);

        try {
            // Create a new branch
            await this.createBranch(branchName);

            // Create/update the content file
            await this.createContentFile(branchName, filePath, contentData);

            // Create pull request
            const prData = {
                title: `Content Submission: ${contentData.title}`,
                body: this.generatePRDescription(contentData),
                head: `${this.user.login}:${branchName}`,
                base: 'main'
            };

            const response = await fetch('/api/github/create-pr', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.accessToken}`
                },
                body: JSON.stringify(prData)
            });

            if (!response.ok) {
                throw new Error('Failed to create pull request');
            }

            return await response.json();
        } catch (error) {
            console.error('Failed to create pull request:', error);
            throw error;
        }
    }

    /**
     * Create a new branch
     */
    async createBranch(branchName) {
        // Get the latest commit SHA from main branch
        const mainBranchResponse = await fetch('https://api.github.com/repos/prepguides/prepguides.dev/git/refs/heads/main', {
            headers: {
                'Authorization': `token ${this.accessToken}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        if (!mainBranchResponse.ok) {
            throw new Error('Failed to get main branch reference');
        }

        const mainBranch = await mainBranchResponse.json();
        const mainSha = mainBranch.object.sha;

        // Create new branch
        const branchResponse = await fetch('https://api.github.com/repos/prepguides/prepguides.dev/git/refs', {
            method: 'POST',
            headers: {
                'Authorization': `token ${this.accessToken}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ref: `refs/heads/${branchName}`,
                sha: mainSha
            })
        });

        if (!branchResponse.ok) {
            throw new Error('Failed to create branch');
        }

        return await branchResponse.json();
    }

    /**
     * Create content file in the repository
     */
    async createContentFile(branchName, filePath, contentData) {
        const content = this.formatContent(contentData);
        const encodedContent = btoa(unescape(encodeURIComponent(content)));

        const response = await fetch(`https://api.github.com/repos/prepguides/prepguides.dev/contents/${filePath}`, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${this.accessToken}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: `Add content: ${contentData.title}`,
                content: encodedContent,
                branch: branchName
            })
        });

        if (!response.ok) {
            throw new Error('Failed to create content file');
        }

        return await response.json();
    }

    /**
     * Generate filename for content
     */
    generateFileName(contentData) {
        const sanitized = contentData.title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .substring(0, 50);
        return `${sanitized}.html`;
    }

    /**
     * Get file path based on category
     */
    getFilePath(contentData) {
        const category = contentData.category.toLowerCase();
        return `${category}/${this.generateFileName(contentData)}`;
    }

    /**
     * Format content as HTML
     */
    formatContent(contentData) {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${contentData.title} - PrepGuides.dev</title>
    <meta name="description" content="${contentData.description}">
    <style>
        /* Add your custom styles here */
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        .content {
            background: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
    </style>
</head>
<body>
    <div class="content">
        <h1>${contentData.title}</h1>
        <p><strong>Category:</strong> ${contentData.category}</p>
        <p><strong>Description:</strong> ${contentData.description}</p>
        
        <div class="main-content">
            ${contentData.content}
        </div>
        
        <hr>
        <p><em>Submitted by: ${this.user.login} on ${new Date().toISOString()}</em></p>
    </div>
</body>
</html>`;
    }

    /**
     * Generate PR description
     */
    generatePRDescription(contentData) {
        return `## Content Submission

**Title:** ${contentData.title}
**Category:** ${contentData.category}
**Submitted by:** @${this.user.login}

### Description
${contentData.description}

### Content Preview
${contentData.content.substring(0, 200)}${contentData.content.length > 200 ? '...' : ''}

### Review Checklist
- [ ] Content is technically accurate
- [ ] Formatting follows site standards
- [ ] No sensitive information included
- [ ] Appropriate category placement

### Notes
This content was submitted via the PrepGuides.dev content submission form.`;
    }
}

// Initialize GitHub Auth
window.githubAuth = new GitHubAuth();
