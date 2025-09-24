#!/usr/bin/env node

/**
 * Command-line Algorithm Core Logic Tester
 * Run with: node test-algorithms.js
 */

const fs = require('fs');
const path = require('path');

// Import the algorithm classes (we'll need to adapt them for Node.js)
const { BinarySearchTree, Graph, Trie, SortingAlgorithms, AlgorithmTester } = require('./algorithm-core-tests.js');

class CommandLineTester {
    constructor() {
        this.results = {};
        this.startTime = Date.now();
    }

    async runAllTests() {
        console.log('🧪 Algorithm Core Logic Tester (Command Line)');
        console.log('==============================================\n');
        
        const tester = new AlgorithmTester();
        tester.runAllTests();
        
        this.results = tester.results;
        this.generateReport();
        this.saveResults();
    }

    generateReport() {
        const endTime = Date.now();
        const duration = endTime - this.startTime;
        
        console.log('\n📊 Detailed Test Report');
        console.log('========================');
        
        const algorithms = [
            { key: 'bst', name: 'Binary Search Tree', icon: '🌳' },
            { key: 'graph', name: 'Graph Traversal', icon: '🕸️' },
            { key: 'trie', name: 'Trie Operations', icon: '📝' },
            { key: 'sorting', name: 'Sorting Algorithms', icon: '🔢' }
        ];

        algorithms.forEach(algo => {
            const result = this.results[algo.key];
            if (!result) return;

            const totalTests = result.passed + result.failed;
            const successRate = totalTests > 0 ? Math.round((result.passed / totalTests) * 100) : 0;
            
            console.log(`\n${algo.icon} ${algo.name}:`);
            console.log(`   Tests: ${result.passed}/${totalTests} passed (${successRate}%)`);
            
            if (result.failed > 0) {
                console.log(`   ❌ Failed tests:`);
                result.tests.forEach(test => {
                    if (!test.passed) {
                        console.log(`      - ${test.name}`);
                    }
                });
            } else {
                console.log(`   ✅ All tests passed!`);
            }
        });

        const totalPassed = Object.values(this.results).reduce((sum, r) => sum + r.passed, 0);
        const totalFailed = Object.values(this.results).reduce((sum, r) => sum + r.failed, 0);
        const totalTests = totalPassed + totalFailed;
        const overallSuccessRate = totalTests > 0 ? Math.round((totalPassed / totalTests) * 100) : 0;

        console.log('\n🎯 Overall Results:');
        console.log(`   Total Tests: ${totalTests}`);
        console.log(`   Passed: ${totalPassed}`);
        console.log(`   Failed: ${totalFailed}`);
        console.log(`   Success Rate: ${overallSuccessRate}%`);
        console.log(`   Duration: ${duration}ms`);

        if (totalFailed === 0) {
            console.log('\n🎉 All algorithm core logic tests passed!');
            console.log('✅ Ready for production deployment');
        } else {
            console.log(`\n⚠️ ${totalFailed} tests failed. Please fix the issues before deployment.`);
            process.exit(1);
        }
    }

    saveResults() {
        const report = {
            timestamp: new Date().toISOString(),
            duration: Date.now() - this.startTime,
            summary: {
                totalPassed: Object.values(this.results).reduce((sum, r) => sum + r.passed, 0),
                totalFailed: Object.values(this.results).reduce((sum, r) => sum + r.failed, 0),
                successRate: 0
            },
            details: this.results
        };

        report.summary.successRate = report.summary.totalPassed + report.summary.totalFailed > 0 
            ? Math.round((report.summary.totalPassed / (report.summary.totalPassed + report.summary.totalFailed)) * 100)
            : 0;

        const filename = `test-results-${new Date().toISOString().split('T')[0]}.json`;
        fs.writeFileSync(filename, JSON.stringify(report, null, 2));
        console.log(`\n📄 Test results saved to: ${filename}`);
    }
}

// Run tests if this file is executed directly
if (require.main === module) {
    const tester = new CommandLineTester();
    tester.runAllTests().catch(console.error);
}

module.exports = CommandLineTester;
