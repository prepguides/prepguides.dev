/**
 * GitHub Authentication and Content Submission System
 * Handles OAuth login and automated PR creation for content submission
 */

class GitHubAuth {
    constructor() {
        console.log('GitHubAuth constructor called');
        // Get configuration from window object
        this.clientId = window.GITHUB_CONFIG?.clientId || null;
        this.redirectUri = this.getRedirectUri();
        this.scope = 'repo,user:email';
        this.accessToken = localStorage.getItem('github_access_token');
        this.user = JSON.parse(localStorage.getItem('github_user') || 'null');
        this.isConfigured = window.GITHUB_CONFIG?.isConfigured || false;
        
        console.log('GitHubAuth initialized:', { 
            clientId: this.clientId, 
            isConfigured: this.isConfigured,
            accessToken: !!this.accessToken,
            user: !!this.user
        });
        
        // Check if we're returning from OAuth
        this.checkOAuthReturn();
        
        // Dispatch event immediately since we have the configuration
        console.log('Dispatching githubAuthReady event');
        window.dispatchEvent(new CustomEvent('githubAuthReady', {
            detail: { isConfigured: this.isConfigured, clientId: this.clientId }
        }));
    }

    /**
     * Check if we're returning from OAuth flow
     */
    checkOAuthReturn() {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');
        const error = urlParams.get('error');
        
        console.log('Checking OAuth return:', { code, state, error, oauthInProgress: localStorage.getItem('oauth_in_progress') });
        
        // Check if we have an authorization code (regardless of oauth_in_progress flag)
        if (code) {
            console.log('Found authorization code, processing...');
            this.processOAuthCode(code, state);
        } else if (error) {
            // OAuth error
            console.log('OAuth error:', error);
            alert('Authentication failed: ' + error);
            localStorage.removeItem('oauth_in_progress');
        } else if (localStorage.getItem('oauth_in_progress') === 'true') {
            // No code, might be a fresh page load
            console.log('No code found, clearing oauth_in_progress flag');
            localStorage.removeItem('oauth_in_progress');
        }
    }

    /**
     * Process OAuth authorization code
     */
    async processOAuthCode(code, state) {
        try {
            console.log('Processing OAuth code:', code);
            
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

            console.log('OAuth response status:', response.status);

            if (!response.ok) {
                const errorData = await response.json();
                console.error('OAuth error response:', errorData);
                throw new Error(errorData.message || 'Authentication failed');
            }

            const tokenData = await response.json();
            console.log('OAuth token received:', !!tokenData.access_token);
            
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
                console.log('User info received:', this.user.login);
            }

            // Clear OAuth in progress flag
            localStorage.removeItem('oauth_in_progress');
            
            // Clean up URL
            window.history.replaceState({}, document.title, window.location.pathname);
            
            console.log('OAuth processing complete, reloading page...');
            
            // Force a page reload to ensure UI updates
            window.location.reload();
            
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
        if (currentOrigin === 'https://prepguides.dev') {
            return 'https://prepguides.dev/auth/callback';
        }
        
        // For any Vercel preview deployment (includes PR previews)
        if (currentOrigin.includes('.vercel.app')) {
            return currentOrigin + '/auth/callback';
        }
        
        // For local development
        if (currentOrigin.includes('localhost') || currentOrigin.includes('127.0.0.1')) {
            return currentOrigin + '/auth/callback';
        }
        
        // Fallback to current origin
        return currentOrigin + '/auth/callback';
    }

    /**
     * Check if GitHub OAuth is properly configured
     */
    async checkConfiguration() {
        // Use the client ID from window configuration if available
        if (window.GITHUB_CONFIG?.clientId && window.GITHUB_CONFIG?.isConfigured) {
            this.clientId = window.GITHUB_CONFIG.clientId;
            this.isConfigured = true;
            return;
        }
        
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
        
        // Validate branch name (GitHub branch names must be valid ref names)
        if (!/^[a-zA-Z0-9._-]+$/.test(branchName)) {
            throw new Error('Invalid branch name format');
        }

        try {
            console.log('Starting PR creation process...');
            
            // Create a new branch
            console.log('Creating branch:', branchName);
            await this.createBranch(branchName);
            console.log('Branch created successfully');

            // Create/update the content file
            console.log('Creating content submission file');
            await this.createContentFile(branchName, contentData);
            console.log('Content file created successfully');

            // Create pull request
            const prData = {
                title: `Content Submission: ${contentData.title}`,
                body: this.generatePRDescription(contentData),
                head: branchName, // Use the branch name directly since we created it on the main repo
                base: 'main'
            };
            
            console.log('Creating PR with data:', prData);

            const response = await fetch('/api/github/create-pr', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.accessToken}`
                },
                body: JSON.stringify(prData)
            });

            console.log('PR creation response status:', response.status);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('PR creation failed:', errorText);
                
                // Parse the error to provide better messaging
                let errorMessage = `Failed to create pull request: ${response.status}`;
                try {
                    const errorData = JSON.parse(errorText);
                    if (errorData.message) {
                        errorMessage = errorData.message;
                        
                        // Provide specific guidance for common errors
                        if (errorData.message.includes('Validation Failed')) {
                            errorMessage += '\n\nThis usually means the branch reference is invalid. Please ensure you have write access to the repository or try again.';
                        }
                    }
                } catch (e) {
                    // If we can't parse the error, use the raw text
                    errorMessage = errorText;
                }
                
                throw new Error(errorMessage);
            }

            const result = await response.json();
            console.log('PR created successfully:', result);
            return result;
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
    async createContentFile(branchName, contentData) {
        // Debug: Log content data to identify issues
        console.log('Creating content file with data:', contentData);
        
        // Validate required fields
        if (!contentData.id) {
            throw new Error('Content ID is missing or undefined');
        }
        
        // Create content payload JSON file in .github/content-payloads/ folder
        const contentJson = this.formatContentAsJson(contentData);
        const encodedContent = btoa(unescape(encodeURIComponent(contentJson)));

        // Use the correct path for content payloads
        const submissionPath = `.github/content-payloads/${contentData.id}-payload.json`;
        
        console.log('Creating payload file at:', submissionPath);

        const response = await fetch(`https://api.github.com/repos/prepguides/prepguides.dev/contents/${submissionPath}`, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${this.accessToken}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: `Add content submission: ${contentData.title}`,
                content: encodedContent,
                branch: branchName
            })
        });

        if (!response.ok) {
            throw new Error('Failed to create content submission file');
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
    formatContentAsJson(contentData) {
        // Create a JSON structure that matches the payload template format
        const payloadJson = {
            version: "1.0.0",
            type: "content-addition",
            metadata: {
                title: contentData.title,
                description: contentData.description,
                author: this.user.login,
                submissionDate: new Date().toISOString().split('T')[0],
                category: contentData.category,
                subtopic: contentData.subtopic || 'general'
            },
            content: {
                id: contentData.id,
                title: contentData.title,
                description: contentData.description,
                type: contentData.type || 'guide',
                status: contentData.status || 'pending',
                repo: contentData.repo || '',
                path: contentData.path || ''
            },
            validation: {
                repoAccessible: true,
                fileExists: true,
                contentValid: true,
                categoryValid: true
            }
        };

        // Add type-specific fields to content

        if (contentData.features && contentData.features.length > 0) {
            payloadJson.content.features = contentData.features;
        }

        if (contentData.jsFile) {
            payloadJson.content.jsFile = contentData.jsFile;
        }

        return JSON.stringify(payloadJson, null, 2);
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
${(contentData.content || contentData.description || '').substring(0, 200)}${(contentData.content || contentData.description || '').length > 200 ? '...' : ''}

### Review Checklist
- [ ] Content is technically accurate
- [ ] Formatting follows site standards
- [ ] No sensitive information included
- [ ] Appropriate category placement

### Notes
This content was submitted via the PrepGuides.dev content submission form.`;
    }
}

// Initialize GitHub Auth when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded - initializing GitHub auth');
    window.githubAuth = new GitHubAuth();
});
