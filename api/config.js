/**
 * Configuration Endpoint
 * Returns public configuration information
 */

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const isConfigured = !!(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET);

    res.status(200).json({
        github_oauth_configured: isConfigured,
        client_id: isConfigured ? process.env.GITHUB_CLIENT_ID : null,
        environment: process.env.NODE_ENV || 'development'
    });
}
