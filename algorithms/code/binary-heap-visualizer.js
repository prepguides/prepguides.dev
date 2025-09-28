class BinaryHeapVisualizer {
    constructor() {
        this.heap = [];
        this.heapType = 'min'; // 'min' or 'max'
        this.animationSpeed = 800;
        this.operationCount = 0;
        this.isAnimating = false;
        
        this.initializeSVG();
        this.setupEventListeners();
        this.updateDisplay();
    }

    initializeSVG() {
        this.svg = d3.select('#heap-svg');
        this.width = 800;
        this.height = 500;
        
        this.svg.attr('width', this.width).attr('height', this.height);
        
        // Create groups for different elements
        this.edgesGroup = this.svg.append('g').attr('class', 'edges');
        this.nodesGroup = this.svg.append('g').attr('class', 'nodes');
    }

    setupEventListeners() {
        // Heap type selector
        document.querySelectorAll('.heap-type-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (this.isAnimating) return;
                
                document.querySelectorAll('.heap-type-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.heapType = e.target.dataset.type;
                this.updateDisplay();
            });
        });

        // Insert button
        document.getElementById('insert-btn').addEventListener('click', () => {
            const value = parseInt(document.getElementById('insert-value').value);
            if (value && !this.isAnimating) {
                this.insert(value);
                document.getElementById('insert-value').value = '';
            }
        });

        // Extract button
        document.getElementById('extract-btn').addEventListener('click', () => {
            if (this.heap.length > 0 && !this.isAnimating) {
                this.extractRoot();
            }
        });

        // Heapify button
        document.getElementById('heapify-btn').addEventListener('click', () => {
            if (!this.isAnimating) {
                this.heapifyArray();
            }
        });

        // Clear button
        document.getElementById('clear-btn').addEventListener('click', () => {
            if (!this.isAnimating) {
                this.clearHeap();
            }
        });

        // Speed control
        const speedSlider = document.getElementById('speed-slider');
        speedSlider.addEventListener('input', (e) => {
            this.animationSpeed = parseInt(e.target.value);
            document.getElementById('speed-value').textContent = e.target.value + 'ms';
        });

        // Enter key for insert
        document.getElementById('insert-value').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                document.getElementById('insert-btn').click();
            }
        });
    }

    async insert(value) {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        this.operationCount++;
        this.showOperationInfo('Insert', `Inserting ${value} into the heap`);
        this.updateCodeDisplay('insert', value);
        
        // Add to heap
        this.heap.push(value);
        await this.animateInsert(this.heap.length - 1);
        
        this.updateDisplay();
        this.updateStats();
        this.isAnimating = false;
    }

    async animateInsert(index) {
        if (index === 0) return; // Root node
        
        const parentIndex = Math.floor((index - 1) / 2);
        const shouldSwap = this.heapType === 'min' 
            ? this.heap[index] < this.heap[parentIndex]
            : this.heap[index] > this.heap[parentIndex];
        
        if (shouldSwap) {
            // Highlight nodes being compared
            await this.highlightNodes([index, parentIndex], 'comparing');
            await this.delay();
            
            // Swap
            await this.highlightNodes([index, parentIndex], 'swapping');
            [this.heap[index], this.heap[parentIndex]] = [this.heap[parentIndex], this.heap[index]];
            await this.delay();
            
            // Recursively heapify up
            await this.animateInsert(parentIndex);
        }
    }

    async extractRoot() {
        if (this.heap.length === 0 || this.isAnimating) return;
        
        this.isAnimating = true;
        this.operationCount++;
        const extractedValue = this.heap[0];
        this.showOperationInfo('Extract Root', `Extracting root value: ${extractedValue}`);
        this.updateCodeDisplay('extract');
        
        // Highlight root
        await this.highlightNodes([0], 'highlighted');
        await this.delay();
        
        // Move last element to root
        this.heap[0] = this.heap[this.heap.length - 1];
        this.heap.pop();
        
        if (this.heap.length > 0) {
            await this.animateHeapifyDown(0);
        }
        
        this.updateDisplay();
        this.updateStats();
        this.isAnimating = false;
    }

    async animateHeapifyDown(index) {
        const leftChild = 2 * index + 1;
        const rightChild = 2 * index + 2;
        let targetIndex = index;
        
        // Find the target child to swap with
        if (leftChild < this.heap.length) {
            const shouldSwapLeft = this.heapType === 'min'
                ? this.heap[leftChild] < this.heap[targetIndex]
                : this.heap[leftChild] > this.heap[targetIndex];
            
            if (shouldSwapLeft) {
                targetIndex = leftChild;
            }
        }
        
        if (rightChild < this.heap.length) {
            const shouldSwapRight = this.heapType === 'min'
                ? this.heap[rightChild] < this.heap[targetIndex]
                : this.heap[rightChild] > this.heap[targetIndex];
            
            if (shouldSwapRight) {
                targetIndex = rightChild;
            }
        }
        
        if (targetIndex !== index) {
            // Highlight nodes being compared
            const nodesToHighlight = [index];
            if (leftChild < this.heap.length) nodesToHighlight.push(leftChild);
            if (rightChild < this.heap.length) nodesToHighlight.push(rightChild);
            
            await this.highlightNodes(nodesToHighlight, 'comparing');
            await this.delay();
            
            // Swap
            await this.highlightNodes([index, targetIndex], 'swapping');
            [this.heap[index], this.heap[targetIndex]] = [this.heap[targetIndex], this.heap[index]];
            await this.delay();
            
            // Recursively heapify down
            await this.animateHeapifyDown(targetIndex);
        }
    }

    async heapifyArray() {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        this.operationCount++;
        this.showOperationInfo('Heapify Array', 'Converting array to heap structure');
        this.updateCodeDisplay('heapify');
        
        // Generate random array
        const arraySize = Math.floor(Math.random() * 8) + 5; // 5-12 elements
        this.heap = Array.from({length: arraySize}, () => Math.floor(Math.random() * 50) + 1);
        
        // Heapify from bottom up
        for (let i = Math.floor(this.heap.length / 2) - 1; i >= 0; i--) {
            await this.animateHeapifyDown(i);
        }
        
        this.updateDisplay();
        this.updateStats();
        this.isAnimating = false;
    }

    clearHeap() {
        this.heap = [];
        this.operationCount = 0;
        this.updateDisplay();
        this.updateStats();
        this.hideOperationInfo();
        this.updateCodeDisplay('clear');
    }

    async highlightNodes(indices, className) {
        const nodes = this.nodesGroup.selectAll('.node');
        indices.forEach(index => {
            if (index < nodes.size()) {
                d3.select(nodes.nodes()[index]).classed(className, true);
            }
        });
    }

    clearHighlights() {
        this.nodesGroup.selectAll('.node')
            .classed('highlighted comparing swapping', false);
    }

    delay() {
        return new Promise(resolve => setTimeout(resolve, this.animationSpeed));
    }

    updateDisplay() {
        this.clearHighlights();
        this.edgesGroup.selectAll('*').remove();
        this.nodesGroup.selectAll('*').remove();
        
        if (this.heap.length === 0) return;
        
        const nodeRadius = 25;
        const levelHeight = 80;
        const nodeSpacing = 60;
        
        // Calculate positions
        const positions = this.calculateNodePositions();
        
        // Draw edges
        this.drawEdges(positions, nodeRadius);
        
        // Draw nodes
        this.drawNodes(positions, nodeRadius);
    }

    calculateNodePositions() {
        const positions = [];
        const nodeSpacing = 60;
        const levelHeight = 80;
        
        for (let i = 0; i < this.heap.length; i++) {
            const level = Math.floor(Math.log2(i + 1));
            const nodesInLevel = Math.pow(2, level);
            const startX = this.width / 2 - (nodesInLevel - 1) * nodeSpacing / 2;
            const x = startX + (i - Math.pow(2, level) + 1) * nodeSpacing;
            const y = 50 + level * levelHeight;
            
            positions.push({x, y, level});
        }
        
        return positions;
    }

    drawEdges(positions, nodeRadius) {
        for (let i = 0; i < this.heap.length; i++) {
            const leftChild = 2 * i + 1;
            const rightChild = 2 * i + 2;
            
            if (leftChild < this.heap.length) {
                this.drawEdge(positions[i], positions[leftChild], nodeRadius);
            }
            if (rightChild < this.heap.length) {
                this.drawEdge(positions[i], positions[rightChild], nodeRadius);
            }
        }
    }

    drawEdge(from, to, nodeRadius) {
        const dx = to.x - from.x;
        const dy = to.y - from.y;
        const length = Math.sqrt(dx * dx + dy * dy);
        const unitX = dx / length;
        const unitY = dy / length;
        
        const startX = from.x + unitX * nodeRadius;
        const startY = from.y + unitY * nodeRadius;
        const endX = to.x - unitX * nodeRadius;
        const endY = to.y - unitY * nodeRadius;
        
        this.edgesGroup.append('line')
            .attr('x1', startX)
            .attr('y1', startY)
            .attr('x2', endX)
            .attr('y2', endY)
            .attr('class', 'edge');
    }

    drawNodes(positions, nodeRadius) {
        const nodes = this.nodesGroup.selectAll('.node')
            .data(this.heap)
            .enter()
            .append('g')
            .attr('class', 'node-group')
            .attr('transform', (d, i) => `translate(${positions[i].x}, ${positions[i].y})`);
        
        nodes.append('circle')
            .attr('class', 'node')
            .attr('r', nodeRadius);
        
        nodes.append('text')
            .attr('class', 'node-text')
            .text(d => d);
    }

    updateStats() {
        document.getElementById('heap-size').textContent = this.heap.length;
        document.getElementById('heap-height').textContent = this.heap.length > 0 ? Math.floor(Math.log2(this.heap.length)) + 1 : 0;
        document.getElementById('heap-root').textContent = this.heap.length > 0 ? this.heap[0] : '-';
        document.getElementById('operation-count').textContent = this.operationCount;
    }

    showOperationInfo(title, description) {
        document.getElementById('operation-title').textContent = title;
        document.getElementById('operation-description').textContent = description;
        document.getElementById('operation-info').style.display = 'block';
    }

    hideOperationInfo() {
        document.getElementById('operation-info').style.display = 'none';
    }

    updateCodeDisplay(operation, value = null) {
        const codeSnippets = {
            insert: `// Insert operation
function insert(heap, value) {
    heap.push(value);
    heapifyUp(heap, heap.length - 1);
}

function heapifyUp(heap, index) {
    if (index === 0) return;
    
    const parent = Math.floor((index - 1) / 2);
    if (heap[index] < heap[parent]) { // Min heap
        [heap[index], heap[parent]] = [heap[parent], heap[index]];
        heapifyUp(heap, parent);
    }
}`,
            extract: `// Extract root operation
function extractRoot(heap) {
    if (heap.length === 0) return null;
    
    const root = heap[0];
    heap[0] = heap[heap.length - 1];
    heap.pop();
    
    if (heap.length > 0) {
        heapifyDown(heap, 0);
    }
    
    return root;
}

function heapifyDown(heap, index) {
    const left = 2 * index + 1;
    const right = 2 * index + 2;
    let smallest = index;
    
    if (left < heap.length && heap[left] < heap[smallest]) {
        smallest = left;
    }
    if (right < heap.length && heap[right] < heap[smallest]) {
        smallest = right;
    }
    
    if (smallest !== index) {
        [heap[index], heap[smallest]] = [heap[smallest], heap[index]];
        heapifyDown(heap, smallest);
    }
}`,
            heapify: `// Heapify array operation
function heapifyArray(arr) {
    // Start from the last non-leaf node
    for (let i = Math.floor(arr.length / 2) - 1; i >= 0; i--) {
        heapifyDown(arr, i);
    }
}

function heapifyDown(heap, index) {
    const left = 2 * index + 1;
    const right = 2 * index + 2;
    let smallest = index;
    
    if (left < heap.length && heap[left] < heap[smallest]) {
        smallest = left;
    }
    if (right < heap.length && heap[right] < heap[smallest]) {
        smallest = right;
    }
    
    if (smallest !== index) {
        [heap[index], heap[smallest]] = [heap[smallest], heap[index]];
        heapifyDown(heap, smallest);
    }
}`,
            clear: `// Clear heap operation
function clearHeap(heap) {
    heap.length = 0;
    // Heap is now empty
}`
        };
        
        document.getElementById('code-display').textContent = codeSnippets[operation] || '// Select an operation to see the code';
    }
}

// Initialize the visualizer when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.binaryHeapVisualizer = new BinaryHeapVisualizer();
});
