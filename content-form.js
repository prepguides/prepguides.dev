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
                <div class="form-header">
                    <h3>📝 Submit New Content</h3>
                    <button id="close-form-btn" class="close-form-btn">✕</button>
                </div>
                
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
                        <label for="content-subtopic">Subtopic *</label>
                        <input type="text" id="content-subtopic" name="subtopic" required 
                               placeholder="e.g., request-flow, sorting, osi-model">
                        <small class="form-help">URL-friendly name for the subtopic (lowercase, hyphens)</small>
                    </div>

                    <div class="form-group">
                        <label for="content-description">Description *</label>
                        <textarea id="content-description" name="description" required 
                                  placeholder="Brief description of the content..."></textarea>
                    </div>

                    <div class="form-group">
                        <label for="content-type">Content Type *</label>
                        <select id="content-type" name="type" required>
                            <option value="">Select content type</option>
                            <option value="guide">Guide (GitHub Markdown)</option>
                            <option value="visualization">Visualization (Local HTML)</option>
                        </select>
                    </div>

                    <div id="github-content-fields" class="github-content-fields" style="display: none;">
                        <div class="form-group">
                            <label for="content-repo">GitHub Repository *</label>
                            <input type="text" id="content-repo" name="repo" 
                                   placeholder="e.g., prepguides/go-interviews">
                            <small class="form-help">Format: owner/repository-name</small>
                        </div>
                        <div class="form-group">
                            <label for="content-path">Markdown File Path *</label>
                            <input type="text" id="content-path" name="path" 
                                   placeholder="e.g., operator/README.md">
                            <small class="form-help">Path to the markdown file in the repository</small>
                        </div>
                    </div>

                    <div id="local-content-fields" class="local-content-fields" style="display: none;">
                        <div class="form-group">
                            <label for="content-path">HTML File Path *</label>
                            <input type="text" id="content-path" name="path" 
                                   placeholder="e.g., algorithms/sorting.html">
                            <small class="form-help">Path to the HTML file (will be created)</small>
                        </div>
                        <div class="form-group">
                            <label for="content-jsfile">JavaScript File (optional)</label>
                            <input type="text" id="content-jsfile" name="jsFile" 
                                   placeholder="e.g., algorithms/code/sorting-visualizer.js">
                            <small class="form-help">Path to the JavaScript visualization file</small>
                        </div>
                        <div class="form-group">
                            <label for="content-features">Features (optional)</label>
                            <textarea id="content-features" name="features" 
                                      placeholder="Enter each feature on a new line..."></textarea>
                            <small class="form-help">List key features, one per line</small>
                        </div>
                    </div>

                    <div class="form-actions">
                        <button type="button" id="preview-btn" class="preview-btn">Preview</button>
                        <button type="submit" id="submit-btn" class="submit-btn">
                            <span class="btn-text">Submit Content</span>
                            <span class="btn-loading" style="display: none;">Creating PR...</span>
                        </button>
                    </div>
                </form>

                <div id="preview-section" class="preview-section" style="display: none;">
                    <h3>👀 Content Preview</h3>
                    <div id="preview-content" class="preview-content"></div>
                    <div class="preview-actions">
                        <button id="back-to-form-btn" class="back-btn">Back to Form</button>
                        <button id="confirm-submit-btn" class="confirm-submit-btn">
                            <span class="btn-text">Confirm & Submit</span>
                            <span class="btn-loading" style="display: none;">Creating PR...</span>
                        </button>
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
        // External GitHub login
        document.addEventListener('click', (e) => {
            if (e.target.id === 'github-login-btn-external') {
                window.githubAuth.login();
            }
        });

        // External user info dropdown
        document.addEventListener('click', (e) => {
            if (e.target.closest('#user-info-trigger-external')) {
                const dropdown = document.getElementById('user-dropdown-external');
                const trigger = document.getElementById('user-info-trigger-external');
                console.log('External dropdown clicked, elements found:', { dropdown, trigger });
                if (dropdown && trigger) {
                    const isOpen = dropdown.classList.contains('show');
                    console.log('External dropdown is currently open:', isOpen);
                    dropdown.classList.toggle('show');
                    trigger.setAttribute('aria-expanded', !isOpen);
                    console.log('External dropdown toggled, new state:', !isOpen);
                    
                    // Debug dropdown content visibility
                    const dropdownName = document.getElementById('user-dropdown-name-external');
                    const dropdownUsername = document.getElementById('user-dropdown-username-external');
                    const dropdownEmail = document.getElementById('user-dropdown-email-external');
                    console.log('External dropdown content elements:', {
                        name: dropdownName?.textContent,
                        username: dropdownUsername?.textContent,
                        email: dropdownEmail?.textContent
                    });
                }
            } else if (e.target.id === 'logout-btn-external') {
                console.log('External logout button clicked');
                window.githubAuth.logout();
                // Note: logout() now handles page reload, so updateAuthStatus() is not needed
            } else {
                // Close external dropdown when clicking outside
                const dropdown = document.getElementById('user-dropdown-external');
                const trigger = document.getElementById('user-info-trigger-external');
                if (dropdown && dropdown.classList.contains('show')) {
                    dropdown.classList.remove('show');
                    if (trigger) trigger.setAttribute('aria-expanded', 'false');
                }
            }
        });

        // Keyboard navigation for external dropdown
        document.addEventListener('keydown', (e) => {
            const trigger = document.getElementById('user-info-trigger-external');
            const dropdown = document.getElementById('user-dropdown-external');
            
            if (e.target === trigger) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const isOpen = dropdown.classList.contains('show');
                    dropdown.classList.toggle('show');
                    trigger.setAttribute('aria-expanded', !isOpen);
                } else if (e.key === 'Escape') {
                    dropdown.classList.remove('show');
                    trigger.setAttribute('aria-expanded', 'false');
                    trigger.focus();
                }
            } else if (e.key === 'Escape' && dropdown.classList.contains('show')) {
                dropdown.classList.remove('show');
                trigger.setAttribute('aria-expanded', 'false');
                trigger.focus();
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

        // Show content form button
        document.addEventListener('click', (e) => {
            if (e.target.id === 'show-content-form-btn') {
                this.showContentForm();
            }
        });

        // Close form button
        document.addEventListener('click', (e) => {
            if (e.target.id === 'close-form-btn') {
                this.hideContentForm();
            }
        });

        // Content type change
        document.addEventListener('change', (e) => {
            if (e.target.id === 'content-type') {
                this.handleContentTypeChange(e.target.value);
            }
        });

        // GitHub repo validation
        document.addEventListener('blur', (e) => {
            if (e.target.id === 'content-repo') {
                this.validateGitHubRepo(e.target.value);
            }
        });

        // Markdown path validation
        document.addEventListener('blur', (e) => {
            if (e.target.id === 'content-path' && document.getElementById('content-type').value === 'guide') {
                this.validateMarkdownPath(e.target.value);
            }
        });
    }

    /**
     * Show content form
     */
    showContentForm() {
        const formContainer = document.getElementById('content-form-container');
        if (formContainer) {
            formContainer.style.display = 'block';
            formContainer.scrollIntoView({ behavior: 'smooth' });
        }
    }

    /**
     * Hide content form
     */
    hideContentForm() {
        const formContainer = document.getElementById('content-form-container');
        if (formContainer) {
            formContainer.style.display = 'none';
        }
    }

    /**
     * Handle content type change
     */
    handleContentTypeChange(type) {
        const githubFields = document.getElementById('github-content-fields');
        const localFields = document.getElementById('local-content-fields');
        
        if (type === 'guide') {
            githubFields.style.display = 'block';
            localFields.style.display = 'none';
        } else if (type === 'visualization') {
            githubFields.style.display = 'none';
            localFields.style.display = 'block';
        } else {
            githubFields.style.display = 'none';
            localFields.style.display = 'none';
        }
    }

    /**
     * Validate GitHub repository format
     */
    async validateGitHubRepo(repo) {
        const repoInput = document.getElementById('content-repo');
        const repoPattern = /^[a-zA-Z0-9._-]+\/[a-zA-Z0-9._-]+$/;
        
        if (!repo) return;
        
        // Check if it's just an organization name (common repositories)
        const commonRepos = {
            'kubernetes': 'kubernetes/kubernetes',
            'react': 'facebook/react',
            'vue': 'vuejs/vue',
            'angular': 'angular/angular',
            'node': 'nodejs/node',
            'express': 'expressjs/express',
            'django': 'django/django',
            'flask': 'pallets/flask',
            'spring': 'spring-projects/spring-framework',
            'tensorflow': 'tensorflow/tensorflow',
            'pytorch': 'pytorch/pytorch',
            'docker': 'docker/docker',
            'kubernetes-sigs': 'kubernetes-sigs/kind'
        };
        
        let fullRepo = repo;
        if (!repoPattern.test(repo)) {
            // Check if it's a common repository
            if (commonRepos[repo.toLowerCase()]) {
                fullRepo = commonRepos[repo.toLowerCase()];
                repoInput.value = fullRepo;
                this.showFieldSuccess(repoInput, `Auto-completed to: ${fullRepo}`);
            } else {
                this.showFieldError(repoInput, 'Invalid repository format. Use: owner/repository-name (e.g., kubernetes/kubernetes)');
                return;
            }
        }

        // Check if repository exists
        try {
            const response = await fetch(`https://api.github.com/repos/${fullRepo}`);
            if (response.ok) {
                this.showFieldSuccess(repoInput, 'Repository found');
            } else {
                this.showFieldError(repoInput, 'Repository not found or not accessible');
            }
        } catch (error) {
            this.showFieldError(repoInput, 'Error checking repository');
        }
    }

    /**
     * Validate markdown file path
     */
    async validateMarkdownPath(path) {
        const pathInput = document.getElementById('content-path');
        const repo = document.getElementById('content-repo').value;
        
        if (!path || !repo) return;
        
        if (!path.endsWith('.md')) {
            this.showFieldError(pathInput, 'Path must end with .md for markdown files');
            return;
        }

        // Check if file exists in repository
        try {
            const response = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`);
            if (response.ok) {
                this.showFieldSuccess(pathInput, 'Markdown file found');
            } else {
                this.showFieldError(pathInput, 'Markdown file not found in repository');
            }
        } catch (error) {
            this.showFieldError(pathInput, 'Error checking file');
        }
    }

    /**
     * Show field error
     */
    showFieldError(field, message) {
        this.clearFieldStatus(field);
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        field.parentNode.appendChild(errorDiv);
        field.classList.add('error');
    }

    /**
     * Show field success
     */
    showFieldSuccess(field, message) {
        this.clearFieldStatus(field);
        const successDiv = document.createElement('div');
        successDiv.className = 'field-success';
        successDiv.textContent = message;
        field.parentNode.appendChild(successDiv);
        field.classList.add('success');
    }

    /**
     * Clear field status
     */
    clearFieldStatus(field) {
        field.classList.remove('error', 'success');
        const existingError = field.parentNode.querySelector('.field-error');
        const existingSuccess = field.parentNode.querySelector('.field-success');
        if (existingError) existingError.remove();
        if (existingSuccess) existingSuccess.remove();
    }

    /**
     * Update authentication status
     */
    updateAuthStatus() {
        console.log('updateAuthStatus called');
        const authStatus = document.getElementById('auth-status-external');
        const loginSection = document.getElementById('login-section-external');
        const userSection = document.getElementById('user-section-external');
        const showFormBtn = document.getElementById('show-content-form-btn');

        console.log('External elements found:', { authStatus, loginSection, userSection, showFormBtn });
        console.log('window.githubAuth:', window.githubAuth);
        console.log('isConfigured:', window.githubAuth?.isConfigured);

        if (!authStatus) return;

        // Check if GitHub OAuth is configured
        if (!window.githubAuth.isConfigured) {
            authStatus.innerHTML = '<div class="auth-error">⚠️ GitHub OAuth not configured</div>';
            if (loginSection) loginSection.style.display = 'none';
            if (userSection) userSection.style.display = 'none';
            if (showFormBtn) showFormBtn.style.display = 'none';
            return;
        }

        // Always show login button first, then check authentication
        console.log('Setting external login section display to flex');
        if (loginSection) {
            loginSection.style.display = 'flex';
            console.log('External login section display set to:', loginSection.style.display);
        }
        
        // Ensure login button is always enabled and clickable
        const loginBtn = document.getElementById('github-login-btn-external');
        console.log('External login button found:', loginBtn);
        if (loginBtn) {
            console.log('Configuring external login button...');
            loginBtn.disabled = false;
            loginBtn.style.opacity = '1';
            loginBtn.style.cursor = 'pointer';
            loginBtn.style.pointerEvents = 'auto';
            loginBtn.removeAttribute('disabled');
            
            console.log('External login button configured:', {
                disabled: loginBtn.disabled,
                opacity: loginBtn.style.opacity,
                cursor: loginBtn.style.cursor,
                pointerEvents: loginBtn.style.pointerEvents
            });
            
            // Add click event listener directly
            loginBtn.onclick = function(e) {
                console.log('External login button clicked!');
                e.preventDefault();
                e.stopPropagation();
                if (window.githubAuth && window.githubAuth.login) {
                    window.githubAuth.login();
                }
            };
            
            // Also add event listener using addEventListener as backup
            loginBtn.addEventListener('click', function(e) {
                console.log('External login button clicked via addEventListener!');
                e.preventDefault();
                e.stopPropagation();
                if (window.githubAuth && window.githubAuth.login) {
                    window.githubAuth.login();
                }
            });
            
        } else {
            console.log('External login button NOT found!');
        }

        if (window.githubAuth.isAuthenticated()) {
            authStatus.innerHTML = '<div class="auth-success">✅ Ready</div>';
            if (loginSection) loginSection.style.display = 'none';
            if (userSection) userSection.style.display = 'flex';
            if (showFormBtn) showFormBtn.style.display = 'inline-block';
            
            // Update external user info
            const user = window.githubAuth.user;
            const userAvatar = document.getElementById('user-avatar-external');
            const userName = document.getElementById('user-name-external');
            const userDropdownName = document.getElementById('user-dropdown-name-external');
            const userDropdownUsername = document.getElementById('user-dropdown-username-external');
            const userDropdownEmail = document.getElementById('user-dropdown-email-external');
            const githubProfileLink = document.getElementById('github-profile-link-external');
            
            console.log('Updating external user info:', user);
            console.log('External dropdown elements found:', {
                userAvatar, userName, userDropdownName, 
                userDropdownUsername, userDropdownEmail, githubProfileLink
            });
            
            if (userAvatar) {
                userAvatar.src = user.avatar_url;
                console.log('Set external avatar src:', user.avatar_url);
            }
            if (userName) {
                userName.textContent = user.name || user.login;
                console.log('Set external user name:', user.name || user.login);
            }
            if (userDropdownName) {
                userDropdownName.textContent = user.name || user.login;
                console.log('Set external dropdown name:', user.name || user.login);
            }
            if (userDropdownUsername) {
                userDropdownUsername.textContent = `@${user.login}`;
                console.log('Set external dropdown username:', `@${user.login}`);
            }
            if (userDropdownEmail) {
                userDropdownEmail.textContent = user.email || `${user.login}@github.com`;
                console.log('Set external dropdown email:', user.email || `${user.login}@github.com`);
            }
            if (githubProfileLink) {
                githubProfileLink.href = user.html_url;
                console.log('Set external GitHub profile link:', user.html_url);
            }
        } else {
            authStatus.innerHTML = '<div class="auth-error">❌ Not authenticated</div>';
            if (userSection) userSection.style.display = 'none';
            if (showFormBtn) showFormBtn.style.display = 'none';
        }
    }

    /**
     * Handle form submission
     */
    async handleFormSubmit() {
        if (this.isSubmitting) return;

        const formData = new FormData(document.getElementById('content-form'));
        const contentType = formData.get('type');
        
        const contentData = {
            id: this.generateContentId(formData.get('title'), formData.get('category')),
            title: formData.get('title'),
            category: formData.get('category'),
            subtopic: formData.get('subtopic'),
            description: formData.get('description'),
            content: formData.get('description'), // Use description as content for consistency
            type: contentType,
            path: formData.get('path'),
            repo: formData.get('repo'), // Add repo field
            addedDate: new Date().toISOString().split('T')[0],
            status: 'pending'
        };

        // Add type-specific fields
        if (contentType === 'guide') {
            // Auto-complete common repositories
            const commonRepos = {
                'kubernetes': 'kubernetes/kubernetes',
                'react': 'facebook/react',
                'vue': 'vuejs/vue',
                'angular': 'angular/angular',
                'node': 'nodejs/node',
                'express': 'expressjs/express',
                'django': 'django/django',
                'flask': 'pallets/flask',
                'spring': 'spring-projects/spring-framework',
                'tensorflow': 'tensorflow/tensorflow',
                'pytorch': 'pytorch/pytorch',
                'docker': 'docker/docker',
                'kubernetes-sigs': 'kubernetes-sigs/kind'
            };
            
            let repo = formData.get('repo');
            if (commonRepos[repo.toLowerCase()]) {
                repo = commonRepos[repo.toLowerCase()];
            }
            contentData.repo = repo;
        } else if (contentType === 'visualization') {
            const jsFile = formData.get('jsFile');
            if (jsFile) contentData.jsFile = jsFile;
            
            const features = formData.get('features');
            if (features) {
                contentData.features = features.split('\n').filter(f => f.trim());
            }
        }

        // Validate form
        if (!this.validateForm(contentData)) {
            return;
        }

        this.showPreview(contentData);
    }

    /**
     * Generate content ID
     */
    generateContentId(title, category) {
        // Validate inputs
        if (!title || !category) {
            console.error('generateContentId: Missing title or category', { title, category });
            return 'unknown-content';
        }
        
        const id = title.toLowerCase()
            .replace(/[^a-z0-9\s]/g, '')
            .replace(/\s+/g, '-')
            .substring(0, 50);
        return `${category}-${id}`;
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

        if (!data.subtopic.trim()) {
            errors.push('Subtopic is required');
        }

        if (!data.description.trim()) {
            errors.push('Description is required');
        }

        if (!data.type) {
            errors.push('Content type is required');
        }

        if (!data.path.trim()) {
            errors.push('Path is required');
        }

        // Type-specific validation
        if (data.type === 'guide') {
            if (!data.repo.trim()) {
                errors.push('GitHub repository is required for guides');
            } else {
                // Check if it's a common repository that can be auto-completed
                const commonRepos = {
                    'kubernetes': 'kubernetes/kubernetes',
                    'react': 'facebook/react',
                    'vue': 'vuejs/vue',
                    'angular': 'angular/angular',
                    'node': 'nodejs/node',
                    'express': 'expressjs/express',
                    'django': 'django/django',
                    'flask': 'pallets/flask',
                    'spring': 'spring-projects/spring-framework',
                    'tensorflow': 'tensorflow/tensorflow',
                    'pytorch': 'pytorch/pytorch',
                    'docker': 'docker/docker',
                    'kubernetes-sigs': 'kubernetes-sigs/kind'
                };
                
                const repoPattern = /^[a-zA-Z0-9._-]+\/[a-zA-Z0-9._-]+$/;
                if (!repoPattern.test(data.repo) && !commonRepos[data.repo.toLowerCase()]) {
                    errors.push('Invalid repository format. Use: owner/repository-name (e.g., kubernetes/kubernetes)');
                }
            }
            
            if (!data.path.endsWith('.md')) {
                errors.push('Path must end with .md for markdown guides');
            }
        } else if (data.type === 'visualization') {
            if (!data.path.endsWith('.html')) {
                errors.push('Path must end with .html for visualizations');
            }
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
        const formSection = document.getElementById('content-form');

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
                <div class="content-preview">${this.formatPreviewContent(contentData.description || '')}</div>
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
        console.log('formatPreviewContent called with:', content, 'type:', typeof content);
        if (!content) {
            console.log('Content is falsy, returning empty string');
            return '';
        }
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
        const formSection = document.getElementById('content-form');
        
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
    console.log('DOMContentLoaded - initializing content form');
    window.contentForm = new ContentForm();
    
    // Listen for GitHub auth configuration ready
    window.addEventListener('githubAuthReady', () => {
        console.log('githubAuthReady event received');
        if (window.contentForm) {
            window.contentForm.updateAuthStatus();
        }
    });
    
    // Fallback: Update auth status after a delay if event doesn't fire
    setTimeout(() => {
        console.log('Fallback timeout - updating auth status');
        if (window.contentForm) {
            window.contentForm.updateAuthStatus();
        }
    }, 1000);
});
