/**
 * Test GitHub App credentials directly
 * This endpoint tests if the GitHub App credentials are valid
 */

import { createAppAuth } from '@octokit/auth-app';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        console.log('🧪 Testing GitHub App credentials directly...');
        
        // Check if GitHub App is configured
        if (!process.env.GITHUB_APP_ID || !process.env.GITHUB_APP_PRIVATE_KEY) {
            return res.status(500).json({
                error: 'GitHub App not configured',
                message: 'GITHUB_APP_ID or GITHUB_APP_PRIVATE_KEY is missing'
            });
        }

        const appId = process.env.GITHUB_APP_ID;
        let privateKey = process.env.GITHUB_APP_PRIVATE_KEY;
        
        console.log('🔍 Environment variables analysis:');
        console.log('  - App ID:', appId);
        console.log('  - App ID type:', typeof appId);
        console.log('  - App ID is numeric:', /^\d+$/.test(appId));
        console.log('  - Private key length:', privateKey.length);
        console.log('  - Private key contains \\n:', privateKey.includes('\\n'));
        console.log('  - Private key contains actual newlines:', privateKey.includes('\n'));
        console.log('  - Private key starts with:', privateKey.substring(0, 50));
        console.log('  - Private key ends with:', privateKey.substring(privateKey.length - 50));

        // Process private key if it contains escaped newlines
        if (privateKey.includes('\\n')) {
            console.log('🔧 Processing private key with escaped newlines');
            privateKey = privateKey.replace(/\\n/g, '\n');
            console.log('  - After processing, contains actual newlines:', privateKey.includes('\n'));
        }

        // Test 1: Create app auth
        console.log('🧪 Test 1: Creating app auth...');
        const appAuth = createAppAuth({
            appId: appId,
            privateKey: privateKey,
        });
        console.log('✅ App auth created successfully');

        // Test 2: Get app token
        console.log('🧪 Test 2: Getting app token...');
        const appToken = await appAuth({ type: 'app' });
        console.log('✅ App token obtained successfully');
        console.log('  - Token length:', appToken.token ? appToken.token.length : 'null');
        console.log('  - Token type:', appToken.type);

        return res.status(200).json({
            success: true,
            message: 'GitHub App credentials test successful',
            details: {
                appId: appId,
                appIdType: typeof appId,
                appIdIsNumeric: /^\d+$/.test(appId),
                privateKeyLength: privateKey.length,
                privateKeyHasEscapedNewlines: process.env.GITHUB_APP_PRIVATE_KEY.includes('\\n'),
                privateKeyHasActualNewlines: privateKey.includes('\n'),
                tokenLength: appToken.token ? appToken.token.length : null,
                tokenType: appToken.type
            }
        });

    } catch (error) {
        console.error('❌ GitHub App credentials test failed:', error.message);
        console.error('Error details:', error);
        return res.status(500).json({
            error: 'GitHub App credentials test failed',
            message: error.message,
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
}
