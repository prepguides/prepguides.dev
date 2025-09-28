// Extended methods for SortingVisualizer class
// This file contains the code execution synchronization methods

// Add these methods to the SortingVisualizer class
SortingVisualizer.prototype.initializeCodeBlocks = function() {
    // Go code for sorting algorithms
    const goCode = `func BubbleSort(arr []int) {
    n := len(arr)
    for i := 0; i < n-1; i++ {
        for j := 0; j < n-i-1; j++ {
            if arr[j] > arr[j+1] {
                arr[j], arr[j+1] = arr[j+1], arr[j]
            }
        }
    }
}

func QuickSort(arr []int) {
    quickSortRecursive(arr, 0, len(arr)-1)
}

func quickSortRecursive(arr []int, low, high int) {
    if low < high {
        pi := partition(arr, low, high)
        quickSortRecursive(arr, low, pi-1)
        quickSortRecursive(arr, pi+1, high)
    }
}

func partition(arr []int, low, high int) int {
    pivot := arr[high]
    i := low - 1
    
    for j := low; j < high; j++ {
        if arr[j] < pivot {
            i++
            arr[i], arr[j] = arr[j], arr[i]
        }
    }
    arr[i+1], arr[high] = arr[high], arr[i+1]
    return i + 1
}`;

    // Java code for sorting algorithms
    const javaCode = `public static void bubbleSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
}

public static void quickSort(int[] arr) {
    quickSortRecursive(arr, 0, arr.length - 1);
}

private static void quickSortRecursive(int[] arr, int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSortRecursive(arr, low, pi - 1);
        quickSortRecursive(arr, pi + 1, high);
    }
}

private static int partition(int[] arr, int low, int high) {
    int pivot = arr[high];
    int i = (low - 1);
    
    for (int j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            int temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
    }
    int temp = arr[i + 1];
    arr[i + 1] = arr[high];
    arr[high] = temp;
    return i + 1;
}`;

    // Create code blocks
    const goCodeBlock = this.codeSync.createCodeBlock(goCode, 'go');
    const javaCodeBlock = this.codeSync.createCodeBlock(javaCode, 'java');
    
    document.getElementById('goCodeBlock').appendChild(goCodeBlock);
    document.getElementById('javaCodeBlock').appendChild(javaCodeBlock);

    // Register code blocks
    this.codeSync.registerCodeBlock('go', goCodeBlock, [
        { line: 1, description: 'Bubble Sort function definition' },
        { line: 2, description: 'Get array length' },
        { line: 3, description: 'Outer loop for passes' },
        { line: 4, description: 'Inner loop for comparisons' },
        { line: 5, description: 'Compare adjacent elements' },
        { line: 6, description: 'Swap if out of order' },
        { line: 12, description: 'Quick Sort function definition' },
        { line: 13, description: 'Call recursive function' },
        { line: 16, description: 'Recursive Quick Sort function' },
        { line: 17, description: 'Check if low < high' },
        { line: 18, description: 'Partition the array' },
        { line: 19, description: 'Sort left partition' },
        { line: 20, description: 'Sort right partition' },
        { line: 24, description: 'Partition function definition' },
        { line: 25, description: 'Choose pivot element' },
        { line: 26, description: 'Initialize partition index' },
        { line: 28, description: 'Loop through array' },
        { line: 29, description: 'Compare with pivot' },
        { line: 30, description: 'Increment partition index' },
        { line: 31, description: 'Swap elements' },
        { line: 35, description: 'Place pivot in correct position' },
        { line: 36, description: 'Return partition index' }
    ]);

    this.codeSync.registerCodeBlock('java', javaCodeBlock, [
        { line: 1, description: 'Bubble Sort method definition' },
        { line: 2, description: 'Get array length' },
        { line: 3, description: 'Outer loop for passes' },
        { line: 4, description: 'Inner loop for comparisons' },
        { line: 5, description: 'Compare adjacent elements' },
        { line: 6, description: 'Swap if out of order' },
        { line: 12, description: 'Quick Sort method definition' },
        { line: 13, description: 'Call recursive method' },
        { line: 16, description: 'Recursive Quick Sort method' },
        { line: 17, description: 'Check if low < high' },
        { line: 18, description: 'Partition the array' },
        { line: 19, description: 'Sort left partition' },
        { line: 20, description: 'Sort right partition' },
        { line: 24, description: 'Partition method definition' },
        { line: 25, description: 'Choose pivot element' },
        { line: 26, description: 'Initialize partition index' },
        { line: 28, description: 'Loop through array' },
        { line: 29, description: 'Compare with pivot' },
        { line: 30, description: 'Increment partition index' },
        { line: 31, description: 'Swap elements' },
        { line: 35, description: 'Place pivot in correct position' },
        { line: 36, description: 'Return partition index' }
    ]);
};

SortingVisualizer.prototype.setupCodeEventListeners = function() {
    // Listen for execution completion
    document.addEventListener('codeExecutionComplete', (event) => {
        this.onCodeExecutionComplete(event.detail);
    });
};

SortingVisualizer.prototype.onCodeExecutionComplete = function(detail) {
    const metrics = detail.metrics;
    document.getElementById('totalComparisons').textContent = metrics.comparisons;
    document.getElementById('totalSwaps').textContent = metrics.swaps;
    document.getElementById('totalOperations').textContent = metrics.operations;
    document.getElementById('totalDuration').textContent = Math.round(metrics.duration);
    
    // Update complexity analysis based on current algorithm
    this.updateComplexityAnalysis();
    
    this.showMessage('Code execution completed successfully!', 'success');
};

SortingVisualizer.prototype.updateComplexityAnalysis = function() {
    const complexities = {
        bubble: { time: 'O(n²)', space: 'O(1)' },
        selection: { time: 'O(n²)', space: 'O(1)' },
        insertion: { time: 'O(n²)', space: 'O(1)' },
        merge: { time: 'O(n log n)', space: 'O(n)' },
        quick: { time: 'O(n log n) avg, O(n²) worst', space: 'O(log n)' },
        heap: { time: 'O(n log n)', space: 'O(1)' }
    };
    
    const complexity = complexities[this.currentAlgorithm];
    document.getElementById('timeComplexity').textContent = complexity.time;
    document.getElementById('spaceComplexity').textContent = complexity.space;
};

SortingVisualizer.prototype.startSortingWithCodeSync = async function() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.startBtn.disabled = true;
    this.resetStats();
    this.startTime = performance.now();

    // Reset array to original state
    this.array = [...this.originalArray];
    this.renderArray();

    try {
        // Define execution steps for code synchronization
        const executionSteps = this.generateExecutionSteps();
        
        // Start code execution synchronization
        await this.codeSync.startExecution(`${this.currentAlgorithm}Sort`, executionSteps);
        
        // Execute the actual sorting algorithm
        switch (this.currentAlgorithm) {
            case 'bubble':
                await this.bubbleSort();
                break;
            case 'selection':
                await this.selectionSort();
                break;
            case 'insertion':
                await this.insertionSort();
                break;
            case 'merge':
                await this.mergeSort();
                break;
            case 'quick':
                await this.quickSort();
                break;
            case 'heap':
                await this.heapSort();
                break;
        }
    } finally {
        this.isRunning = false;
        this.startBtn.disabled = false;
        this.updateDuration();
    }
};

SortingVisualizer.prototype.generateExecutionSteps = function() {
    const steps = [];
    
    switch (this.currentAlgorithm) {
        case 'bubble':
            steps.push(
                {
                    id: 'bubble_start',
                    codeBlocks: { go: [1, 2], java: [1, 2] },
                    type: 'executing',
                    description: 'Starting Bubble Sort',
                    metrics: { operations: 1 }
                },
                {
                    id: 'bubble_outer_loop',
                    codeBlocks: { go: [3], java: [3] },
                    type: 'executing',
                    description: 'Outer loop for passes',
                    metrics: { operations: 1 }
                },
                {
                    id: 'bubble_inner_loop',
                    codeBlocks: { go: [4], java: [4] },
                    type: 'executing',
                    description: 'Inner loop for comparisons',
                    metrics: { operations: 1 }
                },
                {
                    id: 'bubble_compare',
                    codeBlocks: { go: [5], java: [5] },
                    type: 'comparing',
                    description: 'Compare adjacent elements',
                    metrics: { comparisons: 1 }
                },
                {
                    id: 'bubble_swap',
                    codeBlocks: { go: [6], java: [6] },
                    type: 'swapping',
                    description: 'Swap if out of order',
                    metrics: { swaps: 1 }
                }
            );
            break;
            
        case 'quick':
            steps.push(
                {
                    id: 'quick_start',
                    codeBlocks: { go: [12, 13], java: [12, 13] },
                    type: 'executing',
                    description: 'Starting Quick Sort',
                    metrics: { operations: 1 }
                },
                {
                    id: 'quick_recursive',
                    codeBlocks: { go: [16, 17], java: [16, 17] },
                    type: 'executing',
                    description: 'Recursive Quick Sort call',
                    metrics: { operations: 1 }
                },
                {
                    id: 'quick_partition',
                    codeBlocks: { go: [18], java: [18] },
                    type: 'executing',
                    description: 'Partition the array',
                    metrics: { operations: 1 }
                },
                {
                    id: 'quick_compare',
                    codeBlocks: { go: [29], java: [29] },
                    type: 'comparing',
                    description: 'Compare with pivot',
                    metrics: { comparisons: 1 }
                },
                {
                    id: 'quick_swap',
                    codeBlocks: { go: [31], java: [31] },
                    type: 'swapping',
                    description: 'Swap elements',
                    metrics: { swaps: 1 }
                }
            );
            break;
    }
    
    return steps;
};

SortingVisualizer.prototype.updateCodeBlocks = function(algorithm) {
    const goCodeBlock = document.getElementById('goCodeBlock');
    const javaCodeBlock = document.getElementById('javaCodeBlock');
    
    if (!goCodeBlock || !javaCodeBlock) return;
    
    // Clear existing code
    goCodeBlock.innerHTML = '';
    javaCodeBlock.innerHTML = '';
    
    let goCode, javaCode;
    
    switch (algorithm) {
        case 'bubble':
            goCode = `func BubbleSort(arr []int) {
    n := len(arr)
    for i := 0; i < n-1; i++ {
        for j := 0; j < n-i-1; j++ {
            if arr[j] > arr[j+1] {
                arr[j], arr[j+1] = arr[j+1], arr[j]
            }
        }
    }
}`;
            
            javaCode = `public static void bubbleSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
}`;
            break;
            
        case 'quick':
            goCode = `func QuickSort(arr []int) {
    quickSortRecursive(arr, 0, len(arr)-1)
}

func quickSortRecursive(arr []int, low, high int) {
    if low < high {
        pi := partition(arr, low, high)
        quickSortRecursive(arr, low, pi-1)
        quickSortRecursive(arr, pi+1, high)
    }
}

func partition(arr []int, low, high int) int {
    pivot := arr[high]
    i := low - 1
    
    for j := low; j < high; j++ {
        if arr[j] < pivot {
            i++
            arr[i], arr[j] = arr[j], arr[i]
        }
    }
    arr[i+1], arr[high] = arr[high], arr[i+1]
    return i + 1
}`;
            
            javaCode = `public static void quickSort(int[] arr) {
    quickSortRecursive(arr, 0, arr.length - 1);
}

private static void quickSortRecursive(int[] arr, int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSortRecursive(arr, low, pi - 1);
        quickSortRecursive(arr, pi + 1, high);
    }
}

private static int partition(int[] arr, int low, int high) {
    int pivot = arr[high];
    int i = (low - 1);
    
    for (int j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            int temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
    }
    int temp = arr[i + 1];
    arr[i + 1] = arr[high];
    arr[high] = temp;
    return i + 1;
}`;
            break;
            
        default:
            goCode = `// Select an algorithm to see its implementation`;
            javaCode = `// Select an algorithm to see its implementation`;
    }
    
    // Create new code blocks
    const newGoCodeBlock = this.codeSync.createCodeBlock(goCode, 'go');
    const newJavaCodeBlock = this.codeSync.createCodeBlock(javaCode, 'java');
    
    goCodeBlock.appendChild(newGoCodeBlock);
    javaCodeBlock.appendChild(newJavaCodeBlock);
    
    // Re-register code blocks
    this.codeSync.registerCodeBlock('go', newGoCodeBlock, this.getStepDefinitions(algorithm));
    this.codeSync.registerCodeBlock('java', newJavaCodeBlock, this.getStepDefinitions(algorithm));
};

SortingVisualizer.prototype.getStepDefinitions = function(algorithm) {
    const stepDefinitions = {
        bubble: [
            { line: 1, description: 'Bubble Sort function definition' },
            { line: 2, description: 'Get array length' },
            { line: 3, description: 'Outer loop for passes' },
            { line: 4, description: 'Inner loop for comparisons' },
            { line: 5, description: 'Compare adjacent elements' },
            { line: 6, description: 'Swap if out of order' }
        ],
        quick: [
            { line: 1, description: 'Quick Sort function definition' },
            { line: 2, description: 'Call recursive function' },
            { line: 5, description: 'Recursive Quick Sort function' },
            { line: 6, description: 'Check if low < high' },
            { line: 7, description: 'Partition the array' },
            { line: 8, description: 'Sort left partition' },
            { line: 9, description: 'Sort right partition' },
            { line: 13, description: 'Partition function definition' },
            { line: 14, description: 'Choose pivot element' },
            { line: 15, description: 'Initialize partition index' },
            { line: 17, description: 'Loop through array' },
            { line: 18, description: 'Compare with pivot' },
            { line: 19, description: 'Increment partition index' },
            { line: 20, description: 'Swap elements' },
            { line: 23, description: 'Place pivot in correct position' },
            { line: 24, description: 'Return partition index' }
        ]
    };
    
    return stepDefinitions[algorithm] || [];
};

SortingVisualizer.prototype.showMessage = function(message, type = 'info') {
    // Create a temporary message element
    const messageEl = document.createElement('div');
    messageEl.className = `message message-${type}`;
    messageEl.textContent = message;
    messageEl.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        z-index: 1000;
        opacity: 0;
        transition: opacity 0.3s ease;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#6366f1'};
    `;
    
    document.body.appendChild(messageEl);
    
    // Fade in
    setTimeout(() => {
        messageEl.style.opacity = '1';
    }, 100);
    
    // Fade out and remove
    setTimeout(() => {
        messageEl.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(messageEl);
        }, 300);
    }, 3000);
};

// Global functions for code execution controls
function startCodeExecution() {
    console.log('startCodeExecution called for sorting');
    if (window.sortingVisualizer) {
        console.log('Sorting visualizer found, calling startSortingWithCodeSync');
        window.sortingVisualizer.startSortingWithCodeSync();
    } else {
        console.log('Sorting visualizer not found');
    }
}

function pauseCodeExecution() {
    if (window.sortingVisualizer && window.sortingVisualizer.codeSync) {
        window.sortingVisualizer.codeSync.pauseExecution();
    }
}

function resumeCodeExecution() {
    if (window.sortingVisualizer && window.sortingVisualizer.codeSync) {
        window.sortingVisualizer.codeSync.resumeExecution();
    }
}

function stopCodeExecution() {
    if (window.sortingVisualizer && window.sortingVisualizer.codeSync) {
        window.sortingVisualizer.codeSync.stopExecution();
    }
}

function updateExecutionSpeed() {
    const speed = document.getElementById('executionSpeed').value;
    if (window.sortingVisualizer && window.sortingVisualizer.codeSync) {
        window.sortingVisualizer.codeSync.setExecutionSpeed(parseInt(speed));
    }
}
