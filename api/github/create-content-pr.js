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
        
        // Provide helpful error message for GitHub App failure
        let errorMessage = 'Content submission failed';
        let userInstructions = [];
        
        if (githubAppResult.error.includes('GitHub App not configured')) {
            errorMessage = 'Content submission is temporarily unavailable. GitHub App is not configured.';
            userInstructions = [
                '1. Please try again later',
                '2. Contact support if the issue persists'
            ];
        } else if (githubAppResult.error.includes('No installation found')) {
            errorMessage = 'Content submission is temporarily unavailable. GitHub App is not properly installed.';
            userInstructions = [
                '1. Please try again later',
                '2. Contact support if the issue persists'
            ];
        } else if (githubAppResult.error.includes('JSON web token')) {
            errorMessage = 'Content submission is temporarily unavailable. GitHub App authentication failed.';
            userInstructions = [
                '1. Please try again later',
                '2. Contact support if the issue persists'
            ];
        } else {
            errorMessage = 'Content submission failed. Please try again or contact support.';
            userInstructions = [
                '1. Check your internet connection',
                '2. Try refreshing the page',
                '3. If the problem persists, contact support'
            ];
        }
        
        return res.status(500).json({
            error: 'Content submission failed',
            message: errorMessage,
            instructions: userInstructions,
            details: {
                githubAppError: githubAppResult.error,
                githubAppConfigured: !!(process.env.GITHUB_APP_ID && process.env.GITHUB_APP_PRIVATE_KEY)
            }
        });

    } catch (error) {
        console.error('❌ Unexpected error in bot API:', error);
        return res.status(500).json({
            error: 'Internal server error',
            message: 'An unexpected error occurred',
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

        // Validate private key format
        if (!process.env.GITHUB_APP_PRIVATE_KEY.includes('BEGIN RSA PRIVATE KEY')) {
            return { success: false, error: 'Invalid private key format - must be a valid RSA private key' };
        }

        // Initialize GitHub App
        const appAuth = createAppAuth({
            appId: process.env.GITHUB_APP_ID,
            privateKey: process.env.GITHUB_APP_PRIVATE_KEY.replace(/\\n/g, '\n'),
        });

        console.log('🔑 Getting app token...');
        // Get app token
        const appToken = await appAuth({ type: 'app' });
        console.log('✅ App token obtained successfully');
        
        const tempOctokit = new Octokit({ auth: appToken.token });

        // Find installation
        console.log('🔍 Finding installations...');
        const installations = await tempOctokit.apps.listInstallations();
        console.log('Found installations:', installations.data.length);
        console.log('Available installations:', installations.data.map(i => i.account.login));
        
        const targetInstallation = installations.data.find(installation => 
            installation.account.login === 'prepguides'
        );

        if (!targetInstallation) {
            return { success: false, error: 'No installation found for prepguides organization' };
        }
        
        console.log('✅ Found prepguides installation:', targetInstallation.id);

        // Create authenticated Octokit
        const auth = createAppAuth({
            appId: process.env.GITHUB_APP_ID,
            privateKey: process.env.GITHUB_APP_PRIVATE_KEY.replace(/\\n/g, '\n'),
            installationId: targetInstallation.id,
        });

        const octokit = new Octokit({ auth });

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
            console.log('⚠️ User fork not found, providing fork creation guidance');
            return { 
                success: false, 
                error: 'Fork not found. Please fork the repository first.',
                message: 'To submit content, you need to fork the repository first.',
                forkUrl: 'https://github.com/prepguides/prepguides.dev/fork',
                instructions: [
                    '1. Click the "Fork" button on the repository page',
                    '2. Wait for the fork to be created',
                    '3. Try submitting your content again'
                ]
            };
        }

        console.log('✅ User fork found, creating PR via fork');
        // Create PR using user token
        const result = await createPRWithUserToken(userToken, contentData, user);
        return { success: true, data: result };

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
        status: 'pending',
        reviewNotes: '',
        approvedBy: null,
        approvedAt: null
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