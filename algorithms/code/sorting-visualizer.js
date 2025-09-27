class SortingVisualizer {
    constructor() {
        this.array = [];
        this.originalArray = [];
        this.currentAlgorithm = 'bubble';
        this.isRunning = false;
        this.comparisons = 0;
        this.swaps = 0;
        this.startTime = 0;
        this.speed = 5;
        
        // D3.js setup
        this.svg = d3.select('#arraySvg');
        this.width = 800;
        this.height = 400;
        this.margin = { top: 20, right: 20, bottom: 40, left: 20 };
        
        this.initializeElements();
        this.setupEventListeners();
        this.generateArray();

        // Code execution synchronization (after DOM elements are ready)
        this.codeSync = new CodeExecutionSync();
        this.initializeCodeBlocks();
        this.setupCodeEventListeners();
    }

    initializeElements() {
        this.arraySizeInput = document.getElementById('arraySize');
        this.arraySizeValue = document.getElementById('arraySizeValue');
        this.speedInput = document.getElementById('speed');
        this.speedValue = document.getElementById('speedValue');
        this.generateBtn = document.getElementById('generate');
        this.startBtn = document.getElementById('start');
        this.resetBtn = document.getElementById('reset');
        this.comparisonsEl = document.getElementById('comparisons');
        this.swapsEl = document.getElementById('swaps');
        this.timeEl = document.getElementById('time');
        this.algorithmInfo = document.getElementById('algorithmInfo');
    }

    setupEventListeners() {
        // Algorithm buttons
        document.querySelectorAll('.algorithm-btn').forEach(btn => {
            btn.addEventListener('click', () => this.selectAlgorithm(btn.dataset.algorithm));
        });

        // Controls
        this.arraySizeInput.addEventListener('input', (e) => {
            this.arraySizeValue.textContent = e.target.value;
            this.generateArray();
        });

        this.speedInput.addEventListener('input', (e) => {
            this.speedValue.textContent = e.target.value;
            this.speed = parseInt(e.target.value);
        });

        this.generateBtn.addEventListener('click', () => this.generateArray());
        this.startBtn.addEventListener('click', () => this.startSorting());
        this.resetBtn.addEventListener('click', () => this.reset());
    }

    selectAlgorithm(algorithm) {
        this.currentAlgorithm = algorithm;
        
        // Update button states
        document.querySelectorAll('.algorithm-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-algorithm="${algorithm}"]`).classList.add('active');
        
        // Update algorithm info
        this.updateAlgorithmInfo(algorithm);
        
        // Update code blocks based on algorithm
        this.updateCodeBlocks(algorithm);
    }

    updateAlgorithmInfo(algorithm) {
        const info = {
            bubble: {
                name: 'Bubble Sort',
                description: 'Bubble Sort repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order. Time Complexity: O(n²), Space Complexity: O(1)'
            },
            selection: {
                name: 'Selection Sort',
                description: 'Selection Sort finds the minimum element and swaps it with the first element, then repeats for the remaining elements. Time Complexity: O(n²), Space Complexity: O(1)'
            },
            insertion: {
                name: 'Insertion Sort',
                description: 'Insertion Sort builds the final sorted array one item at a time by inserting each element into its correct position. Time Complexity: O(n²), Space Complexity: O(1)'
            },
            merge: {
                name: 'Merge Sort',
                description: 'Merge Sort divides the array into two halves, sorts them recursively, and then merges the sorted halves. Time Complexity: O(n log n), Space Complexity: O(n)'
            },
            quick: {
                name: 'Quick Sort',
                description: 'Quick Sort picks a pivot element and partitions the array around the pivot, then recursively sorts the sub-arrays. Time Complexity: O(n log n) average, O(n²) worst case, Space Complexity: O(log n)'
            },
            heap: {
                name: 'Heap Sort',
                description: 'Heap Sort builds a max heap and repeatedly extracts the maximum element to build the sorted array. Time Complexity: O(n log n), Space Complexity: O(1)'
            }
        };

        const algorithmInfo = info[algorithm];
        this.algorithmInfo.innerHTML = `
            <h4>${algorithmInfo.name}</h4>
            <p>${algorithmInfo.description}</p>
        `;
    }

    generateArray() {
        const size = parseInt(this.arraySizeInput.value);
        this.array = [];
        
        for (let i = 0; i < size; i++) {
            this.array.push(Math.floor(Math.random() * 100) + 1);
        }
        
        this.originalArray = [...this.array];
        this.renderArray();
        this.resetStats();
    }

    renderArray() {
        const data = this.array.map((value, index) => ({ value, index }));
        const barWidth = (this.width - this.margin.left - this.margin.right) / this.array.length;
        const maxValue = Math.max(...this.array);
        
        // Clear previous content
        this.svg.selectAll('*').remove();
        
        // Create bars
        const bars = this.svg.selectAll('.bar')
            .data(data)
            .join('rect')
            .attr('class', 'bar')
            .attr('x', (d, i) => this.margin.left + i * barWidth)
            .attr('y', d => this.height - this.margin.bottom - (d.value / maxValue) * (this.height - this.margin.top - this.margin.bottom))
            .attr('width', barWidth - 2)
            .attr('height', d => (d.value / maxValue) * (this.height - this.margin.top - this.margin.bottom));

        // Create labels
        const labels = this.svg.selectAll('.bar-label')
            .data(data)
            .join('text')
            .attr('class', 'bar-label')
            .attr('x', (d, i) => this.margin.left + i * barWidth + barWidth / 2)
            .attr('y', d => this.height - this.margin.bottom - (d.value / maxValue) * (this.height - this.margin.top - this.margin.bottom) - 5)
            .text(d => d.value);
    }

    async startSorting() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.startBtn.disabled = true;
        this.resetStats();
        this.startTime = performance.now();

        // Reset array to original state
        this.array = [...this.originalArray];
        this.renderArray();
        
        try {
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
    }

    delay() {
        const delayTime = Math.max(50, 500 - (this.speed * 50));
        return new Promise(resolve => setTimeout(resolve, delayTime));
    }

    highlightBars(indices, state) {
        this.svg.selectAll('.bar')
            .filter((d, i) => indices.includes(i))
            .classed('comparing', state === 'comparing')
            .classed('swapping', state === 'swapping')
            .classed('pivot', state === 'pivot');
    }

    reset() {
        this.array = [...this.originalArray];
        this.renderArray();
        this.resetStats();
    }

    resetStats() {
        this.comparisons = 0;
        this.swaps = 0;
        this.startTime = 0;
        this.updateStats();
    }

    updateStats() {
        this.comparisonsEl.textContent = this.comparisons;
        this.swapsEl.textContent = this.swaps;
    }

    updateDuration() {
        const duration = Math.round(performance.now() - this.startTime);
        this.timeEl.textContent = `${duration}ms`;
    }

    async bubbleSort() {
        const n = this.array.length;
        for (let i = 0; i < n - 1; i++) {
            for (let j = 0; j < n - i - 1; j++) {
                this.comparisons++;
                this.updateStats();
                
                // Highlight comparing elements
                this.highlightBars([j, j + 1], 'comparing');
                await this.delay();
                
                if (this.array[j] > this.array[j + 1]) {
                    // Swap elements
                    [this.array[j], this.array[j + 1]] = [this.array[j + 1], this.array[j]];
                    this.swaps++;
                    this.updateStats();
                    
                    this.highlightBars([j, j + 1], 'swapping');
                    await this.delay();
                }
                
                this.renderArray();
            }
        }
    }

    async selectionSort() {
        const n = this.array.length;
        for (let i = 0; i < n - 1; i++) {
            let minIdx = i;
            
            for (let j = i + 1; j < n; j++) {
                this.comparisons++;
                this.updateStats();
                
                this.highlightBars([minIdx, j], 'comparing');
                await this.delay();
                
                if (this.array[j] < this.array[minIdx]) {
                    minIdx = j;
                }
            }
            
            if (minIdx !== i) {
                [this.array[i], this.array[minIdx]] = [this.array[minIdx], this.array[i]];
                this.swaps++;
                this.updateStats();
                
                this.highlightBars([i, minIdx], 'swapping');
                await this.delay();
            }
            
            this.renderArray();
        }
    }

    async insertionSort() {
        const n = this.array.length;
        for (let i = 1; i < n; i++) {
            let key = this.array[i];
            let j = i - 1;
            
            while (j >= 0 && this.array[j] > key) {
                this.comparisons++;
                this.updateStats();
                
                this.highlightBars([j, j + 1], 'comparing');
                await this.delay();
                
                this.array[j + 1] = this.array[j];
                this.swaps++;
                this.updateStats();
                
                this.highlightBars([j, j + 1], 'swapping');
                await this.delay();
                
                j--;
            }
            
            this.array[j + 1] = key;
            this.renderArray();
        }
    }

    async mergeSort() {
        await this.mergeSortHelper(0, this.array.length - 1);
    }

    async mergeSortHelper(left, right) {
        if (left < right) {
            const mid = Math.floor((left + right) / 2);
            
            await this.mergeSortHelper(left, mid);
            await this.mergeSortHelper(mid + 1, right);
            await this.merge(left, mid, right);
        }
    }

    async merge(left, mid, right) {
        const leftArr = this.array.slice(left, mid + 1);
        const rightArr = this.array.slice(mid + 1, right + 1);
        
        let i = 0, j = 0, k = left;
        
        while (i < leftArr.length && j < rightArr.length) {
            this.comparisons++;
            this.updateStats();
            
            this.highlightBars([k], 'comparing');
            await this.delay();
            
            if (leftArr[i] <= rightArr[j]) {
                this.array[k] = leftArr[i];
                i++;
            } else {
                this.array[k] = rightArr[j];
                j++;
            }
            
            this.swaps++;
            this.updateStats();
            this.renderArray();
            k++;
        }
        
        while (i < leftArr.length) {
            this.array[k] = leftArr[i];
            i++;
            k++;
            this.renderArray();
        }
        
        while (j < rightArr.length) {
            this.array[k] = rightArr[j];
            j++;
            k++;
            this.renderArray();
        }
    }

    async quickSort() {
        await this.quickSortHelper(0, this.array.length - 1);
    }

    async quickSortHelper(low, high) {
        if (low < high) {
            const pivotIndex = await this.partition(low, high);
            await this.quickSortHelper(low, pivotIndex - 1);
            await this.quickSortHelper(pivotIndex + 1, high);
        }
    }

    async partition(low, high) {
        const pivot = this.array[high];
        let i = low - 1;
        
        this.highlightBars([high], 'pivot');
        await this.delay();
        
        for (let j = low; j < high; j++) {
            this.comparisons++;
            this.updateStats();
            
            this.highlightBars([j, high], 'comparing');
            await this.delay();
            
            if (this.array[j] < pivot) {
                i++;
                [this.array[i], this.array[j]] = [this.array[j], this.array[i]];
                this.swaps++;
                this.updateStats();
                
                this.highlightBars([i, j], 'swapping');
                await this.delay();
            }
        }
        
        [this.array[i + 1], this.array[high]] = [this.array[high], this.array[i + 1]];
        this.swaps++;
        this.updateStats();
        
        this.highlightBars([i + 1, high], 'swapping');
        await this.delay();
        this.renderArray();
        
        return i + 1;
    }

    async heapSort() {
        const n = this.array.length;
        
        // Build max heap
        for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
            await this.heapify(n, i);
        }
        
        // Extract elements from heap one by one
        for (let i = n - 1; i > 0; i--) {
            [this.array[0], this.array[i]] = [this.array[i], this.array[0]];
            this.swaps++;
            this.updateStats();
            
            this.highlightBars([0, i], 'swapping');
            await this.delay();
            this.renderArray();
            
            await this.heapify(i, 0);
        }
    }

    async heapify(n, i) {
        let largest = i;
        const left = 2 * i + 1;
        const right = 2 * i + 2;
        
        if (left < n) {
            this.comparisons++;
            this.updateStats();
            
            this.highlightBars([largest, left], 'comparing');
            await this.delay();
            
            if (this.array[left] > this.array[largest]) {
                largest = left;
            }
        }
        
        if (right < n) {
            this.comparisons++;
            this.updateStats();
            
            this.highlightBars([largest, right], 'comparing');
            await this.delay();
            
            if (this.array[right] > this.array[largest]) {
                largest = right;
            }
        }
        
        if (largest !== i) {
            [this.array[i], this.array[largest]] = [this.array[largest], this.array[i]];
            this.swaps++;
            this.updateStats();
            
            this.highlightBars([i, largest], 'swapping');
            await this.delay();
            this.renderArray();
            
            await this.heapify(n, largest);
        }
    }
}
