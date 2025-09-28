/**
 * GitHub OAuth Authentication Handler
 * Handles the OAuth flow for GitHub authentication
 */

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { code } = req.body;

    if (!code) {
        return res.status(400).json({ error: 'Authorization code is required' });
    }

    try {
        // Exchange code for access token
        const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code: code,
            }),
        });

        if (!tokenResponse.ok) {
            throw new Error('Failed to exchange code for token');
        }

        const tokenData = await tokenResponse.json();

        if (tokenData.error) {
            throw new Error(tokenData.error_description || 'OAuth error');
        }

        // Return the access token
        res.status(200).json({
            access_token: tokenData.access_token,
            token_type: tokenData.token_type,
            scope: tokenData.scope,
        });

    } catch (error) {
        console.error('GitHub OAuth error:', error);
        res.status(500).json({ 
            error: 'Authentication failed',
            message: error.message 
        });
    }
}
