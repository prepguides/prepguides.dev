/**
 * Content Submission Form Handler
 * Manages the form UI and submission process
 */

class ContentForm {
    constructor() {
        this.form = null;
        this.isSubmitting = false;
        this.init();
    }

    init() {
        this.createForm();
        this.attachEventListeners();
        this.updateAuthStatus();
    }

    /**
     * Create the content submission form
     */
    createForm() {
        const formContainer = document.getElementById('content-form-container');
        if (!formContainer) return;

        formContainer.innerHTML = `
            <div class="content-submission-panel">
                <div class="auth-section">
                    <div id="auth-status" class="auth-status">
                        <div class="auth-loading">Checking authentication...</div>
                    </div>
                    <div id="login-section" class="login-section" style="display: none;">
                        <h3>🔐 GitHub Authentication Required</h3>
                        <p>Please log in with GitHub to submit content. This ensures quality control and proper attribution.</p>
                        <button id="github-login-btn" class="github-login-btn">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                            </svg>
                            Login with GitHub
                        </button>
                    </div>
                    <div id="user-section" class="user-section" style="display: none;">
                        <div class="user-info">
                            <img id="user-avatar" src="" alt="User Avatar" class="user-avatar">
                            <div class="user-details">
                                <div id="user-name" class="user-name"></div>
                                <div id="user-login" class="user-login"></div>
                            </div>
                        </div>
                        <button id="logout-btn" class="logout-btn">Logout</button>
                    </div>
                </div>

                <div id="form-section" class="form-section" style="display: none;">
                    <h3>📝 Submit New Content</h3>
                    <form id="content-form" class="content-form">
                        <div class="form-group">
                            <label for="content-title">Title *</label>
                            <input type="text" id="content-title" name="title" required 
                                   placeholder="e.g., Advanced Kubernetes Networking">
                        </div>

                        <div class="form-group">
                            <label for="content-category">Category *</label>
                            <select id="content-category" name="category" required>
                                <option value="">Select a category</option>
                                <option value="algorithms">Algorithms</option>
                                <option value="kubernetes">Kubernetes</option>
                                <option value="networking">Networking</option>
                                <option value="databases">Databases</option>
                                <option value="microservices">Microservices</option>
                                <option value="system-design">System Design</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label for="content-description">Description *</label>
                            <textarea id="content-description" name="description" required 
                                      placeholder="Brief description of the content..."></textarea>
                        </div>

                        <div class="form-group">
                            <label for="content-content">Content *</label>
                            <textarea id="content-content" name="content" required 
                                      placeholder="Your content in HTML or Markdown format..."></textarea>
                            <small class="form-help">You can use HTML tags or Markdown formatting</small>
                        </div>

                        <div class="form-group">
                            <label for="content-tags">Tags (optional)</label>
                            <input type="text" id="content-tags" name="tags" 
                                   placeholder="e.g., sorting, algorithms, interview">
                            <small class="form-help">Comma-separated tags for better discoverability</small>
                        </div>

                        <div class="form-actions">
                            <button type="button" id="preview-btn" class="preview-btn">Preview</button>
                            <button type="submit" id="submit-btn" class="submit-btn">
                                <span class="btn-text">Submit Content</span>
                                <span class="btn-loading" style="display: none;">Creating PR...</span>
                            </button>
                        </div>
                    </form>
                </div>

                <div id="preview-section" class="preview-section" style="display: none;">
                    <h3>👀 Content Preview</h3>
                    <div id="preview-content" class="preview-content"></div>
                    <div class="preview-actions">
                        <button id="back-to-form-btn" class="back-btn">Back to Form</button>
                        <button id="confirm-submit-btn" class="confirm-submit-btn">Confirm & Submit</button>
                    </div>
                </div>

                <div id="submission-result" class="submission-result" style="display: none;">
                    <div class="result-content"></div>
                </div>
            </div>
        `;
    }

    /**
     * Attach event listeners
     */
    attachEventListeners() {
        // GitHub login
        document.addEventListener('click', (e) => {
            if (e.target.id === 'github-login-btn') {
                window.githubAuth.login();
            }
        });

        // Logout
        document.addEventListener('click', (e) => {
            if (e.target.id === 'logout-btn') {
                window.githubAuth.logout();
                this.updateAuthStatus();
            }
        });

        // Form submission
        document.addEventListener('submit', (e) => {
            if (e.target.id === 'content-form') {
                e.preventDefault();
                this.handleFormSubmit();
            }
        });

        // Preview button
        document.addEventListener('click', (e) => {
            if (e.target.id === 'preview-btn') {
                this.showPreview();
            }
        });

        // Back to form
        document.addEventListener('click', (e) => {
            if (e.target.id === 'back-to-form-btn') {
                this.showForm();
            }
        });

        // Confirm submit
        document.addEventListener('click', (e) => {
            if (e.target.id === 'confirm-submit-btn') {
                this.confirmSubmit();
            }
        });
    }

    /**
     * Update authentication status
     */
    updateAuthStatus() {
        const authStatus = document.getElementById('auth-status');
        const loginSection = document.getElementById('login-section');
        const userSection = document.getElementById('user-section');
        const formSection = document.getElementById('form-section');

        if (!authStatus) return;

        // Check if GitHub OAuth is configured
        if (!window.githubAuth.isConfigured) {
            authStatus.innerHTML = '<div class="auth-error">⚠️ GitHub OAuth not configured</div>';
            loginSection.innerHTML = `
                <h3>🔧 Setup Required</h3>
                <p>GitHub OAuth is not configured. To enable content submission:</p>
                <ol style="text-align: left; margin: 15px 0;">
                    <li>Create a GitHub OAuth App</li>
                    <li>Set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET environment variables</li>
                    <li>Configure the callback URL</li>
                </ol>
                <p>See <a href="CONTENT_SUBMISSION_SETUP.md" target="_blank">setup documentation</a> for details.</p>
            `;
            loginSection.style.display = 'block';
            userSection.style.display = 'none';
            formSection.style.display = 'none';
            return;
        }

        if (window.githubAuth.isAuthenticated()) {
            authStatus.innerHTML = '<div class="auth-success">✅ Authenticated with GitHub</div>';
            loginSection.style.display = 'none';
            userSection.style.display = 'block';
            formSection.style.display = 'block';
            
            // Update user info
            const user = window.githubAuth.user;
            document.getElementById('user-avatar').src = user.avatar_url;
            document.getElementById('user-name').textContent = user.name || user.login;
            document.getElementById('user-login').textContent = `@${user.login}`;
        } else {
            authStatus.innerHTML = '<div class="auth-error">❌ Not authenticated</div>';
            loginSection.style.display = 'block';
            userSection.style.display = 'none';
            formSection.style.display = 'none';
        }
    }

    /**
     * Handle form submission
     */
    async handleFormSubmit() {
        if (this.isSubmitting) return;

        const formData = new FormData(document.getElementById('content-form'));
        const contentData = {
            title: formData.get('title'),
            category: formData.get('category'),
            description: formData.get('description'),
            content: formData.get('content'),
            tags: formData.get('tags')
        };

        // Validate form
        if (!this.validateForm(contentData)) {
            return;
        }

        this.showPreview(contentData);
    }

    /**
     * Validate form data
     */
    validateForm(data) {
        const errors = [];

        if (!data.title.trim()) {
            errors.push('Title is required');
        }

        if (!data.category) {
            errors.push('Category is required');
        }

        if (!data.description.trim()) {
            errors.push('Description is required');
        }

        if (!data.content.trim()) {
            errors.push('Content is required');
        }

        if (errors.length > 0) {
            alert('Please fix the following errors:\n' + errors.join('\n'));
            return false;
        }

        return true;
    }

    /**
     * Show content preview
     */
    showPreview(contentData = null) {
        if (!contentData) {
            const formData = new FormData(document.getElementById('content-form'));
            contentData = {
                title: formData.get('title'),
                category: formData.get('category'),
                description: formData.get('description'),
                content: formData.get('content'),
                tags: formData.get('tags')
            };
        }

        const previewContent = document.getElementById('preview-content');
        const previewSection = document.getElementById('preview-section');
        const formSection = document.getElementById('form-section');

        // Store content data for submission
        this.pendingContent = contentData;

        // Generate preview HTML
        previewContent.innerHTML = `
            <div class="preview-item">
                <h4>Title</h4>
                <p>${contentData.title}</p>
            </div>
            <div class="preview-item">
                <h4>Category</h4>
                <p>${contentData.category}</p>
            </div>
            <div class="preview-item">
                <h4>Description</h4>
                <p>${contentData.description}</p>
            </div>
            <div class="preview-item">
                <h4>Content Preview</h4>
                <div class="content-preview">${this.formatPreviewContent(contentData.content)}</div>
            </div>
            ${contentData.tags ? `
            <div class="preview-item">
                <h4>Tags</h4>
                <p>${contentData.tags}</p>
            </div>
            ` : ''}
        `;

        formSection.style.display = 'none';
        previewSection.style.display = 'block';
    }

    /**
     * Format content for preview
     */
    formatPreviewContent(content) {
        // Simple markdown to HTML conversion for preview
        return content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code>$1</code>')
            .replace(/\n/g, '<br>');
    }

    /**
     * Show form
     */
    showForm() {
        const previewSection = document.getElementById('preview-section');
        const formSection = document.getElementById('form-section');
        
        previewSection.style.display = 'none';
        formSection.style.display = 'block';
    }

    /**
     * Confirm and submit content
     */
    async confirmSubmit() {
        if (this.isSubmitting || !this.pendingContent) return;

        this.isSubmitting = true;
        const submitBtn = document.getElementById('confirm-submit-btn');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');

        btnText.style.display = 'none';
        btnLoading.style.display = 'inline';
        submitBtn.disabled = true;

        try {
            const result = await window.githubAuth.createPullRequest(this.pendingContent);
            this.showSubmissionResult(true, result);
        } catch (error) {
            console.error('Submission failed:', error);
            this.showSubmissionResult(false, error.message);
        } finally {
            this.isSubmitting = false;
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
            submitBtn.disabled = false;
        }
    }

    /**
     * Show submission result
     */
    showSubmissionResult(success, data) {
        const resultSection = document.getElementById('submission-result');
        const resultContent = resultSection.querySelector('.result-content');
        const previewSection = document.getElementById('preview-section');

        if (success) {
            resultContent.innerHTML = `
                <div class="result-success">
                    <h3>🎉 Content Submitted Successfully!</h3>
                    <p>Your content has been submitted and a pull request has been created.</p>
                    <div class="pr-info">
                        <p><strong>PR #${data.number}:</strong> <a href="${data.html_url}" target="_blank">${data.title}</a></p>
                        <p>You can track the review process on GitHub.</p>
                    </div>
                    <button onclick="location.reload()" class="new-submission-btn">Submit Another</button>
                </div>
            `;
        } else {
            resultContent.innerHTML = `
                <div class="result-error">
                    <h3>❌ Submission Failed</h3>
                    <p>There was an error submitting your content:</p>
                    <p class="error-message">${data}</p>
                    <button onclick="location.reload()" class="retry-btn">Try Again</button>
                </div>
            `;
        }

        previewSection.style.display = 'none';
        resultSection.style.display = 'block';
    }
}

// Initialize content form when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.contentForm = new ContentForm();
});
