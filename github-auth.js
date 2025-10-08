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
        console.log('Logging out user...');
        this.accessToken = null;
        this.user = null;
        localStorage.removeItem('github_access_token');
        localStorage.removeItem('github_user');
        
        // Force page reload to update UI
        console.log('Reloading page after logout...');
        window.location.reload();
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
     * Create a pull request with submitted content using bot API
     */
    async createPullRequest(contentData) {
        if (!this.isAuthenticated()) {
            throw new Error('User not authenticated');
        }

        try {
            console.log('🤖 Starting bot-based PR creation process...');
            
            // Use the bot API to create the PR
            const response = await fetch('/api/github/create-content-pr', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contentData: contentData,
                    userToken: this.accessToken
                })
            });

            console.log('Bot API response status:', response.status);
            
            if (!response.ok) {
                // Clone the response to avoid "body stream already read" error
                const responseClone = response.clone();
                let errorData;
                try {
                    errorData = await response.json();
                } catch (jsonError) {
                    console.error('Failed to parse error response as JSON:', jsonError);
                    try {
                        const textResponse = await responseClone.text();
                        console.error('Raw error response:', textResponse);
                        throw new Error(`Server error: ${response.status} - ${textResponse.substring(0, 100)}`);
                    } catch (textError) {
                        console.error('Failed to read response as text:', textError);
                        throw new Error(`Server error: ${response.status} - Unable to read response body`);
                    }
                }
                console.error('Bot PR creation failed:', errorData);
                throw new Error(errorData.message || `Failed to create pull request: ${response.status}`);
            }

            const result = await response.json();
            console.log('✅ Bot PR created successfully:', result);
            return result.pr;
        } catch (error) {
            console.error('Failed to create pull request via bot:', error);
            throw error;
        }
    }

    /**
     * Ensure user has a fork of the repository
     */
    async ensureFork() {
        const forkRepoName = `${this.user.login}/prepguides.dev`;
        
        // Check if fork already exists
        const forkResponse = await fetch(`https://api.github.com/repos/${forkRepoName}`, {
            headers: {
                'Authorization': `token ${this.accessToken}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        
        if (forkResponse.ok) {
            console.log(`Fork already exists: ${forkRepoName}`);
            return await forkResponse.json();
        }
        
        // Create fork if it doesn't exist
        console.log(`Creating fork: ${forkRepoName}`);
        const createForkResponse = await fetch('https://api.github.com/repos/prepguides/prepguides.dev/forks', {
            method: 'POST',
            headers: {
                'Authorization': `token ${this.accessToken}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        
        if (!createForkResponse.ok) {
            const errorText = await createForkResponse.text();
            console.error('Fork creation failed:', {
                status: createForkResponse.status,
                statusText: createForkResponse.statusText,
                error: errorText
            });
            throw new Error(`Failed to create fork: ${createForkResponse.status} ${createForkResponse.statusText}`);
        }
        
        const forkRepo = await createForkResponse.json();
        console.log(`Fork created successfully: ${forkRepo.full_name}`);
        
        // Wait a moment for the fork to be fully initialized
        console.log('Waiting for fork to be fully initialized...');
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        return forkRepo;
    }

    /**
     * Create a new branch
     */
    async createBranch(branchName) {
        console.log(`Creating branch: ${branchName}`);
        console.log(`Using access token: ${this.accessToken ? 'Present' : 'Missing'}`);
        console.log(`User: ${this.user ? this.user.login : 'Unknown'}`);
        console.log(`Fork-based workflow: Enabled`);
        
        // First, ensure user has a fork of the repository
        const forkRepo = await this.ensureFork();
        console.log(`Using fork repository: ${forkRepo.full_name}`);
        
        // Get the latest commit SHA from main branch of the fork (with retry)
        let mainBranchResponse;
        let retryCount = 0;
        const maxRetries = 3;
        
        while (retryCount < maxRetries) {
            console.log(`Attempting to get main branch SHA (attempt ${retryCount + 1}/${maxRetries})`);
            
            mainBranchResponse = await fetch(`https://api.github.com/repos/${forkRepo.full_name}/git/refs/heads/main`, {
                headers: {
                    'Authorization': `token ${this.accessToken}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            
            if (mainBranchResponse.ok) {
                break;
            }
            
            retryCount++;
            if (retryCount < maxRetries) {
                console.log(`Main branch not ready, waiting 3 seconds before retry...`);
                await new Promise(resolve => setTimeout(resolve, 3000));
            }
        }

        if (!mainBranchResponse.ok) {
            const errorText = await mainBranchResponse.text();
            console.error('Main branch fetch failed:', {
                status: mainBranchResponse.status,
                statusText: mainBranchResponse.statusText,
                error: errorText
            });
            throw new Error(`Failed to get main branch reference: ${mainBranchResponse.status} ${mainBranchResponse.statusText}`);
        }

        const mainBranch = await mainBranchResponse.json();
        const mainSha = mainBranch.object.sha;

        // Create new branch in the fork
        const branchResponse = await fetch(`https://api.github.com/repos/${forkRepo.full_name}/git/refs`, {
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
            const errorText = await branchResponse.text();
            console.error('Branch creation failed:', {
                status: branchResponse.status,
                statusText: branchResponse.statusText,
                error: errorText
            });
            throw new Error(`Failed to create branch: ${branchResponse.status} ${branchResponse.statusText}`);
        }

        return await branchResponse.json();
    }

    /**
     * Create content file in the repository
     */
    async createContentFile(branchName, contentData, forkRepo) {
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

        const response = await fetch(`https://api.github.com/repos/${forkRepo.full_name}/contents/${submissionPath}`, {
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
