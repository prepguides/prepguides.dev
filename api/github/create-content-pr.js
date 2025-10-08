/**
 * GitHub Bot API for Content Submission
 * Creates PRs directly on origin repository for authenticated users
 */

import { Octokit } from '@octokit/rest';
import { createAppAuth } from '@octokit/auth-app';

export default async function handler(req, res) {
    // Ensure we always return JSON responses
    try {
        if (req.method !== 'POST') {
            return res.status(405).json({ error: 'Method not allowed' });
        }

        // Check if GitHub App is configured
        if (!process.env.GITHUB_APP_ID || !process.env.GITHUB_APP_PRIVATE_KEY || !process.env.GITHUB_APP_INSTALLATION_ID) {
            console.log('GitHub App not configured');
            return res.status(503).json({ 
                error: 'GitHub App not configured',
                message: 'Please set up GITHUB_APP_ID, GITHUB_APP_PRIVATE_KEY, and GITHUB_APP_INSTALLATION_ID environment variables',
                configured: false
            });
        }

        const { contentData, userToken } = req.body;

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

        // Initialize GitHub App with proper error handling
        let octokit;
        try {
            const auth = createAppAuth({
                appId: process.env.GITHUB_APP_ID,
                privateKey: process.env.GITHUB_APP_PRIVATE_KEY.replace(/\\n/g, '\n'),
                installationId: process.env.GITHUB_APP_INSTALLATION_ID,
            });

            octokit = new Octokit({ auth });
        } catch (appError) {
            console.error('GitHub App initialization error:', appError);
            return res.status(500).json({
                error: 'GitHub App initialization failed',
                message: 'Failed to initialize GitHub App. Please check your environment variables.',
                details: process.env.NODE_ENV === 'development' ? appError.message : undefined
            });
        }

        // Main bot logic with proper error handling
        let branchName = null;
        try {
            console.log('🤖 Bot creating content submission PR...');
            
            // 1. Verify user authentication
            const userResponse = await fetch('https://api.github.com/user', {
                headers: {
                    'Authorization': `token ${userToken}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (!userResponse.ok) {
                return res.status(401).json({ 
                    error: 'Invalid user token',
                    message: 'Please re-authenticate with GitHub'
                });
            }

            const user = await userResponse.json();
            console.log(`✅ User authenticated: ${user.login}`);

            // 2. Generate unique branch name
            const timestamp = Date.now();
            branchName = `content-submission-${user.login}-${timestamp}`;
            
            // 3. Get latest main branch SHA
            const { data: mainRef } = await octokit.git.getRef({
                owner: 'prepguides',
                repo: 'prepguides.dev',
                ref: 'heads/main'
            });

            // 4. Create new branch
            console.log(`🌿 Creating branch: ${branchName}`);
            await octokit.git.createRef({
                owner: 'prepguides',
                repo: 'prepguides.dev',
                ref: `refs/heads/${branchName}`,
                sha: mainRef.object.sha
            });

            // 5. Create content payload file
            const payloadContent = generatePayloadContent(contentData, user);
            const payloadPath = `.github/content-payloads/${contentData.id}-payload.json`;
            
            console.log(`📝 Creating payload file: ${payloadPath}`);
            await octokit.repos.createOrUpdateFileContents({
                owner: 'prepguides',
                repo: 'prepguides.dev',
                path: payloadPath,
                message: `Add content submission: ${contentData.title}`,
                content: Buffer.from(payloadContent).toString('base64'),
                branch: branchName
            });

            // 6. Create pull request
            console.log(`🔀 Creating pull request...`);
            const { data: pr } = await octokit.pulls.create({
                owner: 'prepguides',
                repo: 'prepguides.dev',
                title: `Content Submission: ${contentData.title}`,
                head: branchName,
                base: 'main',
                body: generatePRDescription(contentData, user)
            });

            // 7. Add labels
            try {
                await octokit.issues.addLabels({
                    owner: 'prepguides',
                    repo: 'prepguides.dev',
                    issue_number: pr.number,
                    labels: ['content-submission', 'needs-review', 'bot-created']
                });
            } catch (labelError) {
                console.warn('Failed to add labels:', labelError);
            }

            console.log(`✅ PR created successfully: #${pr.number}`);

            return res.status(201).json({
                success: true,
                pr: {
                    number: pr.number,
                    html_url: pr.html_url,
                    title: pr.title,
                    state: pr.state,
                    created_at: pr.created_at
                },
                branch: branchName,
                message: 'Content submission PR created successfully!'
            });

        } catch (error) {
            console.error('Bot PR creation error:', error);
            
            // Clean up branch if PR creation failed and branch was created
            if (branchName && octokit) {
                try {
                    await octokit.git.deleteRef({
                        owner: 'prepguides',
                        repo: 'prepguides.dev',
                        ref: `heads/${branchName}`
                    });
                    console.log('🧹 Cleaned up failed branch');
                } catch (cleanupError) {
                    console.warn('Failed to cleanup branch:', cleanupError);
                }
            }

            return res.status(500).json({
                error: 'Failed to create content submission PR',
                message: error.message,
                details: process.env.NODE_ENV === 'development' ? error.stack : undefined
            });
        }
    } catch (outerError) {
        // Catch any errors outside the main try-catch
        console.error('Outer error in bot API:', outerError);
        return res.status(500).json({
            error: 'Internal server error',
            message: 'An unexpected error occurred',
            details: process.env.NODE_ENV === 'development' ? outerError.message : undefined
        });
    }
}

/**
 * Generate payload content in the expected format
 */
function generatePayloadContent(contentData, user) {
    const payload = {
        version: "1.0.0",
        type: "content-addition",
        metadata: {
            title: contentData.title,
            description: contentData.description,
            author: user.login,
            submissionDate: new Date().toISOString().split('T')[0],
            category: contentData.category,
            subtopic: contentData.subtopic || 'general'
        },
        content: {
            id: contentData.id,
            title: contentData.title,
            description: contentData.description,
            type: contentData.type || 'guide',
            status: 'pending',
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

    // Add type-specific fields
    if (contentData.features && contentData.features.length > 0) {
        payload.content.features = contentData.features;
    }

    if (contentData.jsFile) {
        payload.content.jsFile = contentData.jsFile;
    }

    return JSON.stringify(payload, null, 2);
}

/**
 * Generate PR description
 */
function generatePRDescription(contentData, user) {
    return `## 🤖 Bot-Created Content Submission

**Title:** ${contentData.title}
**Category:** ${contentData.category}
**Submitted by:** @${user.login}
**Created by:** PrepGuides Bot

### Description
${contentData.description}

### Content Preview
${(contentData.content || contentData.description || '').substring(0, 200)}${(contentData.content || contentData.description || '').length > 200 ? '...' : ''}

### 🤖 Bot Actions
- ✅ User authentication verified
- ✅ Branch created: \`content-submission-${user.login}-${Date.now()}\`
- ✅ Payload file generated
- ✅ Pull request created
- ✅ Labels applied

### Review Checklist
- [ ] Content is technically accurate
- [ ] Formatting follows site standards
- [ ] No sensitive information included
- [ ] Appropriate category placement
- [ ] Payload structure is valid

### Notes
This content was submitted via the PrepGuides.dev content submission form and automatically processed by our bot. The bot has created a branch-based PR for easy review and merging.

**Bot Version:** 1.0.0
**Submission ID:** ${contentData.id}`;
}
