# Code Execution Synchronization Framework

## 🎯 Overview

This framework provides **Code-Execution Synchronization**, **Visual Integration**, and **Performance Metrics** for algorithm visualizations. It enables side-by-side code highlighting during algorithm execution, synchronized with visual steps, and comprehensive performance analysis.

## 🚀 Features

### ✅ Code-Execution Synchronization
- **Side-by-side code highlighting** during algorithm execution
- **Multi-language support** (Go and Java implementations)
- **Step-by-step execution** with visual feedback
- **Synchronized highlighting** across multiple code blocks

### ✅ Visual Integration
- **Real-time code highlighting** synchronized with algorithm steps
- **Multiple highlight types** (executing, comparing, swapping, inserting, deleting)
- **Smooth animations** and transitions
- **Responsive design** for all screen sizes

### ✅ Performance Metrics
- **Comprehensive performance analysis** with complexity analysis
- **Real-time statistics** (comparisons, swaps, operations, duration)
- **Benchmarking capabilities** with statistical analysis
- **Algorithm comparison** and recommendations

## 📁 File Structure

```
algorithms/code/
├── code-execution-sync.js          # Core synchronization framework
├── code-highlighting.css           # Styling for code highlighting
├── performance-analyzer.js         # Performance analysis and benchmarking
├── enhanced-bst-visualization.html # BST with code sync example
├── enhanced-sorting-visualization.html # Sorting with code sync example
├── go/                             # Go implementations
│   ├── binary_search_tree.go
│   └── sorting_algorithms.go
├── java/                           # Java implementations
│   ├── BinarySearchTree.java
│   └── SortingAlgorithms.java
└── tests/                          # Test suites
    ├── binary_search_tree_test.go
    ├── sorting_algorithms_test.go
    ├── BinarySearchTreeTest.java
    └── SortingAlgorithmsTest.java
```

## 🛠️ Usage

### Basic Setup

```html
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="code-highlighting.css">
</head>
<body>
    <script src="code-execution-sync.js"></script>
    <script src="performance-analyzer.js"></script>
    
    <div class="code-execution-container">
        <div class="code-panel go">
            <h3>Go Implementation</h3>
            <div id="goCodeBlock" class="code-block" data-language="go"></div>
        </div>
        <div class="code-panel java">
            <h3>Java Implementation</h3>
            <div id="javaCodeBlock" class="code-block" data-language="java"></div>
        </div>
    </div>
</body>
</html>
```

### Code Execution Synchronization

```javascript
// Initialize the framework
const codeSync = new CodeExecutionSync();

// Create code blocks
const goCode = `func (bst *BinarySearchTree) Insert(value int) {
    bst.Root = bst.insertNode(bst.Root, value)
}`;

const goCodeBlock = codeSync.createCodeBlock(goCode, 'go');
document.getElementById('goCodeBlock').appendChild(goCodeBlock);

// Register code block for synchronization
codeSync.registerCodeBlock('go', goCodeBlock, [
    { line: 1, description: 'Insert method definition' },
    { line: 2, description: 'Call insertNode helper' }
]);

// Define execution steps
const executionSteps = [
    {
        id: 'insert_start',
        codeBlocks: {
            go: [1, 2],
            java: [1, 2]
        },
        type: 'executing',
        description: 'Starting insert operation',
        metrics: { operations: 1 }
    },
    {
        id: 'insert_compare',
        codeBlocks: {
            go: [3, 4],
            java: [3, 4]
        },
        type: 'comparing',
        description: 'Comparing values',
        metrics: { comparisons: 1 }
    }
];

// Start execution
await codeSync.startExecution('bstInsert', executionSteps);
```

### Performance Analysis

```javascript
// Initialize performance analyzer
const analyzer = new PerformanceAnalyzer();

// Start measurement
const key = analyzer.startMeasurement('bubbleSort', 'sort', {
    dataSize: 1000,
    dataType: 'random'
});

// Run algorithm
const result = await bubbleSort(data);

// End measurement
const metrics = analyzer.endMeasurement(key, {
    comparisons: result.comparisons,
    swaps: result.swaps,
    operations: result.operations
});

// Run benchmark
const testCases = [
    { data: generateRandomArray(100), type: 'random' },
    { data: generateSortedArray(100), type: 'sorted' },
    { data: generateReverseSortedArray(100), type: 'reverse' }
];

const benchmarkResults = await analyzer.runBenchmark(
    'bubbleSort',
    bubbleSort,
    testCases,
    { iterations: 10, warmup: 2 }
);

// Generate report
const report = analyzer.generateReport('bubbleSort');
console.log(report);
```

## 🎨 Code Highlighting Types

The framework supports multiple highlighting types for different algorithm operations:

- **`executing`** - General execution (blue)
- **`comparing`** - Comparison operations (yellow)
- **`swapping`** - Swap operations (red)
- **`inserting`** - Insert operations (green)
- **`deleting`** - Delete operations (red)
- **`searching`** - Search operations (purple)

## 📊 Performance Metrics

### Real-time Metrics
- **Comparisons** - Number of element comparisons
- **Swaps** - Number of element swaps
- **Operations** - Total operations performed
- **Duration** - Execution time in milliseconds
- **Memory Usage** - Memory consumption (if available)

### Statistical Analysis
- **Mean, Median, Min, Max** - Statistical measures
- **Standard Deviation** - Performance consistency
- **Success Rate** - Percentage of successful runs
- **Operations per Second** - Throughput metrics

### Complexity Analysis
- **Time Complexity** - Theoretical time complexity
- **Space Complexity** - Theoretical space complexity
- **Stability** - Whether algorithm is stable
- **Adaptivity** - Whether algorithm is adaptive

## 🔧 Configuration

### Execution Speed Control

```javascript
// Set execution speed (milliseconds per step)
codeSync.setExecutionSpeed(1000); // 1 second per step

// Update speed dynamically
document.getElementById('speedSlider').addEventListener('change', (e) => {
    const speed = 2000 - (e.target.value * 200);
    codeSync.setExecutionSpeed(speed);
});
```

### Event Handling

```javascript
// Listen for execution completion
document.addEventListener('codeExecutionComplete', (event) => {
    const { metrics, progress } = event.detail;
    console.log('Execution completed:', metrics);
    updatePerformanceDisplay(metrics);
});

// Listen for step completion
codeSync.registerStepCallback('insert_complete', (step) => {
    console.log('Insert step completed:', step);
    updateVisualization(step);
});
```

## 🧪 Testing

### Running Tests

#### Go Tests
```bash
cd algorithms/code/tests
go test -v binary_search_tree_test.go
go test -v sorting_algorithms_test.go
```

#### Java Tests
```bash
cd algorithms/code/tests
javac -cp .:junit-5.jar *.java
java -cp .:junit-5.jar org.junit.platform.console.ConsoleLauncher --scan-classpath
```

### Test Coverage
- **Unit Tests** - Individual method testing
- **Integration Tests** - End-to-end functionality
- **Performance Tests** - Benchmarking and stress testing
- **Edge Cases** - Boundary conditions and error handling

## 📈 Benchmarking

### Creating Test Cases

```javascript
const testCases = [
    {
        data: generateRandomArray(1000),
        type: 'random',
        description: 'Random data'
    },
    {
        data: generateSortedArray(1000),
        type: 'sorted',
        description: 'Already sorted data'
    },
    {
        data: generateReverseSortedArray(1000),
        type: 'reverse',
        description: 'Reverse sorted data'
    }
];
```

### Running Benchmarks

```javascript
const results = await analyzer.runBenchmark(
    'quickSort',
    quickSortImplementation,
    testCases,
    {
        iterations: 10,    // Number of runs per test case
        warmup: 2,         // Warmup runs (not counted)
        timeout: 30000     // Timeout in milliseconds
    }
);
```

### Comparing Algorithms

```javascript
const comparison = analyzer.compareAlgorithms(
    ['bubbleSort', 'quickSort', 'mergeSort'],
    { data: generateRandomArray(1000), type: 'random' }
);

console.log('Winner:', comparison.winner);
console.log('Results:', comparison.algorithms);
```

## 🎯 Best Practices

### Code Organization
1. **Separate concerns** - Keep visualization, code sync, and performance analysis separate
2. **Modular design** - Use the framework as building blocks
3. **Consistent naming** - Follow established naming conventions
4. **Error handling** - Always handle errors gracefully

### Performance Optimization
1. **Minimize DOM updates** - Batch DOM operations
2. **Use requestAnimationFrame** - For smooth animations
3. **Debounce user input** - Prevent excessive updates
4. **Memory management** - Clean up event listeners and timers

### User Experience
1. **Progressive disclosure** - Show information gradually
2. **Clear feedback** - Provide immediate visual feedback
3. **Accessibility** - Ensure keyboard navigation and screen reader support
4. **Responsive design** - Work on all screen sizes

## 🔮 Future Enhancements

### Planned Features
- **Multi-threading support** - Parallel algorithm execution
- **Advanced visualizations** - 3D visualizations and animations
- **Machine learning integration** - Algorithm performance prediction
- **Cloud benchmarking** - Distributed performance testing
- **Real-time collaboration** - Multi-user algorithm exploration

### Extension Points
- **Custom highlight types** - Add new highlighting categories
- **Plugin system** - Extend functionality with plugins
- **API integration** - Connect with external services
- **Export formats** - Additional export options (PDF, video)

## 📚 Examples

See the included example files:
- `enhanced-bst-visualization.html` - Binary Search Tree with code sync
- `enhanced-sorting-visualization.html` - Sorting algorithms with code sync

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**
3. **Add tests** for new functionality
4. **Update documentation**
5. **Submit a pull request**

## 📄 License

This framework is part of the PrepGuides.dev project and follows the same licensing terms.

---

**Last Updated**: January 25, 2025
**Version**: 1.0.0
**Status**: Production Ready
