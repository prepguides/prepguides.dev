/**
 * Code Execution Synchronization Framework
 * Provides side-by-side code highlighting during algorithm execution
 */

class CodeExecutionSync {
    constructor() {
        this.currentStep = 0;
        this.totalSteps = 0;
        this.isExecuting = false;
        this.executionSpeed = 1000; // milliseconds
        this.codeBlocks = new Map();
        this.stepCallbacks = new Map();
        this.performanceMetrics = {
            startTime: 0,
            endTime: 0,
            comparisons: 0,
            swaps: 0,
            operations: 0
        };
    }

    /**
     * Register a code block for synchronization
     * @param {string} id - Unique identifier for the code block
     * @param {HTMLElement} element - The code element to highlight
     * @param {Array} steps - Array of step objects with line numbers and descriptions
     */
    registerCodeBlock(id, element, steps) {
        this.codeBlocks.set(id, {
            element: element,
            steps: steps,
            currentHighlight: null
        });
    }

    /**
     * Register a callback for execution steps
     * @param {string} stepId - Unique identifier for the step
     * @param {Function} callback - Function to execute during this step
     */
    registerStepCallback(stepId, callback) {
        this.stepCallbacks.set(stepId, callback);
    }

    /**
     * Start code execution synchronization
     * @param {string} algorithmId - The algorithm being executed
     * @param {Array} executionSteps - Array of execution steps
     */
    async startExecution(algorithmId, executionSteps) {
        if (this.isExecuting) {
            console.warn('Execution already in progress');
            return;
        }

        this.isExecuting = true;
        this.currentStep = 0;
        this.totalSteps = executionSteps.length;
        this.performanceMetrics.startTime = performance.now();
        this.performanceMetrics.comparisons = 0;
        this.performanceMetrics.swaps = 0;
        this.performanceMetrics.operations = 0;

        console.log(`Starting ${algorithmId} execution with ${this.totalSteps} steps`);

        try {
            for (let i = 0; i < executionSteps.length; i++) {
                this.currentStep = i;
                const step = executionSteps[i];
                
                // Highlight code blocks
                await this.highlightStep(step);
                
                // Execute step callback if registered
                if (this.stepCallbacks.has(step.id)) {
                    await this.stepCallbacks.get(step.id)(step);
                }
                
                // Update performance metrics
                this.updatePerformanceMetrics(step);
                
                // Wait for specified duration
                await this.delay(this.executionSpeed);
            }
        } catch (error) {
            console.error('Execution error:', error);
        } finally {
            this.isExecuting = false;
            this.performanceMetrics.endTime = performance.now();
            this.clearAllHighlights();
            this.onExecutionComplete();
        }
    }

    /**
     * Highlight the current step in all registered code blocks
     * @param {Object} step - The current execution step
     */
    async highlightStep(step) {
        for (const [id, codeBlock] of this.codeBlocks) {
            if (step.codeBlocks && step.codeBlocks[id]) {
                const lineNumbers = step.codeBlocks[id];
                this.highlightLines(id, lineNumbers, step.type || 'default');
            }
        }
    }

    /**
     * Highlight specific lines in a code block
     * @param {string} codeBlockId - The code block identifier
     * @param {Array} lineNumbers - Array of line numbers to highlight
     * @param {string} type - Type of highlight (executing, comparing, swapping, etc.)
     */
    highlightLines(codeBlockId, lineNumbers, type = 'default') {
        const codeBlock = this.codeBlocks.get(codeBlockId);
        if (!codeBlock) return;

        // Clear previous highlights
        this.clearHighlight(codeBlockId);

        // Add new highlights
        const element = codeBlock.element;
        const lines = element.querySelectorAll('.line');
        
        lineNumbers.forEach(lineNum => {
            if (lines[lineNum - 1]) {
                const line = lines[lineNum - 1];
                line.classList.add('highlighted', `highlight-${type}`);
                codeBlock.currentHighlight = lineNum;
            }
        });

        // Scroll to highlighted line
        if (lineNumbers.length > 0) {
            const firstLine = lines[lineNumbers[0] - 1];
            if (firstLine) {
                firstLine.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }

    /**
     * Clear highlights from a specific code block
     * @param {string} codeBlockId - The code block identifier
     */
    clearHighlight(codeBlockId) {
        const codeBlock = this.codeBlocks.get(codeBlockId);
        if (!codeBlock) return;

        const element = codeBlock.element;
        const highlightedLines = element.querySelectorAll('.highlighted');
        highlightedLines.forEach(line => {
            line.classList.remove('highlighted', 'highlight-executing', 'highlight-comparing', 
                                 'highlight-swapping', 'highlight-inserting', 'highlight-deleting');
        });
        codeBlock.currentHighlight = null;
    }

    /**
     * Clear all highlights from all code blocks
     */
    clearAllHighlights() {
        for (const [id] of this.codeBlocks) {
            this.clearHighlight(id);
        }
    }

    /**
     * Update performance metrics based on current step
     * @param {Object} step - The current execution step
     */
    updatePerformanceMetrics(step) {
        if (step.metrics) {
            this.performanceMetrics.comparisons += step.metrics.comparisons || 0;
            this.performanceMetrics.swaps += step.metrics.swaps || 0;
            this.performanceMetrics.operations += step.metrics.operations || 0;
        }
    }

    /**
     * Get current performance metrics
     * @returns {Object} Current performance metrics
     */
    getPerformanceMetrics() {
        const duration = this.performanceMetrics.endTime - this.performanceMetrics.startTime;
        return {
            ...this.performanceMetrics,
            duration: duration,
            stepsPerSecond: this.totalSteps / (duration / 1000)
        };
    }

    /**
     * Set execution speed
     * @param {number} speed - Speed in milliseconds per step
     */
    setExecutionSpeed(speed) {
        this.executionSpeed = Math.max(100, speed); // Minimum 100ms
    }

    /**
     * Pause execution
     */
    pauseExecution() {
        this.isExecuting = false;
    }

    /**
     * Resume execution
     */
    resumeExecution() {
        this.isExecuting = true;
    }

    /**
     * Stop execution
     */
    stopExecution() {
        this.isExecuting = false;
        this.clearAllHighlights();
    }

    /**
     * Get execution progress
     * @returns {Object} Progress information
     */
    getProgress() {
        return {
            currentStep: this.currentStep,
            totalSteps: this.totalSteps,
            progress: this.totalSteps > 0 ? (this.currentStep / this.totalSteps) * 100 : 0,
            isExecuting: this.isExecuting
        };
    }

    /**
     * Delay execution for specified time
     * @param {number} ms - Milliseconds to delay
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Callback when execution completes
     */
    onExecutionComplete() {
        const metrics = this.getPerformanceMetrics();
        console.log('Execution completed:', metrics);
        
        // Dispatch custom event
        const event = new CustomEvent('codeExecutionComplete', {
            detail: {
                metrics: metrics,
                progress: this.getProgress()
            }
        });
        document.dispatchEvent(event);
    }

    /**
     * Create a code block element with syntax highlighting
     * @param {string} code - The code content
     * @param {string} language - Programming language
     * @returns {HTMLElement} Formatted code element
     */
    createCodeBlock(code, language = 'javascript') {
        const codeElement = document.createElement('div');
        codeElement.className = 'code-block';
        codeElement.setAttribute('data-language', language);

        const lines = code.split('\n');
        lines.forEach((line, index) => {
            const lineElement = document.createElement('div');
            lineElement.className = 'line';
            lineElement.setAttribute('data-line', index + 1);
            lineElement.innerHTML = `<span class="line-number">${index + 1}</span><span class="line-content">${this.escapeHtml(line)}</span>`;
            codeElement.appendChild(lineElement);
        });

        return codeElement;
    }

    /**
     * Escape HTML characters
     * @param {string} text - Text to escape
     * @returns {string} Escaped text
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Generate complexity analysis
     * @param {string} algorithm - Algorithm name
     * @param {Object} metrics - Performance metrics
     * @returns {Object} Complexity analysis
     */
    generateComplexityAnalysis(algorithm, metrics) {
        const analysis = {
            algorithm: algorithm,
            timeComplexity: this.getTimeComplexity(algorithm, metrics),
            spaceComplexity: this.getSpaceComplexity(algorithm, metrics),
            actualPerformance: {
                duration: metrics.duration,
                comparisons: metrics.comparisons,
                swaps: metrics.swaps,
                operations: metrics.operations
            }
        };

        return analysis;
    }

    /**
     * Get theoretical time complexity
     * @param {string} algorithm - Algorithm name
     * @param {Object} metrics - Performance metrics
     * @returns {string} Time complexity notation
     */
    getTimeComplexity(algorithm, metrics) {
        const complexityMap = {
            'bubbleSort': 'O(n²)',
            'selectionSort': 'O(n²)',
            'insertionSort': 'O(n²)',
            'mergeSort': 'O(n log n)',
            'quickSort': 'O(n log n) average, O(n²) worst',
            'heapSort': 'O(n log n)',
            'binarySearch': 'O(log n)',
            'linearSearch': 'O(n)',
            'bstInsert': 'O(log n) average, O(n) worst',
            'bstDelete': 'O(log n) average, O(n) worst',
            'bstSearch': 'O(log n) average, O(n) worst'
        };

        return complexityMap[algorithm] || 'O(?)';
    }

    /**
     * Get theoretical space complexity
     * @param {string} algorithm - Algorithm name
     * @param {Object} metrics - Performance metrics
     * @returns {string} Space complexity notation
     */
    getSpaceComplexity(algorithm, metrics) {
        const complexityMap = {
            'bubbleSort': 'O(1)',
            'selectionSort': 'O(1)',
            'insertionSort': 'O(1)',
            'mergeSort': 'O(n)',
            'quickSort': 'O(log n) average, O(n) worst',
            'heapSort': 'O(1)',
            'binarySearch': 'O(1) iterative, O(log n) recursive',
            'linearSearch': 'O(1)',
            'bstInsert': 'O(log n) average, O(n) worst',
            'bstDelete': 'O(log n) average, O(n) worst',
            'bstSearch': 'O(log n) average, O(n) worst'
        };

        return complexityMap[algorithm] || 'O(?)';
    }
}

// Export for use in other modules
window.CodeExecutionSync = CodeExecutionSync;
