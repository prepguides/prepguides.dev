/**
 * Performance Analyzer for Algorithm Implementations
 * Provides comprehensive performance metrics and complexity analysis
 */

class PerformanceAnalyzer {
    constructor() {
        this.metrics = new Map();
        this.benchmarks = new Map();
        this.complexityAnalysis = new Map();
        this.initializeComplexityData();
    }

    /**
     * Initialize theoretical complexity data for algorithms
     */
    initializeComplexityData() {
        this.complexityAnalysis.set('bubbleSort', {
            time: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
            space: { best: 'O(1)', average: 'O(1)', worst: 'O(1)' },
            stable: true,
            adaptive: true
        });

        this.complexityAnalysis.set('selectionSort', {
            time: { best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)' },
            space: { best: 'O(1)', average: 'O(1)', worst: 'O(1)' },
            stable: false,
            adaptive: false
        });

        this.complexityAnalysis.set('insertionSort', {
            time: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
            space: { best: 'O(1)', average: 'O(1)', worst: 'O(1)' },
            stable: true,
            adaptive: true
        });

        this.complexityAnalysis.set('mergeSort', {
            time: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
            space: { best: 'O(n)', average: 'O(n)', worst: 'O(n)' },
            stable: true,
            adaptive: false
        });

        this.complexityAnalysis.set('quickSort', {
            time: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)' },
            space: { best: 'O(log n)', average: 'O(log n)', worst: 'O(n)' },
            stable: false,
            adaptive: true
        });

        this.complexityAnalysis.set('heapSort', {
            time: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
            space: { best: 'O(1)', average: 'O(1)', worst: 'O(1)' },
            stable: false,
            adaptive: false
        });

        this.complexityAnalysis.set('binarySearch', {
            time: { best: 'O(1)', average: 'O(log n)', worst: 'O(log n)' },
            space: { best: 'O(1)', average: 'O(log n)', worst: 'O(log n)' },
            stable: true,
            adaptive: false
        });

        this.complexityAnalysis.set('bstInsert', {
            time: { best: 'O(log n)', average: 'O(log n)', worst: 'O(n)' },
            space: { best: 'O(log n)', average: 'O(log n)', worst: 'O(n)' },
            stable: true,
            adaptive: true
        });

        this.complexityAnalysis.set('bstSearch', {
            time: { best: 'O(1)', average: 'O(log n)', worst: 'O(n)' },
            space: { best: 'O(1)', average: 'O(log n)', worst: 'O(n)' },
            stable: true,
            adaptive: true
        });

        this.complexityAnalysis.set('bstDelete', {
            time: { best: 'O(log n)', average: 'O(log n)', worst: 'O(n)' },
            space: { best: 'O(log n)', average: 'O(log n)', worst: 'O(n)' },
            stable: true,
            adaptive: true
        });
    }

    /**
     * Start performance measurement
     * @param {string} algorithm - Algorithm name
     * @param {string} operation - Operation type
     * @param {Object} params - Parameters for the operation
     */
    startMeasurement(algorithm, operation, params = {}) {
        const key = `${algorithm}_${operation}`;
        const measurement = {
            algorithm,
            operation,
            params,
            startTime: performance.now(),
            startMemory: this.getMemoryUsage(),
            comparisons: 0,
            swaps: 0,
            operations: 0,
            iterations: 0
        };

        this.metrics.set(key, measurement);
        return key;
    }

    /**
     * End performance measurement
     * @param {string} key - Measurement key
     * @param {Object} additionalMetrics - Additional metrics to record
     */
    endMeasurement(key, additionalMetrics = {}) {
        const measurement = this.metrics.get(key);
        if (!measurement) {
            console.warn(`No measurement found for key: ${key}`);
            return null;
        }

        const endTime = performance.now();
        const endMemory = this.getMemoryUsage();

        const result = {
            ...measurement,
            ...additionalMetrics,
            duration: endTime - measurement.startTime,
            memoryDelta: endMemory - measurement.startMemory,
            endTime,
            endMemory
        };

        // Calculate derived metrics
        result.operationsPerSecond = result.operations / (result.duration / 1000);
        result.comparisonsPerSecond = result.comparisons / (result.duration / 1000);
        result.swapsPerSecond = result.swaps / (result.duration / 1000);

        // Store the result
        this.metrics.set(key, result);
        return result;
    }

    /**
     * Get memory usage (if available)
     * @returns {number} Memory usage in bytes
     */
    getMemoryUsage() {
        if (performance.memory) {
            return performance.memory.usedJSHeapSize;
        }
        return 0;
    }

    /**
     * Run benchmark for an algorithm
     * @param {string} algorithm - Algorithm name
     * @param {Function} implementation - Algorithm implementation
     * @param {Array} testCases - Array of test cases
     * @param {Object} options - Benchmark options
     */
    async runBenchmark(algorithm, implementation, testCases, options = {}) {
        const {
            iterations = 1,
            warmup = 0,
            timeout = 30000
        } = options;

        const results = [];

        // Warmup runs
        for (let i = 0; i < warmup; i++) {
            for (const testCase of testCases) {
                try {
                    await implementation(testCase.data);
                } catch (error) {
                    console.warn(`Warmup failed for ${algorithm}:`, error);
                }
            }
        }

        // Actual benchmark runs
        for (let i = 0; i < iterations; i++) {
            for (const testCase of testCases) {
                const key = this.startMeasurement(algorithm, `run_${i}`, {
                    dataSize: testCase.data.length,
                    dataType: testCase.type || 'random'
                });

                try {
                    const startTime = performance.now();
                    const result = await implementation(testCase.data);
                    const endTime = performance.now();

                    const measurement = this.endMeasurement(key, {
                        result,
                        success: true,
                        dataSize: testCase.data.length,
                        dataType: testCase.type || 'random'
                    });

                    if (measurement) {
                        results.push(measurement);
                    }
                } catch (error) {
                    this.endMeasurement(key, {
                        success: false,
                        error: error.message,
                        dataSize: testCase.data.length,
                        dataType: testCase.type || 'random'
                    });
                }
            }
        }

        // Store benchmark results
        this.benchmarks.set(algorithm, results);
        return this.analyzeBenchmarkResults(algorithm, results);
    }

    /**
     * Analyze benchmark results
     * @param {string} algorithm - Algorithm name
     * @param {Array} results - Benchmark results
     */
    analyzeBenchmarkResults(algorithm, results) {
        if (results.length === 0) {
            return null;
        }

        const successful = results.filter(r => r.success);
        const failed = results.filter(r => !r.success);

        const analysis = {
            algorithm,
            totalRuns: results.length,
            successfulRuns: successful.length,
            failedRuns: failed.length,
            successRate: successful.length / results.length,
            statistics: this.calculateStatistics(successful),
            complexity: this.complexityAnalysis.get(algorithm),
            recommendations: this.generateRecommendations(algorithm, successful)
        };

        return analysis;
    }

    /**
     * Calculate statistical metrics
     * @param {Array} results - Successful results
     */
    calculateStatistics(results) {
        if (results.length === 0) {
            return null;
        }

        const durations = results.map(r => r.duration);
        const comparisons = results.map(r => r.comparisons);
        const swaps = results.map(r => r.swaps);
        const operations = results.map(r => r.operations);

        return {
            duration: this.calculateStats(durations),
            comparisons: this.calculateStats(comparisons),
            swaps: this.calculateStats(swaps),
            operations: this.calculateStats(operations)
        };
    }

    /**
     * Calculate basic statistics for an array of values
     * @param {Array} values - Array of numeric values
     */
    calculateStats(values) {
        if (values.length === 0) {
            return null;
        }

        const sorted = [...values].sort((a, b) => a - b);
        const sum = values.reduce((a, b) => a + b, 0);
        const mean = sum / values.length;
        const median = sorted[Math.floor(sorted.length / 2)];
        const min = sorted[0];
        const max = sorted[sorted.length - 1];
        const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / values.length;
        const stdDev = Math.sqrt(variance);

        return {
            count: values.length,
            sum,
            mean: Math.round(mean * 100) / 100,
            median: Math.round(median * 100) / 100,
            min: Math.round(min * 100) / 100,
            max: Math.round(max * 100) / 100,
            variance: Math.round(variance * 100) / 100,
            stdDev: Math.round(stdDev * 100) / 100
        };
    }

    /**
     * Generate performance recommendations
     * @param {string} algorithm - Algorithm name
     * @param {Array} results - Successful results
     */
    generateRecommendations(algorithm, results) {
        const recommendations = [];
        const complexity = this.complexityAnalysis.get(algorithm);

        if (!complexity || results.length === 0) {
            return recommendations;
        }

        const avgDuration = results.reduce((sum, r) => sum + r.duration, 0) / results.length;
        const avgComparisons = results.reduce((sum, r) => sum + r.comparisons, 0) / results.length;
        const avgSwaps = results.reduce((sum, r) => sum + r.swaps, 0) / results.length;

        // Performance recommendations based on complexity
        if (complexity.time.worst.includes('O(n²)') && avgDuration > 1000) {
            recommendations.push({
                type: 'performance',
                severity: 'high',
                message: 'Consider using O(n log n) algorithms for large datasets',
                suggestion: 'Try Merge Sort or Quick Sort for better performance'
            });
        }

        if (complexity.adaptive && avgComparisons > avgSwaps * 2) {
            recommendations.push({
                type: 'efficiency',
                severity: 'medium',
                message: 'High comparison-to-swap ratio detected',
                suggestion: 'Algorithm may benefit from early termination optimizations'
            });
        }

        if (complexity.space.worst.includes('O(n)') && results[0].memoryDelta > 1000000) {
            recommendations.push({
                type: 'memory',
                severity: 'medium',
                message: 'High memory usage detected',
                suggestion: 'Consider in-place algorithms for memory-constrained environments'
            });
        }

        return recommendations;
    }

    /**
     * Compare algorithms
     * @param {Array} algorithms - Array of algorithm names to compare
     * @param {Object} testCase - Test case to use for comparison
     */
    compareAlgorithms(algorithms, testCase) {
        const comparison = {
            testCase,
            algorithms: {},
            winner: null,
            summary: {}
        };

        for (const algorithm of algorithms) {
            const results = this.benchmarks.get(algorithm);
            if (results && results.length > 0) {
                const successful = results.filter(r => r.success);
                if (successful.length > 0) {
                    const avgDuration = successful.reduce((sum, r) => sum + r.duration, 0) / successful.length;
                    const avgComparisons = successful.reduce((sum, r) => sum + r.comparisons, 0) / successful.length;
                    const avgSwaps = successful.reduce((sum, r) => sum + r.swaps, 0) / successful.length;

                    comparison.algorithms[algorithm] = {
                        avgDuration: Math.round(avgDuration * 100) / 100,
                        avgComparisons: Math.round(avgComparisons * 100) / 100,
                        avgSwaps: Math.round(avgSwaps * 100) / 100,
                        complexity: this.complexityAnalysis.get(algorithm)
                    };
                }
            }
        }

        // Determine winner based on duration
        const algorithmNames = Object.keys(comparison.algorithms);
        if (algorithmNames.length > 0) {
            comparison.winner = algorithmNames.reduce((winner, current) => {
                return comparison.algorithms[current].avgDuration < comparison.algorithms[winner].avgDuration
                    ? current : winner;
            });
        }

        return comparison;
    }

    /**
     * Generate performance report
     * @param {string} algorithm - Algorithm name
     */
    generateReport(algorithm) {
        const results = this.benchmarks.get(algorithm);
        const complexity = this.complexityAnalysis.get(algorithm);

        if (!results || results.length === 0) {
            return {
                algorithm,
                status: 'no_data',
                message: 'No benchmark data available'
            };
        }

        const analysis = this.analyzeBenchmarkResults(algorithm, results);
        const successful = results.filter(r => r.success);

        return {
            algorithm,
            status: 'success',
            summary: {
                totalRuns: results.length,
                successRate: analysis.successRate,
                avgDuration: analysis.statistics.duration.mean,
                avgComparisons: analysis.statistics.comparisons.mean,
                avgSwaps: analysis.statistics.swaps.mean
            },
            complexity,
            statistics: analysis.statistics,
            recommendations: analysis.recommendations,
            rawData: successful
        };
    }

    /**
     * Export benchmark data
     * @param {string} format - Export format ('json', 'csv')
     */
    exportData(format = 'json') {
        const data = {
            benchmarks: Object.fromEntries(this.benchmarks),
            complexity: Object.fromEntries(this.complexityAnalysis),
            timestamp: new Date().toISOString()
        };

        if (format === 'json') {
            return JSON.stringify(data, null, 2);
        } else if (format === 'csv') {
            return this.convertToCSV(data);
        }

        return data;
    }

    /**
     * Convert data to CSV format
     * @param {Object} data - Data to convert
     */
    convertToCSV(data) {
        const rows = [];
        rows.push('Algorithm,Operation,Duration,Comparisons,Swaps,Operations,DataSize,DataType,Success');

        for (const [algorithm, results] of Object.entries(data.benchmarks)) {
            for (const result of results) {
                rows.push([
                    algorithm,
                    result.operation,
                    result.duration,
                    result.comparisons,
                    result.swaps,
                    result.operations,
                    result.dataSize,
                    result.dataType,
                    result.success
                ].join(','));
            }
        }

        return rows.join('\n');
    }

    /**
     * Clear all data
     */
    clear() {
        this.metrics.clear();
        this.benchmarks.clear();
    }
}

// Export for use in other modules
window.PerformanceAnalyzer = PerformanceAnalyzer;
