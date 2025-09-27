/**
 * Binary Search Tree Visualizer
 * Interactive BST operations with D3.js visualization
 */

class BSTNode {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
        this.id = Math.random().toString(36).substr(2, 9);
    }
}

class BSTVisualizer {
    constructor() {
        this.root = null;
        this.isRunning = false;
        this.operations = 0;
        this.comparisons = 0;
        this.startTime = 0;
        this.traversalSequence = [];
        
        // D3.js setup
        this.svg = d3.select('#treeSvg');
        if (this.svg.empty()) {
            console.error('SVG element #treeSvg not found!');
            return;
        }
        this.width = 800;
        this.height = 500;
        
        // Group for zoom/pan
        this.g = this.svg.append('g');

        // D3 Tree layout
        this.treeLayout = d3.tree()
            .nodeSize([150, 120]) // Increased horizontal and vertical spacing for clearer left/right distinction
            .separation((a, b) => {
                // Custom separation function to ensure clear left/right positioning
                if (a.parent === b.parent) {
                    return 2.0; // More space between siblings
                }
                return 1.2; // More space between levels
            });

        // Zoom behavior
        this.zoom = d3.zoom()
            .scaleExtent([0.1, 4])
            .on('zoom', (event) => {
                this.g.attr('transform', event.transform);
            });
        
        this.svg.call(this.zoom);
        
        this.initializeElements();
        this.setupEventListeners();
        this.setupCodeEventListeners();
        this.resetStats();
        this.generateRandomTree();

        // Code execution synchronization (after DOM elements are ready)
        try {
            this.codeSync = new CodeExecutionSync();
            this.initializeCodeBlocks();
        } catch (error) {
            console.warn('CodeExecutionSync not available:', error);
            this.codeSync = null;
        }
    }

    initializeElements() {
        this.operationSelect = document.getElementById('operation');
        this.valueInput = document.getElementById('value');
        this.traversalSelect = document.getElementById('traversal');
        this.speedSlider = document.getElementById('speed');
        this.speedValue = document.getElementById('speedValue');
        this.executeBtn = document.getElementById('execute');
        this.generateBtn = document.getElementById('generate');
        this.resetBtn = document.getElementById('reset');
        this.operationsEl = document.getElementById('operations');
        this.comparisonsEl = document.getElementById('comparisons');
        this.timeEl = document.getElementById('time');
        this.traversalGroup = document.getElementById('traversalGroup');
        
        // Debug: Check if all elements are found
        const elements = {
            operationSelect: this.operationSelect,
            valueInput: this.valueInput,
            executeBtn: this.executeBtn,
            generateBtn: this.generateBtn,
            resetBtn: this.resetBtn
        };
        
        for (const [name, element] of Object.entries(elements)) {
            if (!element) {
                console.error(`Element not found: ${name}`);
            }
        }
        
        console.log('BST Visualizer initialized successfully');
    }

    setupEventListeners() {
        this.executeBtn.addEventListener('click', () => this.executeOperation());
        this.generateBtn.addEventListener('click', () => this.generateRandomTree());
        this.resetBtn.addEventListener('click', () => this.reset());
        this.operationSelect.addEventListener('change', () => this.updateControls());
        this.speedSlider.addEventListener('input', (e) => {
            this.speedValue.textContent = e.target.value;
        });
    }

    updateControls() {
        const operation = this.operationSelect.value;
        
        if (operation === 'traverse') {
            this.valueInput.style.display = 'none';
            this.traversalGroup.style.display = 'flex';
        } else {
            this.valueInput.style.display = 'block';
            this.traversalGroup.style.display = 'none';
        }
        
        // Update code blocks based on operation
        this.updateCodeBlocks(operation);
    }

    async executeOperation() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.startTime = performance.now();
        this.operations++;
        this.operationsEl.textContent = this.operations;
        
        const operation = this.operationSelect.value;
        const value = parseInt(this.valueInput.value);
        
        try {
            switch (operation) {
                case 'insert':
                    if (isNaN(value)) {
                        this.showMessage('Please enter a valid number', 'error');
                        return;
                    }
                    await this.insertNode(this.root, value);
                    break;
                case 'delete':
                    if (isNaN(value)) {
                        this.showMessage('Please enter a valid number', 'error');
                        return;
                    }
                    await this.deleteNode(this.root, value);
                    break;
                case 'search':
                    if (isNaN(value)) {
                        this.showMessage('Please enter a valid number', 'error');
                        return;
                    }
                    await this.searchNode(this.root, value);
                    break;
                case 'traverse':
                    const traversal = this.traversalSelect.value;
                    await this.traverseTree(traversal);
                    break;
            }
        } catch (error) {
            console.error('Operation failed:', error);
            this.showMessage('Operation failed', 'error');
        } finally {
            this.isRunning = false;
            const endTime = performance.now();
            this.timeEl.textContent = `${(endTime - this.startTime).toFixed(2)}ms`;
        }
    }

    async insertNode(node, value) {
        if (!node) {
            this.root = new BSTNode(value);
            this.renderTree();
            this.highlightNode(this.root.id, 'inserting');
            this.showMessage(`Inserted ${value} as root`, 'success');
            await this.delay(1000);
            this.clearHighlights();
            return;
        }

        this.highlightNode(node.id, 'examining');
        await this.delay(600);

        if (value < node.value) {
            this.showComparison(node.value, value, 'left');
            this.highlightNode(node.id, 'examining-left');
            await this.delay(800);
            if (node.left) {
                this.highlightNode(node.id, 'path-left');
                this.showDirectionArrow(node.id, 'left');
                await this.delay(600);
                await this.insertNode(node.left, value);
            } else {
                node.left = new BSTNode(value);
                this.highlightNode(node.id, 'path-left');
                this.showDirectionArrow(node.id, 'left');
                await this.delay(600);
                this.renderTree();
                this.highlightNode(node.left.id, 'inserting-left');
                this.showMessage(`Inserted ${value} as LEFT child of ${node.value}`, 'success');
                await this.delay(1200);
                this.clearHighlights();
                this.clearDirectionArrows();
            }
        } else if (value > node.value) {
            this.showComparison(node.value, value, 'right');
            this.highlightNode(node.id, 'examining-right');
            await this.delay(800);
            if (node.right) {
                this.highlightNode(node.id, 'path-right');
                this.showDirectionArrow(node.id, 'right');
                await this.delay(600);
                await this.insertNode(node.right, value);
            } else {
                node.right = new BSTNode(value);
                this.highlightNode(node.id, 'path-right');
                this.showDirectionArrow(node.id, 'right');
                await this.delay(600);
                this.renderTree();
                this.highlightNode(node.right.id, 'inserting-right');
                this.showMessage(`Inserted ${value} as RIGHT child of ${node.value}`, 'success');
                await this.delay(1200);
                this.clearHighlights();
                this.clearDirectionArrows();
            }
        } else {
            this.showMessage(`Value ${value} already exists`, 'warning');
            this.clearHighlights();
        }
    }

    async deleteNode(node, value) {
        if (!node) {
            this.showMessage(`Value ${value} not found`, 'error');
            return null;
        }

        this.highlightNode(node.id, 'examining');
        await this.delay(600);

        if (value < node.value) {
            this.highlightNode(node.id, 'examining-left');
            await this.delay(600);
            node.left = await this.deleteNode(node.left, value);
        } else if (value > node.value) {
            this.highlightNode(node.id, 'examining-right');
            await this.delay(600);
            node.right = await this.deleteNode(node.right, value);
        } else {
            // Node to delete found
            this.highlightNode(node.id, 'deleting');
            await this.delay(800);

            if (!node.left) {
                this.showMessage(`Deleted ${value} (no left child)`, 'success');
                await this.delay(600);
                this.renderTree();
                return node.right;
            } else if (!node.right) {
                this.showMessage(`Deleted ${value} (no right child)`, 'success');
                await this.delay(600);
                this.renderTree();
                return node.left;
            } else {
                // Node has both children
                const minNode = this.findMin(node.right);
                this.highlightNode(minNode.id, 'replacing');
                await this.delay(800);
                
                node.value = minNode.value;
                node.right = await this.deleteNode(node.right, minNode.value);
                this.showMessage(`Deleted ${value} and replaced with ${minNode.value}`, 'success');
                await this.delay(600);
                this.renderTree();
            }
        }

        this.clearHighlights();
        return node;
    }

    findMin(node) {
        while (node.left) {
            node = node.left;
        }
        return node;
    }

    async searchNode(node, value) {
        if (!node) {
            this.showMessage(`Value ${value} not found`, 'error');
            return false;
        }

        this.highlightNode(node.id, 'examining');
        await this.delay(600);

        if (value === node.value) {
            this.highlightNode(node.id, 'found');
            this.showMessage(`Found ${value}!`, 'success');
            await this.delay(1000);
            this.clearHighlights();
            return true;
        } else if (value < node.value) {
            this.highlightNode(node.id, 'examining-left');
            await this.delay(600);
            return await this.searchNode(node.left, value);
        } else {
            this.highlightNode(node.id, 'examining-right');
            await this.delay(600);
            return await this.searchNode(node.right, value);
        }
    }

    async traverseTree(type) {
        this.traversalSequence = [];
        this.clearHighlights();
        
        switch (type) {
            case 'inorder':
                await this.inorderTraversal(this.root);
                break;
            case 'preorder':
                await this.preorderTraversal(this.root);
                break;
            case 'postorder':
                await this.postorderTraversal(this.root);
                break;
            case 'levelorder':
                await this.levelOrderTraversal();
                break;
        }
        
        this.showMessage(`${type.charAt(0).toUpperCase() + type.slice(1)} traversal: ${this.traversalSequence.join(' → ')}`, 'info');
    }

    async inorderTraversal(node) {
        if (!node) return;
        
        await this.inorderTraversal(node.left);
        this.highlightNode(node.id, 'visiting');
        this.traversalSequence.push(node.value);
        await this.delay(800);
        this.clearHighlights();
        await this.inorderTraversal(node.right);
    }

    async preorderTraversal(node) {
        if (!node) return;
        
        this.highlightNode(node.id, 'visiting');
        this.traversalSequence.push(node.value);
        await this.delay(800);
        this.clearHighlights();
        await this.preorderTraversal(node.left);
        await this.preorderTraversal(node.right);
    }

    async postorderTraversal(node) {
        if (!node) return;
        
        await this.postorderTraversal(node.left);
        await this.postorderTraversal(node.right);
        this.highlightNode(node.id, 'visiting');
        this.traversalSequence.push(node.value);
        await this.delay(800);
        this.clearHighlights();
    }

    async levelOrderTraversal() {
        if (!this.root) return;
        
        const queue = [this.root];
        
        while (queue.length > 0) {
            const node = queue.shift();
            this.highlightNode(node.id, 'visiting');
            this.traversalSequence.push(node.value);
            await this.delay(800);
            this.clearHighlights();
            
            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }
    }

    generateRandomTree() {
        this.root = null;
        const numNodes = Math.floor(Math.random() * 8) + 5; // 5-12 nodes
        const values = [];
        for (let i = 0; i < numNodes; i++) {
            let value;
            do {
                value = Math.floor(Math.random() * 50) + 1;
            } while (values.includes(value));
            values.push(value);
        }
        this.shuffleArray(values); // Shuffle for realistic BST
        values.forEach(value => {
            if (!this.root) {
                this.root = new BSTNode(value);
            } else {
                this.insertNodeSync(this.root, value);
            }
        });
        console.log('Generated BST structure:');
        const isValid = this.verifyBSTStructure(this.root);
        if (!isValid) {
            console.error('❌ Generated invalid BST! Regenerating...');
            this.generateValidBST(numNodes); // Fallback to guaranteed valid BST
        }
        this.renderTree();
        this.resetStats();
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    generateValidBST(numNodes) {
        const values = [];
        for (let i = 0; i < numNodes; i++) {
            let value;
            do {
                value = Math.floor(Math.random() * 50) + 1;
            } while (values.includes(value));
            values.push(value);
        }
        values.sort((a, b) => a - b);
        this.root = this.buildValidBST(values, 0, values.length - 1);
        console.log('✅ Generated valid BST with sorted values:', values);
    }

    buildValidBST(values, start, end) {
        if (start > end) return null;
        const mid = Math.floor((start + end) / 2);
        const node = new BSTNode(values[mid]);
        node.left = this.buildValidBST(values, start, mid - 1);
        node.right = this.buildValidBST(values, mid + 1, end);
        return node;
    }

    insertNodeSync(node, value) {
        if (value < node.value) {
            if (node.left) {
                this.insertNodeSync(node.left, value);
            } else {
                node.left = new BSTNode(value);
            }
        } else if (value > node.value) {
            if (node.right) {
                this.insertNodeSync(node.right, value);
            } else {
                node.right = new BSTNode(value);
            }
        }
    }

    verifyBSTStructure(node, min = -Infinity, max = Infinity) {
        if (!node) return true;
        
        if (node.value <= min || node.value >= max) {
            console.error(`❌ BST violation: ${node.value} not in range (${min}, ${max})`);
            return false;
        }
        
        const leftValid = this.verifyBSTStructure(node.left, min, node.value);
        const rightValid = this.verifyBSTStructure(node.right, node.value, max);
        
        return leftValid && rightValid;
    }

    renderTree() {
        this.g.selectAll('*').remove();
        
        if (!this.root) {
            this.g.append('text')
                .attr('x', this.width / 2)
                .attr('y', this.height / 2)
                .attr('text-anchor', 'middle')
                .attr('dominant-baseline', 'middle')
                .style('font-size', '18px')
                .style('fill', '#6b7280')
                .text('Tree is empty');
            return;
        }

        const rootData = d3.hierarchy(this.root, d => [d.left, d.right].filter(Boolean));
        const treeData = this.treeLayout(rootData);
        
        // Adjust single child positions for explicit left/right positioning
        this.adjustSingleChildPositions(rootData);

        // Draw edges
        this.g.selectAll('.link')
            .data(treeData.links())
            .enter().append('path')
            .attr('class', 'link')
            .attr('d', d3.linkVertical()
                .x(d => d.x)
                .y(d => d.y))
            .style('fill', 'none')
            .style('stroke', '#94a3b8')
            .style('stroke-width', 2);

        // Draw nodes
        const nodes = this.g.selectAll('.node')
            .data(treeData.descendants())
            .enter().append('g')
            .attr('class', 'node')
            .attr('transform', d => `translate(${d.x},${d.y})`);

        nodes.append('circle')
            .attr('r', 25)
            .style('fill', '#ffffff')
            .style('stroke', '#6366f1')
            .style('stroke-width', 3);

        nodes.append('text')
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'middle')
            .style('font-size', '14px')
            .style('font-weight', 'bold')
            .style('fill', '#1f2937')
            .text(d => d.data.value);

        // Center the tree
        const bounds = this.g.node().getBBox();
        const xOffset = (this.width - bounds.width) / 2 - bounds.x;
        const yOffset = 50;
        this.g.attr('transform', `translate(${xOffset},${yOffset})`);
    }

    adjustSingleChildPositions(rootData) {
        rootData.each(d => {
            if (d.children && d.children.length === 1) {
                const child = d.children[0];
                const childValue = child.data.value;
                const parentValue = d.data.value;
                if (childValue < parentValue) {
                    child.x = d.x - 80; // Position to the left
                } else {
                    child.x = d.x + 80; // Position to the right
                }
                console.log(`Adjusted single child: ${childValue} positioned ${childValue < parentValue ? 'LEFT' : 'RIGHT'} of ${parentValue}`);
            }
        });
    }

    highlightNode(nodeId, type) {
        const node = this.g.selectAll('.node').filter(d => d.data.id === nodeId);
        const circle = node.select('circle');
        
        // Clear existing highlights
        circle.classed('highlighted examining examining-left examining-right inserting inserting-left inserting-right deleting visiting found path-left path-right', false);
        
        // Apply new highlight
        circle.classed(type, true);
    }

    clearHighlights() {
        this.g.selectAll('.node circle').classed('highlighted examining examining-left examining-right inserting inserting-left inserting-right deleting visiting found path-left path-right', false);
    }

    showDirectionArrow(nodeId, direction) {
        const node = this.g.selectAll('.node').filter(d => d.data.id === nodeId);
        const [x, y] = d3.select(node.node()).attr('transform').match(/-?\d+\.?\d*/g).map(Number);
        
        const arrow = this.g.append('g')
            .attr('class', `direction-arrow ${direction}`)
            .attr('transform', `translate(${x},${y})`);
        
        const arrowX = direction === 'left' ? -40 : 40;
        const arrowY = 0;
        
        arrow.append('path')
            .attr('d', `M 0,0 L ${arrowX},${arrowY}`)
            .style('stroke', '#ef4444')
            .style('stroke-width', 3)
            .style('marker-end', 'url(#arrowhead)');
        
        arrow.append('text')
            .attr('x', arrowX / 2)
            .attr('y', -10)
            .attr('text-anchor', 'middle')
            .style('font-size', '12px')
            .style('font-weight', 'bold')
            .style('fill', '#ef4444')
            .text(direction.toUpperCase());
    }

    clearDirectionArrows() {
        this.g.selectAll('.direction-arrow').remove();
    }

    showComparison(nodeValue, targetValue, direction) {
        const comparison = document.createElement('div');
        comparison.className = 'comparison-popup';
        comparison.innerHTML = `
            <div class="comparison-content">
                <span class="node-value">${nodeValue}</span>
                <span class="comparison-operator">${direction === 'left' ? '>' : '<'}</span>
                <span class="target-value">${targetValue}</span>
                <span class="comparison-result">${direction === 'left' ? 'Go Left' : 'Go Right'}</span>
            </div>
        `;
        document.body.appendChild(comparison);
        
        setTimeout(() => {
            comparison.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            comparison.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(comparison);
            }, 300);
        }, 2000);
    }

    showMessage(message, type) {
        // Create message element if it doesn't exist
        let messageEl = document.getElementById('message');
        if (!messageEl) {
            messageEl = document.createElement('div');
            messageEl.id = 'message';
            messageEl.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 20px;
                border-radius: 8px;
                color: white;
                font-weight: 600;
                z-index: 1000;
                display: none;
                max-width: 300px;
            `;
            document.body.appendChild(messageEl);
        }
        
        messageEl.textContent = message;
        messageEl.className = `message ${type}`;
        
        // Set background color based on type
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6'
        };
        messageEl.style.backgroundColor = colors[type] || colors.info;
        messageEl.style.display = 'block';
        
        setTimeout(() => {
            messageEl.style.display = 'none';
        }, 3000);
    }

    reset() {
        this.root = null;
        this.renderTree();
        this.resetStats();
        this.clearHighlights();
        this.clearDirectionArrows();
        this.showMessage('Tree reset', 'info');
    }

    resetStats() {
        this.operations = 0;
        this.comparisons = 0;
        this.operationsEl.textContent = '0';
        this.comparisonsEl.textContent = '0';
        this.timeEl.textContent = '0ms';
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Code execution synchronization methods
    setupCodeEventListeners() {
        // This will be implemented to sync code execution with visualization
    }

    initializeCodeBlocks() {
        // Initialize code blocks for the current operation
        this.updateCodeBlocks('insert');
    }

    updateCodeBlocks(operation) {
        // Update code blocks based on the selected operation
        if (this.codeSync) {
            this.codeSync.updateCodeBlocks(operation);
        }
    }
}

// Global functions for code execution controls (referenced in HTML)
function startCodeExecution() {
    if (window.bstVisualizer && window.bstVisualizer.codeSync) {
        window.bstVisualizer.codeSync.start();
    }
}

function pauseCodeExecution() {
    if (window.bstVisualizer && window.bstVisualizer.codeSync) {
        window.bstVisualizer.codeSync.pause();
    }
}

function resumeCodeExecution() {
    if (window.bstVisualizer && window.bstVisualizer.codeSync) {
        window.bstVisualizer.codeSync.resume();
    }
}

function stopCodeExecution() {
    if (window.bstVisualizer && window.bstVisualizer.codeSync) {
        window.bstVisualizer.codeSync.stop();
    }
}

function updateExecutionSpeed() {
    const speed = document.getElementById('executionSpeed').value;
    if (window.bstVisualizer && window.bstVisualizer.codeSync) {
        window.bstVisualizer.codeSync.setSpeed(speed);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.bstVisualizer = new BSTVisualizer();
});
