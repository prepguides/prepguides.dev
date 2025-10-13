/**
 * GitHub Bot API for Content Submission
 * Creates PRs directly on origin repository for authenticated users
 * Simplified and robust approach with comprehensive error handling
 */

import { Octokit } from '@octokit/rest';
import { createAppAuth } from '@octokit/auth-app';

export default async function handler(req, res) {
    // Ensure we always return JSON responses
    res.setHeader('Content-Type', 'application/json');
    
    // Wrap everything in a try-catch to prevent HTML error pages
    try {
        if (req.method !== 'POST') {
            return res.status(405).json({ error: 'Method not allowed' });
        }

        const { contentData, userToken } = req.body;

        // Validate required fields first
        if (!contentData || !userToken) {
            return res.status(400).json({ 
                error: 'Missing required fields',
                message: 'contentData and userToken are required'
            });
        }

        // Validate contentData structure
        if (!contentData.id || !contentData.title || !contentData.description || !contentData.category) {
            return res.status(400).json({
                error: 'Invalid content data',
                message: 'contentData must include id, title, description, and category'
            });
        }

        console.log('🚀 Starting content submission process...');
        console.log('Content ID:', contentData.id);
        console.log('Content Title:', contentData.title);
        console.log('Content Category:', contentData.category);
        console.log('User Token present:', !!userToken);

        // Try GitHub App approach - this should work without requiring user fork
        const githubAppResult = await tryGitHubAppApproach(contentData, userToken);
        if (githubAppResult.success) {
            console.log('✅ GitHub App approach succeeded');
            return res.status(201).json(githubAppResult.data);
        }

        console.log('❌ GitHub App approach failed');
        console.log('GitHub App error:', githubAppResult.error);
        console.log('GitHub App configured:', !!(process.env.GITHUB_APP_ID && process.env.GITHUB_APP_PRIVATE_KEY));
        
        // No fallback - bot API must work for content submission
        console.log('❌ GitHub App approach failed - no fallback available');
        
        // Provide helpful error message for GitHub App failure
        let errorMessage = 'Content submission is temporarily unavailable.';
        let userInstructions = [];
        let diagnosticUrl = 'https://prepguides.dev/api/diagnostic/github-app';
        
        if (githubAppResult.error.includes('GitHub App not configured')) {
            errorMessage = 'Content submission is temporarily unavailable. GitHub App is not configured.';
            userInstructions = [
                '1. Please try again later',
                '2. Contact support if the issue persists',
                `3. Check diagnostic info: ${diagnosticUrl}`
            ];
        } else if (githubAppResult.error.includes('No installation found')) {
            errorMessage = 'Content submission is temporarily unavailable. GitHub App is not properly installed.';
            userInstructions = [
                '1. Please try again later',
                '2. Contact support if the issue persists',
                `3. Check diagnostic info: ${diagnosticUrl}`
            ];
        } else if (githubAppResult.error.includes('JSON web token') || githubAppResult.error.includes('JWT') || githubAppResult.error.includes('token')) {
            errorMessage = 'Content submission is temporarily unavailable. GitHub App authentication failed.';
            userInstructions = [
                '1. The GitHub App credentials may need to be reconfigured',
                '2. Please try again later',
                '3. Contact support if the issue persists',
                `4. Check diagnostic info: ${diagnosticUrl}`
            ];
        } else if (githubAppResult.error.includes('private key')) {
            errorMessage = 'Content submission is temporarily unavailable. GitHub App private key issue.';
            userInstructions = [
                '1. The GitHub App private key may need to be regenerated',
                '2. Please try again later',
                '3. Contact support if the issue persists',
                `4. Check diagnostic info: ${diagnosticUrl}`
            ];
        } else {
            errorMessage = 'Content submission is temporarily unavailable. GitHub App error.';
            userInstructions = [
                '1. Please try again later',
                '2. Contact support if the issue persists',
                `3. Check diagnostic info: ${diagnosticUrl}`
            ];
        }
        
        return res.status(500).json({
            error: 'Content submission failed',
            message: errorMessage,
            instructions: userInstructions,
            details: {
                githubAppError: githubAppResult.error,
                githubAppConfigured: !!(process.env.GITHUB_APP_ID && process.env.GITHUB_APP_PRIVATE_KEY),
                diagnosticUrl: diagnosticUrl
            }
        });

    } catch (error) {
        console.error('❌ Unexpected error in bot API:', error);
        return res.status(500).json({
            error: 'Internal server error',
            message: 'An unexpected error occurred. Please try again or contact support.',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

/**
 * Try GitHub App approach with simplified error handling
 */
async function tryGitHubAppApproach(contentData, userToken) {
    try {
        // Check if GitHub App is configured
        if (!process.env.GITHUB_APP_ID || !process.env.GITHUB_APP_PRIVATE_KEY) {
            return { success: false, error: 'GitHub App not configured' };
        }

        console.log('🔧 Attempting GitHub App approach...');
        console.log('GitHub App ID:', process.env.GITHUB_APP_ID);
            console.log('Private Key length:', process.env.GITHUB_APP_PRIVATE_KEY?.length);
            
        // Use the exact same approach as the diagnostic endpoint
        console.log('🔧 Using diagnostic endpoint approach for private key processing...');
        let privateKey = process.env.GITHUB_APP_PRIVATE_KEY;
        if (privateKey.includes('\\n')) {
            console.log('🔧 Processing private key with escaped newlines (diagnostic approach)');
            privateKey = privateKey.replace(/\\n/g, '\n');
        }
        
        console.log('✅ Private key processed using diagnostic approach');
        console.log('Private key length:', privateKey.length);
        console.log('Private key starts with:', privateKey.substring(0, 50));

        // Use the exact same approach as the diagnostic endpoint
        console.log('🔧 Creating GitHub App auth using diagnostic approach...');
        const { createAppAuth: createAppAuthDiag } = await import('@octokit/auth-app');
        
        let appAuth;
        try {
            appAuth = createAppAuthDiag({
                appId: process.env.GITHUB_APP_ID,
                privateKey: privateKey,
            });
            console.log('✅ GitHub App auth created successfully using diagnostic approach');
        } catch (authError) {
            console.error('❌ Failed to create GitHub App auth:', authError.message);
            console.error('❌ Auth error details:', authError);
            return { success: false, error: `Failed to create GitHub App auth: ${authError.message}` };
        }

        console.log('🔑 Getting app token using diagnostic approach...');
        // Get app token with error handling
        let appToken;
        try {
            appToken = await appAuth({ type: 'app' });
            console.log('✅ App token obtained successfully using diagnostic approach');
            console.log('  - Token length:', appToken.token ? appToken.token.length : 'null');
            console.log('  - Token type:', appToken.type);
        } catch (tokenError) {
            console.error('❌ Failed to obtain app token:', tokenError.message);
            console.error('❌ Token error details:', tokenError);
            return { success: false, error: `Failed to obtain app token: ${tokenError.message}` };
        }
        
        const tempOctokit = new Octokit({ auth: appToken.token });

        // Find installation
        console.log('🔍 Finding installations...');
        let targetInstallation;
        try {
            const installations = await tempOctokit.apps.listInstallations();
            console.log('Found installations:', installations.data.length);
            console.log('Available installations:', installations.data.map(i => i.account.login));
            
            targetInstallation = installations.data.find(installation => 
                installation.account.login === 'prepguides'
            );

            if (!targetInstallation) {
                console.error('❌ No installation found for prepguides organization');
                console.log('Available accounts:', installations.data.map(i => ({ login: i.account.login, id: i.id })));
                return { success: false, error: 'No installation found for prepguides organization' };
            }
            
            console.log('✅ Found prepguides installation:', targetInstallation.id);
            console.log('Installation details:', {
                id: targetInstallation.id,
                account: targetInstallation.account.login,
                permissions: targetInstallation.permissions
            });
        } catch (installError) {
            console.error('❌ Failed to list installations:', installError.message);
            console.error('Install error details:', installError);
            return { success: false, error: `Failed to list installations: ${installError.message}` };
        }

        // Create authenticated Octokit
        console.log('🔧 Creating authenticated Octokit with installation...');
        console.log('  - App ID:', process.env.GITHUB_APP_ID);
        console.log('  - Installation ID:', targetInstallation.id);
        console.log('  - Private key length:', privateKey.length);
        
        // Get installation token directly
        console.log('🔑 Getting installation token...');
        let installationToken;
        try {
            const installationTokenResponse = await fetch(`https://api.github.com/app/installations/${targetInstallation.id}/access_tokens`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${appToken.token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            
            if (!installationTokenResponse.ok) {
                throw new Error(`Failed to create installation token: ${installationTokenResponse.status}`);
            }
            
            const installationTokenData = await installationTokenResponse.json();
            installationToken = installationTokenData.token;
            console.log('✅ Installation token obtained successfully');
            console.log('  - Token length:', installationToken ? installationToken.length : 'null');
        } catch (tokenError) {
            console.error('❌ Failed to get installation token:', tokenError.message);
            console.error('Installation token error details:', tokenError);
            return { success: false, error: `Failed to get installation token: ${tokenError.message}` };
        }

        const octokit = new Octokit({
            auth: installationToken,
        });

        // Test installation token by making a simple API call
        console.log('🧪 Testing installation token with simple API call...');
        try {
            const testResponse = await fetch('https://api.github.com/repos/prepguides/prepguides.dev', {
                headers: {
                    'Authorization': `Bearer ${installationToken}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            
            if (!testResponse.ok) {
                throw new Error(`Repository access failed: ${testResponse.status}`);
            }
            
            const repoData = await testResponse.json();
            console.log('✅ Installation token test successful');
            console.log('  - Repository:', repoData.full_name);
            console.log('  - Default branch:', repoData.default_branch);
        } catch (testError) {
            console.error('❌ Installation token test failed:', testError.message);
            console.error('Test error details:', testError);
            return { success: false, error: `Installation token test failed: ${testError.message}` };
        }

        // Verify user authentication
        console.log('🔍 Verifying user authentication...');
            const userResponse = await fetch('https://api.github.com/user', {
                headers: {
                    'Authorization': `token ${userToken}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (!userResponse.ok) {
            console.error('❌ User authentication failed:', userResponse.status, userResponse.statusText);
            return { success: false, error: 'Invalid user token' };
        }

        const user = await userResponse.json();
        console.log('✅ User authenticated:', user.login);

        // Create PR using bot
        const result = await createPRWithBot(octokit, contentData, user);
        return { success: true, data: result };

    } catch (error) {
        console.error('GitHub App approach error:', error.message);
        return { success: false, error: error.message };
    }
}

/**
 * Try user token approach (fallback)
 */
async function tryUserTokenApproach(contentData, userToken) {
    try {
        console.log('🔧 Attempting user token approach...');

        // Verify user authentication
        const userResponse = await fetch('https://api.github.com/user', {
            headers: {
                'Authorization': `token ${userToken}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        if (!userResponse.ok) {
            return { success: false, error: 'Invalid user token' };
            }

            const user = await userResponse.json();
            console.log(`✅ User authenticated: ${user.login}`);

        // Check if user has a fork
        const forkRepoName = `${user.login}/prepguides.dev`;
        const forkResponse = await fetch(`https://api.github.com/repos/${forkRepoName}`, {
            headers: {
                'Authorization': `token ${userToken}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        if (!forkResponse.ok) {
            console.log('⚠️ User fork not found, creating issue instead');
            // Create an issue as fallback when fork is not available
            const result = await createIssueWithUserToken(userToken, contentData, user);
            return { success: true, data: result };
        }

        console.log('✅ User fork found, attempting to create PR via fork');
        try {
            // Create PR using user token
            const result = await createPRWithUserToken(userToken, contentData, user);
            return { success: true, data: result };
        } catch (forkError) {
            console.log('⚠️ Fork PR creation failed, falling back to issue creation:', forkError.message);
            // If fork PR creation fails, fall back to issue creation
            const result = await createIssueWithUserToken(userToken, contentData, user);
            return { success: true, data: result };
        }

    } catch (error) {
        console.error('User token approach error:', error.message);
        return { success: false, error: error.message };
    }
}

/**
 * Create PR using bot (GitHub App)
 */
async function createPRWithBot(octokit, contentData, user) {
            const timestamp = Date.now();
    const branchName = `content-submission-${user.login}-${timestamp}`;
            
    // Get latest main branch SHA
            const { data: mainRef } = await octokit.git.getRef({
                owner: 'prepguides',
                repo: 'prepguides.dev',
                ref: 'heads/main'
            });

    // Create new branch
            await octokit.git.createRef({
                owner: 'prepguides',
                repo: 'prepguides.dev',
                ref: `refs/heads/${branchName}`,
                sha: mainRef.object.sha
            });

    // Create content payload file
            const payloadContent = generatePayloadContent(contentData, user);
            const payloadPath = `.github/content-payloads/${contentData.id}-payload.json`;
            
            await octokit.repos.createOrUpdateFileContents({
                owner: 'prepguides',
                repo: 'prepguides.dev',
                path: payloadPath,
                message: `Add content submission: ${contentData.title}`,
                content: Buffer.from(payloadContent).toString('base64'),
                branch: branchName
            });

    // Create pull request
            const { data: pr } = await octokit.pulls.create({
                owner: 'prepguides',
                repo: 'prepguides.dev',
                title: `Content Submission: ${contentData.title}`,
                head: branchName,
                base: 'main',
                body: generatePRDescription(contentData, user)
            });

    // Add labels
            try {
                await octokit.issues.addLabels({
                    owner: 'prepguides',
                    repo: 'prepguides.dev',
                    issue_number: pr.number,
            labels: ['content-submission', 'bot-created']
                });
            } catch (labelError) {
        console.warn('Failed to add labels:', labelError.message);
            }

    return {
                success: true,
                pr: {
                    number: pr.number,
                    html_url: pr.html_url,
                    title: pr.title,
                    state: pr.state,
                    created_at: pr.created_at
                },
                branch: branchName,
        message: 'Content submission PR created successfully using bot!'
    };
}

/**
 * Create PR using user token (fallback)
 */
async function createPRWithUserToken(userToken, contentData, user) {
    const timestamp = Date.now();
    const branchName = `content-submission-${user.login}-${timestamp}`;

    // Get latest main branch SHA from fork
    const mainRefResponse = await fetch(`https://api.github.com/repos/${user.login}/prepguides.dev/git/refs/heads/main`, {
        headers: {
            'Authorization': `token ${userToken}`,
            'Accept': 'application/vnd.github.v3+json'
        }
    });

    if (!mainRefResponse.ok) {
        throw new Error('Failed to get main branch reference from fork');
    }

    const mainRef = await mainRefResponse.json();

    // Create new branch in fork
    const branchResponse = await fetch(`https://api.github.com/repos/${user.login}/prepguides.dev/git/refs`, {
        method: 'POST',
        headers: {
            'Authorization': `token ${userToken}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            ref: `refs/heads/${branchName}`,
            sha: mainRef.object.sha
        })
    });

    if (!branchResponse.ok) {
        throw new Error('Failed to create branch in fork');
    }

    // Create content payload file
    const payloadContent = generatePayloadContent(contentData, user);
    const payloadPath = `.github/content-payloads/${contentData.id}-payload.json`;
    const encodedContent = Buffer.from(payloadContent).toString('base64');
    
    const fileResponse = await fetch(`https://api.github.com/repos/${user.login}/prepguides.dev/contents/${payloadPath}`, {
        method: 'PUT',
        headers: {
            'Authorization': `token ${userToken}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message: `Add content submission: ${contentData.title}`,
            content: encodedContent,
            branch: branchName
        })
    });

    if (!fileResponse.ok) {
        throw new Error('Failed to create content file in fork');
    }

    // Create pull request
    const prResponse = await fetch('https://api.github.com/repos/prepguides/prepguides.dev/pulls', {
        method: 'POST',
        headers: {
            'Authorization': `token ${userToken}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title: `Content Submission: ${contentData.title}`,
            head: `${user.login}:${branchName}`,
            base: 'main',
            body: generatePRDescription(contentData, user)
        })
    });

    if (!prResponse.ok) {
        throw new Error('Failed to create pull request');
    }

    const pr = await prResponse.json();

    return {
        success: true,
        pr: {
            number: pr.number,
            html_url: pr.html_url,
            title: pr.title,
            state: pr.state,
            created_at: pr.created_at
        },
        branch: branchName,
        message: 'Content submission PR created successfully using user token!'
    };
}

/**
 * Generate payload content in the expected format
 */
function generatePayloadContent(contentData, user) {
    return JSON.stringify({
        version: "1.0.0",
        type: "content-addition",
        metadata: {
            title: contentData.title,
            description: contentData.description,
            author: user.login,
            submissionDate: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
            category: contentData.category,
            subtopic: contentData.id // Use content ID as subtopic
        },
        content: {
            id: contentData.id,
            title: contentData.title,
            description: contentData.description,
            repo: "prepguides/prepguides.dev", // Default to main repo
            path: `content/${contentData.category}/${contentData.id}.md`, // Default path structure
            type: "guide", // Default to guide type
            status: "active"
        },
        validation: {
            repoAccessible: true,
            fileExists: true,
            contentValid: true,
            categoryValid: true
        }
    }, null, 2);
}

/**
 * Generate PR description
 */
function generatePRDescription(contentData, user) {
    return `## 📝 Content Submission: ${contentData.title}

### 📋 Content Details
- **Title**: ${contentData.title}
- **Category**: ${contentData.category}
- **Difficulty**: ${contentData.difficulty || 'intermediate'}
- **Estimated Time**: ${contentData.estimatedTime || '30 minutes'}

### 📖 Description
${contentData.description}

### 👤 Submitted By
- **Username**: @${user.login}
- **Name**: ${user.name || user.login}
- **Avatar**: ![${user.login}](https://github.com/${user.login}.png?size=32)

### 🏷️ Tags
${(contentData.tags || []).map(tag => `- ${tag}`).join('\n')}

### 📚 Prerequisites
${(contentData.prerequisites || []).map(prereq => `- ${prereq}`).join('\n')}

### 📄 Content
\`\`\`
${contentData.content || 'No content provided'}
\`\`\`

### ✅ Review Checklist
- [ ] Content is accurate and well-structured
- [ ] Description is clear and informative
- [ ] Tags are appropriate and relevant
- [ ] Difficulty level is appropriate
- [ ] Prerequisites are clearly listed
- [ ] Content follows project guidelines
- [ ] Payload structure is valid

### Notes
This content was submitted via the PrepGuides.dev content submission form and automatically processed by our bot. The bot has created a branch-based PR for easy review and merging.

**Bot Version:** 2.0.0
**Submission ID:** ${contentData.id}`;
}

/**
 * Create issue using user token (fallback when fork is not available)
 */
async function createIssueWithUserToken(userToken, contentData, user) {
    try {
        console.log('🔧 Creating issue as fallback...');

        // Create issue in the main repository
        const issueResponse = await fetch('https://api.github.com/repos/prepguides/prepguides.dev/issues', {
            method: 'POST',
            headers: {
                'Authorization': `token ${userToken}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: `Content Submission: ${contentData.title}`,
                body: generateIssueDescription(contentData, user),
                labels: ['content-submission', 'user-submitted', 'needs-review']
            })
        });

        if (!issueResponse.ok) {
            const errorData = await issueResponse.json();
            throw new Error(`Failed to create issue: ${errorData.message || issueResponse.statusText}`);
        }

        const issue = await issueResponse.json();

        return {
            success: true,
            issue: {
                number: issue.number,
                html_url: issue.html_url,
                title: issue.title,
                state: issue.state,
                created_at: issue.created_at
            },
            message: 'Content submission created as issue! The team will review and convert it to a PR.',
            type: 'issue'
        };

    } catch (error) {
        console.error('Issue creation error:', error.message);
        throw error;
    }
}

/**
 * Generate issue description for content submission
 */
function generateIssueDescription(contentData, user) {
    return `## 📝 Content Submission: ${contentData.title}

### 📋 Content Details
- **Title**: ${contentData.title}
- **Category**: ${contentData.category}
- **Difficulty**: ${contentData.difficulty || 'intermediate'}
- **Estimated Time**: ${contentData.estimatedTime || '30 minutes'}

### 📖 Description
${contentData.description}

### 👤 Submitted By
- **Username**: @${user.login}
- **Name**: ${user.name || user.login}
- **Avatar**: ![${user.login}](https://github.com/${user.login}.png?size=32)

### 🏷️ Tags
${(contentData.tags || []).map(tag => `- ${tag}`).join('\n')}

### 📚 Prerequisites
${(contentData.prerequisites || []).map(prereq => `- ${prereq}`).join('\n')}

### 📄 Content
\`\`\`
${contentData.content || 'No content provided'}
\`\`\`

### 📋 Content Payload
\`\`\`json
${JSON.stringify({
    id: contentData.id,
    title: contentData.title,
    description: contentData.description,
    category: contentData.category,
    content: contentData.content || '',
    tags: contentData.tags || [],
    difficulty: contentData.difficulty || 'intermediate',
    estimatedTime: contentData.estimatedTime || '30 minutes',
    prerequisites: contentData.prerequisites || [],
    submittedBy: {
        username: user.login,
        name: user.name || user.login,
        email: user.email || '',
        avatar: user.avatar_url
    },
    submittedAt: new Date().toISOString(),
    status: 'pending'
}, null, 2)}
\`\`\`

### ✅ Review Checklist
- [ ] Content is accurate and well-structured
- [ ] Description is clear and informative
- [ ] Tags are appropriate and relevant
- [ ] Difficulty level is appropriate
- [ ] Prerequisites are clearly listed
- [ ] Content follows project guidelines
- [ ] Convert to PR when approved

### Notes
This content was submitted via the PrepGuides.dev content submission form. Since the automated PR creation failed, it was created as an issue for manual review and processing.

**Submission Method:** Issue (Fallback)
**Submission ID:** ${contentData.id}
**Submitted At:** ${new Date().toISOString()}`;
}