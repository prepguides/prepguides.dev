/**
 * GitHub PR Creation Handler
 * Creates pull requests for content submissions
 */

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Check if environment variables are configured
    if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
        console.log('GitHub integration not configured - missing environment variables');
        return res.status(503).json({ 
            error: 'GitHub integration not configured',
            message: 'Please set up GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET environment variables',
            configured: false
        });
    }

    const { title, body, head, base } = req.body;
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Authorization token required' });
    }

    const token = authHeader.substring(7);

    if (!title || !body || !head || !base) {
        return res.status(400).json({ 
            error: 'Missing required fields: title, body, head, base' 
        });
    }

    try {
        console.log('Creating PR with data:', { title, head, base });
        
        // Create the pull request
        const prResponse = await fetch('https://api.github.com/repos/prepguides/prepguides.dev/pulls', {
            method: 'POST',
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title,
                body,
                head,
                base,
            }),
        });

        console.log('GitHub API response status:', prResponse.status);

        if (!prResponse.ok) {
            const errorData = await prResponse.json();
            console.error('GitHub API error:', errorData);
            throw new Error(errorData.message || 'Failed to create pull request');
        }

        const prData = await prResponse.json();

        // Add labels to the PR
        try {
            await fetch(`https://api.github.com/repos/prepguides/prepguides.dev/issues/${prData.number}/labels`, {
                method: 'POST',
                headers: {
                    'Authorization': `token ${token}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    labels: ['content-submission', 'needs-review']
                }),
            });
        } catch (labelError) {
            console.warn('Failed to add labels to PR:', labelError);
            // Don't fail the entire request if labeling fails
        }

        res.status(201).json({
            number: prData.number,
            html_url: prData.html_url,
            title: prData.title,
            state: prData.state,
            created_at: prData.created_at,
        });

    } catch (error) {
        console.error('PR creation error:', error);
        res.status(500).json({ 
            error: 'Failed to create pull request',
            message: error.message 
        });
    }
}
