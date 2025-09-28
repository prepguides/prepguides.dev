/**
 * Health Check Endpoint
 * Simple endpoint to verify API functionality
 */

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const isConfigured = !!(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET);

    res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        github_oauth_configured: isConfigured,
        environment: process.env.NODE_ENV || 'development'
    });
}
