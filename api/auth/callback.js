/**
 * OAuth Callback Handler
 * Handles GitHub OAuth callback and redirects appropriately
 */

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { code, state, error } = req.query;

    // Handle OAuth errors
    if (error) {
        const errorUrl = new URL('/auth/callback', req.headers.origin || 'https://prepguides-dev.vercel.app');
        errorUrl.searchParams.set('error', error);
        errorUrl.searchParams.set('error_description', req.query.error_description || 'OAuth error');
        return res.redirect(errorUrl.toString());
    }

    // Handle missing authorization code
    if (!code) {
        const errorUrl = new URL('/auth/callback', req.headers.origin || 'https://prepguides-dev.vercel.app');
        errorUrl.searchParams.set('error', 'missing_code');
        errorUrl.searchParams.set('error_description', 'No authorization code received');
        return res.redirect(errorUrl.toString());
    }

    // Get the return URL from query params or default to production
    const returnUrl = req.query.return_url || 'https://prepguides-dev.vercel.app';
    
    // Create the callback URL with the authorization code
    const callbackUrl = new URL('/auth/callback', returnUrl);
    callbackUrl.searchParams.set('code', code);
    if (state) {
        callbackUrl.searchParams.set('state', state);
    }

    // Redirect to the appropriate callback page
    return res.redirect(callbackUrl.toString());
}
