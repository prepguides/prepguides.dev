class SegmentTreeVisualizer {
    constructor() {
        this.array = [];
        this.segmentTree = [];
        this.operationType = 'sum'; // 'sum', 'min', 'max'
        this.animationSpeed = 800;
        this.operationCount = 0;
        this.isAnimating = false;
        this.treeBuilt = false;
        
        this.initializeSVG();
        this.setupEventListeners();
        this.generateRandomArray(8);
    }

    initializeSVG() {
        this.svg = d3.select('#tree-svg');
        
        // Get container dimensions
        const container = document.querySelector('.tree-container');
        const containerRect = container.getBoundingClientRect();
        
        this.width = Math.max(800, containerRect.width - 40); // Account for padding
        this.height = Math.max(500, containerRect.height - 40);
        
        this.svg.attr('width', this.width).attr('height', this.height);
        
        // Create groups for different elements
        this.edgesGroup = this.svg.append('g').attr('class', 'edges');
        this.nodesGroup = this.svg.append('g').attr('class', 'nodes');
        
        // Handle window resize
        window.addEventListener('resize', () => {
            this.resizeSVG();
        });
    }

    resizeSVG() {
        const container = document.querySelector('.tree-container');
        const containerRect = container.getBoundingClientRect();
        
        this.width = Math.max(800, containerRect.width - 40);
        this.height = Math.max(500, containerRect.height - 40);
        
        this.svg.attr('width', this.width).attr('height', this.height);
        
        if (this.treeBuilt) {
            this.updateDisplay();
        }
    }

    setupEventListeners() {
        // Operation type selector
        document.querySelectorAll('.operation-type-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (this.isAnimating) return;
                
                document.querySelectorAll('.operation-type-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.operationType = e.target.dataset.type;
                if (this.treeBuilt) {
                    this.rebuildTree();
                }
            });
        });

        // Generate array button
        document.getElementById('generate-array-btn').addEventListener('click', () => {
            if (this.isAnimating) return;
            const size = parseInt(document.getElementById('array-size').value);
            if (size >= 4 && size <= 16) {
                this.generateRandomArray(size);
            }
        });

        // Build tree button
        document.getElementById('build-tree-btn').addEventListener('click', () => {
            if (this.isAnimating) return;
            this.buildSegmentTree();
        });

        // Range query button
        document.getElementById('range-query-btn').addEventListener('click', () => {
            if (this.isAnimating || !this.treeBuilt) return;
            const left = parseInt(document.getElementById('query-left').value);
            const right = parseInt(document.getElementById('query-right').value);
            if (left >= 0 && right < this.array.length && left <= right) {
                this.rangeQuery(left, right);
            }
        });

        // Update button
        document.getElementById('update-btn').addEventListener('click', () => {
            if (this.isAnimating || !this.treeBuilt) return;
            const index = parseInt(document.getElementById('update-index').value);
            const value = parseInt(document.getElementById('update-value').value);
            if (index >= 0 && index < this.array.length) {
                this.updateValue(index, value);
            }
        });

        // Speed control
        const speedSlider = document.getElementById('speed-slider');
        speedSlider.addEventListener('input', (e) => {
            this.animationSpeed = parseInt(e.target.value);
            document.getElementById('speed-value').textContent = e.target.value + 'ms';
        });

        // Enter key handlers
        document.getElementById('array-size').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                document.getElementById('generate-array-btn').click();
            }
        });
    }

    generateRandomArray(size) {
        this.array = Array.from({length: size}, () => Math.floor(Math.random() * 20) + 1);
        this.treeBuilt = false;
        this.updateArrayDisplay();
        this.updateStats();
        this.clearTree();
    }

    updateArrayDisplay() {
        const container = document.getElementById('array-elements');
        container.innerHTML = '';
        
        this.array.forEach((value, index) => {
            const element = document.createElement('div');
            element.className = 'array-element';
            element.textContent = value;
            element.dataset.index = index;
            container.appendChild(element);
        });
    }

    highlightArrayElements(indices, className = 'highlighted') {
        document.querySelectorAll('.array-element').forEach((el, index) => {
            el.classList.remove('highlighted');
            if (indices.includes(index)) {
                el.classList.add(className);
            }
        });
    }

    async buildSegmentTree() {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        this.operationCount++;
        this.showOperationInfo('Build Segment Tree', 'Constructing segment tree from array');
        this.updateCodeDisplay('build');
        
        const n = this.array.length;
        const treeSize = 4 * n; // Standard size for segment tree
        this.segmentTree = new Array(treeSize).fill(0);
        
        await this.buildTreeRecursive(0, 0, n - 1);
        
        this.treeBuilt = true;
        this.updateDisplay();
        this.updateStats();
        this.isAnimating = false;
    }

    async buildTreeRecursive(node, start, end) {
        if (start === end) {
            this.segmentTree[node] = this.array[start];
            await this.delay();
            return;
        }
        
        const mid = Math.floor((start + end) / 2);
        const leftChild = 2 * node + 1;
        const rightChild = 2 * node + 2;
        
        await this.buildTreeRecursive(leftChild, start, mid);
        await this.buildTreeRecursive(rightChild, mid + 1, end);
        
        // Combine based on operation type
        if (this.operationType === 'sum') {
            this.segmentTree[node] = this.segmentTree[leftChild] + this.segmentTree[rightChild];
        } else if (this.operationType === 'min') {
            this.segmentTree[node] = Math.min(this.segmentTree[leftChild], this.segmentTree[rightChild]);
        } else if (this.operationType === 'max') {
            this.segmentTree[node] = Math.max(this.segmentTree[leftChild], this.segmentTree[rightChild]);
        }
        
        await this.delay();
    }

    async rangeQuery(left, right) {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        this.operationCount++;
        this.showOperationInfo('Range Query', `Querying range [${left}, ${right}] for ${this.operationType}`);
        this.updateCodeDisplay('query');
        
        this.highlightArrayElements([left, right], 'highlighted');
        
        const result = await this.queryRecursive(0, 0, this.array.length - 1, left, right);
        
        this.showOperationInfo('Range Query Result', `Result: ${result}`);
        this.updateDisplay();
        this.isAnimating = false;
    }

    async queryRecursive(node, start, end, left, right) {
        // No overlap
        if (end < left || start > right) {
            return this.operationType === 'sum' ? 0 : (this.operationType === 'min' ? Infinity : -Infinity);
        }
        
        // Complete overlap
        if (left <= start && end <= right) {
            await this.delay();
            return this.segmentTree[node];
        }
        
        // Partial overlap
        const mid = Math.floor((start + end) / 2);
        const leftChild = 2 * node + 1;
        const rightChild = 2 * node + 2;
        
        const leftResult = await this.queryRecursive(leftChild, start, mid, left, right);
        const rightResult = await this.queryRecursive(rightChild, mid + 1, end, left, right);
        
        let result;
        if (this.operationType === 'sum') {
            result = leftResult + rightResult;
        } else if (this.operationType === 'min') {
            result = Math.min(leftResult, rightResult);
        } else if (this.operationType === 'max') {
            result = Math.max(leftResult, rightResult);
        }
        
        await this.delay();
        return result;
    }

    async updateValue(index, value) {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        this.operationCount++;
        this.showOperationInfo('Update Value', `Updating index ${index} to value ${value}`);
        this.updateCodeDisplay('update');
        
        this.highlightArrayElements([index], 'highlighted');
        
        this.array[index] = value;
        await this.updateRecursive(0, 0, this.array.length - 1, index, value);
        
        this.updateArrayDisplay();
        this.updateDisplay();
        this.updateStats();
        this.isAnimating = false;
    }

    async updateRecursive(node, start, end, index, value) {
        if (start === end) {
            this.segmentTree[node] = value;
            await this.delay();
            return;
        }
        
        const mid = Math.floor((start + end) / 2);
        const leftChild = 2 * node + 1;
        const rightChild = 2 * node + 2;
        
        if (index <= mid) {
            await this.updateRecursive(leftChild, start, mid, index, value);
        } else {
            await this.updateRecursive(rightChild, mid + 1, end, index, value);
        }
        
        // Update current node
        if (this.operationType === 'sum') {
            this.segmentTree[node] = this.segmentTree[leftChild] + this.segmentTree[rightChild];
        } else if (this.operationType === 'min') {
            this.segmentTree[node] = Math.min(this.segmentTree[leftChild], this.segmentTree[rightChild]);
        } else if (this.operationType === 'max') {
            this.segmentTree[node] = Math.max(this.segmentTree[leftChild], this.segmentTree[rightChild]);
        }
        
        await this.delay();
    }

    rebuildTree() {
        this.treeBuilt = false;
        this.buildSegmentTree();
    }

    clearTree() {
        this.edgesGroup.selectAll('*').remove();
        this.nodesGroup.selectAll('*').remove();
        this.hideOperationInfo();
        this.updateCodeDisplay('clear');
        this.showDefaultMessage();
    }

    showDefaultMessage() {
        // Add a default message when no tree is built
        this.nodesGroup.append('text')
            .attr('x', this.width / 2)
            .attr('y', this.height / 2)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'middle')
            .attr('class', 'default-message')
            .style('font-size', '18px')
            .style('fill', '#6b7280')
            .style('font-weight', '500')
            .text('Click "Build Segment Tree" to visualize the tree structure');
    }

    updateDisplay() {
        if (!this.treeBuilt) return;
        
        this.edgesGroup.selectAll('*').remove();
        this.nodesGroup.selectAll('*').remove();
        
        const nodeRadius = 20;
        const levelHeight = 60;
        const nodeSpacing = 80;
        
        // Calculate positions for tree nodes
        const positions = this.calculateTreePositions();
        
        // Draw edges
        this.drawTreeEdges(positions, nodeRadius);
        
        // Draw nodes
        this.drawTreeNodes(positions, nodeRadius);
    }

    calculateTreePositions() {
        const positions = [];
        const nodeSpacing = 100;
        const levelHeight = 80;
        
        // Calculate tree structure
        const treeLevels = this.calculateTreeLevels();
        
        // Calculate the maximum width needed for the tree
        const maxLevelWidth = Math.max(...treeLevels.map(level => level.length));
        const totalWidth = (maxLevelWidth - 1) * nodeSpacing;
        const startX = (this.width - totalWidth) / 2;
        
        treeLevels.forEach((level, levelIndex) => {
            const levelStartX = startX + (maxLevelWidth - level.length) * nodeSpacing / 2;
            
            level.forEach((nodeIndex, nodeInLevel) => {
                const x = levelStartX + nodeInLevel * nodeSpacing;
                const y = 80 + levelIndex * levelHeight;
                
                positions[nodeIndex] = {x, y, level: levelIndex};
            });
        });
        
        return positions;
    }

    calculateTreeLevels() {
        const levels = [];
        const queue = [{node: 0, level: 0}];
        const visited = new Set();
        
        while (queue.length > 0) {
            const {node, level} = queue.shift();
            
            if (visited.has(node)) continue;
            visited.add(node);
            
            if (!levels[level]) {
                levels[level] = [];
            }
            levels[level].push(node);
            
            const leftChild = 2 * node + 1;
            const rightChild = 2 * node + 2;
            
            // Add children if they exist and have valid values
            if (leftChild < this.segmentTree.length && this.segmentTree[leftChild] !== 0) {
                queue.push({node: leftChild, level: level + 1});
            }
            if (rightChild < this.segmentTree.length && this.segmentTree[rightChild] !== 0) {
                queue.push({node: rightChild, level: level + 1});
            }
        }
        
        return levels;
    }

    drawTreeEdges(positions, nodeRadius) {
        for (let i = 0; i < this.segmentTree.length; i++) {
            if (this.segmentTree[i] === 0 || !positions[i]) continue;
            
            const leftChild = 2 * i + 1;
            const rightChild = 2 * i + 2;
            
            // Only draw edges to children that exist and have positions
            if (leftChild < this.segmentTree.length && 
                this.segmentTree[leftChild] !== 0 && 
                positions[leftChild]) {
                this.drawEdge(positions[i], positions[leftChild], nodeRadius);
            }
            if (rightChild < this.segmentTree.length && 
                this.segmentTree[rightChild] !== 0 && 
                positions[rightChild]) {
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

    drawTreeNodes(positions, nodeRadius) {
        // Clear existing nodes
        this.nodesGroup.selectAll('*').remove();
        
        // Create data array with node indices and values
        const nodeData = [];
        for (let i = 0; i < this.segmentTree.length; i++) {
            if (this.segmentTree[i] !== 0 && positions[i]) {
                nodeData.push({
                    index: i,
                    value: this.segmentTree[i],
                    position: positions[i]
                });
            }
        }
        
        const nodes = this.nodesGroup.selectAll('.node-group')
            .data(nodeData)
            .enter()
            .append('g')
            .attr('class', 'node-group')
            .attr('transform', d => `translate(${d.position.x}, ${d.position.y})`);
        
        nodes.append('circle')
            .attr('class', 'node')
            .attr('r', nodeRadius);
        
        nodes.append('text')
            .attr('class', 'node-text')
            .text(d => d.value);
    }

    updateStats() {
        document.getElementById('array-size-stat').textContent = this.array.length;
        document.getElementById('tree-size-stat').textContent = this.segmentTree.filter(val => val !== 0).length;
        document.getElementById('tree-height-stat').textContent = this.treeBuilt ? Math.ceil(Math.log2(this.array.length)) + 1 : 0;
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

    delay() {
        return new Promise(resolve => setTimeout(resolve, this.animationSpeed));
    }

    updateCodeDisplay(operation) {
        const codeSnippets = {
            build: `// Build Segment Tree
function buildSegmentTree(arr, tree, node, start, end) {
    if (start === end) {
        tree[node] = arr[start];
        return;
    }
    
    const mid = Math.floor((start + end) / 2);
    const leftChild = 2 * node + 1;
    const rightChild = 2 * node + 2;
    
    buildSegmentTree(arr, tree, leftChild, start, mid);
    buildSegmentTree(arr, tree, rightChild, mid + 1, end);
    
    // Combine based on operation type
    if (operationType === 'sum') {
        tree[node] = tree[leftChild] + tree[rightChild];
    } else if (operationType === 'min') {
        tree[node] = Math.min(tree[leftChild], tree[rightChild]);
    } else if (operationType === 'max') {
        tree[node] = Math.max(tree[leftChild], tree[rightChild]);
    }
}`,
            query: `// Range Query
function rangeQuery(tree, node, start, end, left, right) {
    // No overlap
    if (end < left || start > right) {
        return operationType === 'sum' ? 0 : 
               (operationType === 'min' ? Infinity : -Infinity);
    }
    
    // Complete overlap
    if (left <= start && end <= right) {
        return tree[node];
    }
    
    // Partial overlap
    const mid = Math.floor((start + end) / 2);
    const leftChild = 2 * node + 1;
    const rightChild = 2 * node + 2;
    
    const leftResult = rangeQuery(tree, leftChild, start, mid, left, right);
    const rightResult = rangeQuery(tree, rightChild, mid + 1, end, left, right);
    
    if (operationType === 'sum') {
        return leftResult + rightResult;
    } else if (operationType === 'min') {
        return Math.min(leftResult, rightResult);
    } else if (operationType === 'max') {
        return Math.max(leftResult, rightResult);
    }
}`,
            update: `// Update Value
function updateValue(tree, node, start, end, index, value) {
    if (start === end) {
        tree[node] = value;
        return;
    }
    
    const mid = Math.floor((start + end) / 2);
    const leftChild = 2 * node + 1;
    const rightChild = 2 * node + 2;
    
    if (index <= mid) {
        updateValue(tree, leftChild, start, mid, index, value);
    } else {
        updateValue(tree, rightChild, mid + 1, end, index, value);
    }
    
    // Update current node
    if (operationType === 'sum') {
        tree[node] = tree[leftChild] + tree[rightChild];
    } else if (operationType === 'min') {
        tree[node] = Math.min(tree[leftChild], tree[rightChild]);
    } else if (operationType === 'max') {
        tree[node] = Math.max(tree[leftChild], tree[rightChild]);
    }
}`,
            clear: `// Clear Segment Tree
function clearSegmentTree() {
    tree = new Array(4 * array.length).fill(0);
    // Tree is now empty
}`
        };
        
        document.getElementById('code-display').textContent = codeSnippets[operation] || '// Select an operation to see the code';
    }
}

// Initialize the visualizer when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Small delay to ensure DOM is fully rendered
    setTimeout(() => {
        window.segmentTreeVisualizer = new SegmentTreeVisualizer();
    }, 100);
});
