/**
 * Test script for the bot API
 * This simulates a content submission to verify the bot works
 */

const testContentData = {
    id: 'test-bot-submission-' + Date.now(),
    title: 'Test Bot Submission',
    description: 'This is a test submission to verify the bot API works correctly',
    category: 'algorithms',
    subtopic: 'testing',
    type: 'guide',
    repo: 'prepguides/test-repo',
    path: 'test/README.md'
};

const testUserToken = 'test-token'; // This would be a real token in production

async function testBotAPI() {
    console.log('🧪 Testing Bot API...');
    console.log('Content Data:', testContentData);
    
    try {
        const response = await fetch('http://localhost:3000/api/github/create-content-pr', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contentData: testContentData,
                userToken: testUserToken
            })
        });

        console.log('Response Status:', response.status);
        
        if (response.ok) {
            const result = await response.json();
            console.log('✅ Bot API Test Successful!');
            console.log('Result:', result);
        } else {
            const error = await response.json();
            console.log('❌ Bot API Test Failed');
            console.log('Error:', error);
        }
    } catch (error) {
        console.log('❌ Bot API Test Error:', error.message);
    }
}

// Only run if this file is executed directly
if (require.main === module) {
    testBotAPI();
}

module.exports = { testBotAPI, testContentData };
