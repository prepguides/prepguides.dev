/**
 * GitHub App Configuration Diagnostic Endpoint
 * 
 * This endpoint helps diagnose GitHub App configuration issues
 * without exposing sensitive information like private keys.
 */

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const diagnostic = {
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV || 'development',
            githubApp: {
                configured: false,
                hasAppId: false,
                hasPrivateKey: false,
                hasInstallationId: false,
                privateKeyFormat: 'unknown',
                errors: []
            },
            recommendations: []
        };

        // Check GitHub App ID
        if (process.env.GITHUB_APP_ID) {
            diagnostic.githubApp.hasAppId = true;
            diagnostic.githubApp.configured = true;
            
            // Validate App ID format (should be numeric)
            if (!/^\d+$/.test(process.env.GITHUB_APP_ID)) {
                diagnostic.githubApp.errors.push('GITHUB_APP_ID should be numeric');
                diagnostic.recommendations.push('Check that GITHUB_APP_ID is a valid GitHub App ID (numeric)');
            }
        } else {
            diagnostic.githubApp.errors.push('GITHUB_APP_ID is not set');
            diagnostic.recommendations.push('Set GITHUB_APP_ID environment variable in Vercel');
        }

        // Check Private Key
        if (process.env.GITHUB_APP_PRIVATE_KEY) {
            diagnostic.githubApp.hasPrivateKey = true;
            diagnostic.githubApp.configured = true;
            
            const privateKey = process.env.GITHUB_APP_PRIVATE_KEY;
            
            // Check private key format
            if (privateKey.includes('BEGIN RSA PRIVATE KEY')) {
                diagnostic.githubApp.privateKeyFormat = 'RSA';
            } else if (privateKey.includes('BEGIN PRIVATE KEY')) {
                diagnostic.githubApp.privateKeyFormat = 'PKCS#8';
            } else {
                diagnostic.githubApp.errors.push('Private key format is invalid - missing BEGIN marker');
                diagnostic.recommendations.push('Ensure private key starts with "-----BEGIN RSA PRIVATE KEY-----" or "-----BEGIN PRIVATE KEY-----"');
            }

            // Check for common private key issues
            if (privateKey.includes('\\n')) {
                diagnostic.githubApp.errors.push('Private key contains escaped newlines (\\n) - should be actual newlines');
                diagnostic.recommendations.push('Replace \\n with actual newlines in GITHUB_APP_PRIVATE_KEY');
            } else if (privateKey.includes('\n')) {
                // Private key has actual newlines, which is correct
                diagnostic.recommendations.push('✅ Private key has correct newline format');
            }

            if (!privateKey.includes('END')) {
                diagnostic.githubApp.errors.push('Private key is missing END marker');
                diagnostic.recommendations.push('Ensure private key ends with "-----END RSA PRIVATE KEY-----" or "-----END PRIVATE KEY-----"');
            }

            // Check key length (should be substantial)
            if (privateKey.length < 1000) {
                diagnostic.githubApp.errors.push('Private key appears too short');
                diagnostic.recommendations.push('Verify the complete private key was copied to GITHUB_APP_PRIVATE_KEY');
            }
        } else {
            diagnostic.githubApp.errors.push('GITHUB_APP_PRIVATE_KEY is not set');
            diagnostic.recommendations.push('Set GITHUB_APP_PRIVATE_KEY environment variable in Vercel');
        }

        // Check Installation ID
        if (process.env.GITHUB_APP_INSTALLATION_ID) {
            diagnostic.githubApp.hasInstallationId = true;
            
            // Validate Installation ID format (should be numeric)
            if (!/^\d+$/.test(process.env.GITHUB_APP_INSTALLATION_ID)) {
                diagnostic.githubApp.errors.push('GITHUB_APP_INSTALLATION_ID should be numeric');
                diagnostic.recommendations.push('Check that GITHUB_APP_INSTALLATION_ID is a valid installation ID (numeric)');
            }
        } else {
            diagnostic.recommendations.push('GITHUB_APP_INSTALLATION_ID is optional - will be auto-detected if not set');
        }

        // Test JWT token creation (without exposing the token)
        if (diagnostic.githubApp.hasAppId && diagnostic.githubApp.hasPrivateKey) {
            try {
                const { createAppAuth } = await import('@octokit/auth-app');
                
                let privateKey = process.env.GITHUB_APP_PRIVATE_KEY;
                if (privateKey.includes('\\n')) {
                    privateKey = privateKey.replace(/\\n/g, '\n');
                }

                const appAuth = createAppAuth({
                    appId: process.env.GITHUB_APP_ID,
                    privateKey: privateKey,
                });

                // Try to get app token
                const appToken = await appAuth({ type: 'app' });
                
                if (appToken && appToken.token) {
                    diagnostic.githubApp.jwtTest = 'success';
                    diagnostic.recommendations.push('✅ JWT token creation successful - GitHub App configuration is working');
                } else {
                    diagnostic.githubApp.jwtTest = 'failed';
                    diagnostic.githubApp.errors.push('JWT token creation failed - no token returned');
                    diagnostic.recommendations.push('GitHub App configuration may be incorrect');
                }
            } catch (jwtError) {
                diagnostic.githubApp.jwtTest = 'failed';
                diagnostic.githubApp.errors.push(`JWT token creation failed: ${jwtError.message}`);
                
                if (jwtError.message.includes('JSON web token could not be decoded')) {
                    diagnostic.recommendations.push('🔧 JWT decoding error - check GitHub App ID and private key format');
                    diagnostic.recommendations.push('Verify the GitHub App exists and private key is correct');
                } else if (jwtError.message.includes('private key')) {
                    diagnostic.recommendations.push('🔧 Private key error - check format and content');
                } else {
                    diagnostic.recommendations.push('🔧 JWT error - verify GitHub App configuration');
                }
            }
        }

        // Overall status
        if (diagnostic.githubApp.errors.length === 0 && diagnostic.githubApp.jwtTest === 'success') {
            diagnostic.status = 'healthy';
            diagnostic.message = 'GitHub App configuration is working correctly';
        } else if (diagnostic.githubApp.configured) {
            diagnostic.status = 'misconfigured';
            diagnostic.message = 'GitHub App is configured but has issues';
        } else {
            diagnostic.status = 'not_configured';
            diagnostic.message = 'GitHub App is not properly configured';
        }

        return res.status(200).json(diagnostic);

    } catch (error) {
        console.error('Diagnostic endpoint error:', error);
        return res.status(500).json({
            error: 'Diagnostic failed',
            message: error.message,
            timestamp: new Date().toISOString()
        });
    }
}
