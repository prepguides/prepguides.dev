/**
 * Test endpoint to verify bot API functionality
 * This endpoint tests the GitHub App authentication without creating actual PRs
 */

import { Octokit } from '@octokit/rest';
import { createAppAuth } from '@octokit/auth-app';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        console.log('🧪 Testing bot API functionality...');
        
        // Check if GitHub App is configured
        if (!process.env.GITHUB_APP_ID || !process.env.GITHUB_APP_PRIVATE_KEY) {
            return res.status(500).json({
                error: 'GitHub App not configured',
                message: 'GITHUB_APP_ID or GITHUB_APP_PRIVATE_KEY is missing'
            });
        }

        // Use the same approach as the bot API
        let privateKey = process.env.GITHUB_APP_PRIVATE_KEY;
        if (privateKey.includes('\\n')) {
            console.log('🔧 Processing private key with escaped newlines');
            privateKey = privateKey.replace(/\\n/g, '\n');
        }

        console.log('🔧 Creating GitHub App auth...');
        const appAuth = createAppAuth({
            appId: process.env.GITHUB_APP_ID,
            privateKey: privateKey,
        });

        console.log('🔑 Getting app token...');
        const appToken = await appAuth({ type: 'app' });
        console.log('✅ App token obtained successfully');

        const tempOctokit = new Octokit({ auth: appToken.token });

        console.log('🔍 Finding installations...');
        const installations = await tempOctokit.apps.listInstallations();
        console.log('✅ Found installations:', installations.data.length);

        const targetInstallation = installations.data.find(installation => 
            installation.account.login === 'prepguides'
        );

        if (!targetInstallation) {
            return res.status(500).json({
                error: 'No installation found',
                message: 'No installation found for prepguides organization',
                availableInstallations: installations.data.map(i => i.account.login)
            });
        }

        console.log('✅ Found prepguides installation:', targetInstallation.id);

        // Test installation auth
        console.log('🔧 Creating installation auth...');
        const auth = createAppAuth({
            appId: process.env.GITHUB_APP_ID,
            privateKey: privateKey,
            installationId: targetInstallation.id,
        });

        const octokit = new Octokit({ auth });

        // Test installation token with simple API call
        console.log('🧪 Testing installation token...');
        const testResponse = await octokit.rest.apps.getInstallation({
            installation_id: targetInstallation.id
        });
        console.log('✅ Installation token test successful');

        return res.status(200).json({
            success: true,
            message: 'Bot API is working correctly',
            details: {
                appId: process.env.GITHUB_APP_ID,
                installationId: targetInstallation.id,
                installationAccount: testResponse.data.account.login,
                privateKeyLength: privateKey.length,
                tokenLength: appToken.token ? appToken.token.length : 0
            }
        });

    } catch (error) {
        console.error('❌ Bot API test failed:', error.message);
        return res.status(500).json({
            error: 'Bot API test failed',
            message: error.message,
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
}
