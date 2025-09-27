class TrieNode {
    constructor(char) {
        this.char = char;
        this.children = new Map();
        this.isEndOfWord = false;
        this.id = Math.random().toString(36).substr(2, 9);
    }
}

class TrieVisualization {
    constructor() {
        this.root = new TrieNode('ROOT');
        this.currentOperation = 'insert';
        this.isRunning = false;
        this.animationSpeed = 800;
        this.words = new Set();
        this.nodeIdCounter = 0;
        
        // D3.js setup
        this.svg = d3.select('#trieSvg');
        this.width = 800;
        this.height = 500;
        this.zoom = d3.zoom()
            .scaleExtent([0.1, 4])
            .on('zoom', (event) => {
                this.g.attr('transform', event.transform);
            });
        
        this.svg.call(this.zoom);
        this.g = this.svg.append('g');
        
        this.initializeEventListeners();
        this.renderTrie();
    }

    initializeEventListeners() {
        // Operation buttons
        document.querySelectorAll('.operation-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.operation-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentOperation = btn.dataset.operation;
                document.getElementById('operationBtn').textContent = 
                    this.currentOperation.charAt(0).toUpperCase() + this.currentOperation.slice(1) + ' Word';
            });
        });

        // Main operation button
        document.getElementById('operationBtn').addEventListener('click', () => {
            this.performOperation();
        });

        // Clear button
        document.getElementById('clearBtn').addEventListener('click', () => {
            this.clearTrie();
        });

        // Center button
        document.getElementById('centerBtn').addEventListener('click', () => {
            this.centerTrie();
        });

        // Reset view button
        document.getElementById('resetViewBtn').addEventListener('click', () => {
            this.resetView();
        });

        // Enter key support
        document.getElementById('wordInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.performOperation();
            }
        });
    }

    async performOperation() {
        const word = document.getElementById('wordInput').value.toLowerCase().trim();
        
        if (!word) {
            this.showError('Please enter a word');
            return;
        }

        if (!/^[a-z]+$/.test(word)) {
            this.showError('Please enter only lowercase letters');
            return;
        }
        
        if (word.length > 10) {
            this.showError('Word must be 10 characters or less');
            return;
        }

        if (this.isRunning) return;
        this.isRunning = true;

        switch (this.currentOperation) {
            case 'insert':
                await this.insertWord(word);
                break;
            case 'search':
                await this.searchWord(word);
                break;
            case 'delete':
                await this.deleteWord(word);
                break;
        }

        this.isRunning = false;
        document.getElementById('wordInput').value = '';
    }

    async insertWord(word) {
        this.updateStepInfo('Inserting Word', `Inserting "${word}" into the trie...`);
        
        let current = this.root;
        let path = [];
        
        for (let i = 0; i < word.length; i++) {
            const char = word[i];
            path.push(char);
            
            this.updateStepInfo('Processing Character', `Processing character "${char}" (position ${i + 1}/${word.length})`);
            
            if (!current.children.has(char)) {
                const newNode = new TrieNode(char);
                current.children.set(char, newNode);
                this.updateStepInfo('Creating Node', `Creating new node for character "${char}"`);
            } else {
                this.updateStepInfo('Following Path', `Following existing path for character "${char}"`);
            }
            
            current = current.children.get(char);
            
            await this.delay(this.animationSpeed);
            this.renderTrie();
        }
        
        current.isEndOfWord = true;
        this.words.add(word);
        this.updateStepInfo('Word Inserted', `Successfully inserted "${word}" into the trie`);
        
        this.renderTrie();
        this.updateWordList();
    }

    async searchWord(word) {
        this.updateStepInfo('Searching Word', `Searching for "${word}" in the trie...`);
        
        let current = this.root;
        let path = [];
        
        for (let i = 0; i < word.length; i++) {
            const char = word[i];
            path.push(char);
            
            this.updateStepInfo('Checking Character', `Checking character "${char}" (position ${i + 1}/${word.length})`);
            
            if (!current.children.has(char)) {
                this.updateStepInfo('Word Not Found', `"${word}" not found in the trie`);
                return false;
            }
            
            current = current.children.get(char);
            await this.delay(this.animationSpeed);
        }
        
        if (current.isEndOfWord) {
            this.updateStepInfo('Word Found', `"${word}" found in the trie`);
            return true;
        } else {
            this.updateStepInfo('Word Not Found', `"${word}" not found in the trie`);
            return false;
        }
    }

    async deleteWord(word) {
        this.updateStepInfo('Deleting Word', `Deleting "${word}" from the trie...`);
        
        if (!this.searchWordInTrie(word)) {
            this.updateStepInfo('Word Not Found', `"${word}" not found in the trie. Cannot delete.`);
            return false;
        }
        
        // Delete from trie structure
        this.deleteFromTrie(this.root, word, 0);
        this.words.delete(word);
        
        this.updateStepInfo('Word Deleted', `Successfully deleted "${word}" from the trie`);
        this.renderTrie();
        this.updateWordList();
        return true;
    }

    deleteFromTrie(node, word, index) {
        if (index === word.length) {
            node.isEndOfWord = false;
            return node.children.size === 0;
        }
        
        const char = word[index];
        if (!node.children.has(char)) {
            return false;
        }
        
        const shouldDelete = this.deleteFromTrie(node.children.get(char), word, index + 1);
        
        if (shouldDelete) {
            node.children.delete(char);
            return node.children.size === 0 && !node.isEndOfWord;
        }
        
        return false;
    }

    searchWordInTrie(word) {
        let current = this.root;
        for (let i = 0; i < word.length; i++) {
            const char = word[i];
            if (!current.children.has(char)) {
                return false;
            }
            current = current.children.get(char);
        }
        return current.isEndOfWord;
    }

    renderTrie() {
        // Clear existing content
        this.g.selectAll('*').remove();
        
        // Check if trie is empty
        if (this.root.children.size === 0) {
            this.g.append('text')
                .attr('x', this.width / 2)
                .attr('y', this.height / 2)
                .attr('text-anchor', 'middle')
                .attr('font-size', '18px')
                .attr('fill', '#6b7280')
                .text('Trie is empty. Insert some words to see the visualization.');
            return;
        }
        
        // Convert trie to D3 hierarchy
        const data = this.convertToD3Hierarchy();
        
        // Create tree layout
        const tree = d3.tree()
            .size([this.width - 100, this.height - 100]);
        
        const root = d3.hierarchy(data);
        tree(root);
        
        // Render links
        this.g.selectAll('.link')
            .data(root.links())
            .enter()
            .append('path')
            .attr('class', 'link')
            .attr('d', d3.linkVertical()
                .x(d => d.x + 50)
                .y(d => d.y + 50))
            .style('fill', 'none')
            .style('stroke', '#6b7280')
            .style('stroke-width', 2);
        
        // Render nodes
        const nodes = this.g.selectAll('.node')
            .data(root.descendants())
            .enter()
            .append('g')
            .attr('class', 'node')
            .attr('transform', d => `translate(${d.x + 50},${d.y + 50})`);
        
        // Add circles
        nodes.append('circle')
            .attr('r', 25)
            .style('fill', d => {
                if (d.data.name === 'ROOT') return '#ef4444';
                return d.data.isEndOfWord ? '#10b981' : '#3b82f6';
            })
            .style('stroke', '#fff')
            .style('stroke-width', 2);
        
        // Add text
        nodes.append('text')
            .attr('dy', '.35em')
            .attr('text-anchor', 'middle')
            .style('fill', 'white')
            .style('font-weight', 'bold')
            .style('font-size', '14px')
            .text(d => d.data.name);
        
        // Add edge labels
        this.g.selectAll('.edge-label')
            .data(root.links())
            .enter()
            .append('text')
            .attr('class', 'edge-label')
            .attr('x', d => (d.source.x + d.target.x) / 2 + 50)
            .attr('y', d => (d.source.y + d.target.y) / 2 + 50)
            .attr('text-anchor', 'middle')
            .attr('font-size', '12px')
            .attr('fill', '#374151')
            .text(d => d.target.data.edgeChar);
        
        // Show help text
        const helpElement = document.getElementById('trieHelp');
        if (helpElement) {
            helpElement.style.display = 'block';
        }
    }

    convertToD3Hierarchy() {
        const convert = (node, edgeChar = '') => {
            const result = {
                name: node.char,
                isEndOfWord: node.isEndOfWord,
                edgeChar: edgeChar,
                children: []
            };
            
            for (const [char, child] of node.children) {
                result.children.push(convert(child, char));
            }
            
            return result;
        };
        
        return convert(this.root);
    }

    clearTrie() {
        this.root = new TrieNode('ROOT');
        this.words.clear();
        this.renderTrie();
        this.updateWordList();
        this.updateStepInfo('Trie Cleared', 'All words have been removed from the trie');
    }

    centerTrie() {
        if (this.root.children.size === 0) {
            this.updateStepInfo('Cannot Center', 'Trie is empty. Insert some words first.');
            return;
        }

        // Reset zoom and pan
        this.svg.transition().duration(750).call(
            this.zoom.transform,
            d3.zoomIdentity.translate(this.width / 2, this.height / 2).scale(1)
        );
        
        this.updateStepInfo('Trie Centered', 'Trie has been centered in the viewport');
    }

    resetView() {
        if (this.root.children.size === 0) {
            this.updateStepInfo('Cannot Reset', 'Trie is empty. Insert some words first.');
            return;
        }

        this.renderTrie();
        this.centerTrie();
        this.updateStepInfo('View Reset', 'Trie view has been reset to default position');
    }

    updateWordList() {
        const container = document.getElementById('wordItems');
        container.innerHTML = '';
        
        const sortedWords = Array.from(this.words).sort();
        sortedWords.forEach(word => {
            const wordElement = document.createElement('div');
            wordElement.className = 'word-item';
            wordElement.textContent = word;
            container.appendChild(wordElement);
        });
    }

    updateStepInfo(title, description) {
        document.getElementById('stepTitle').textContent = title;
        document.getElementById('stepDescription').textContent = description;
        document.getElementById('stepInfo').style.display = 'block';
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ef4444;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            z-index: 1000;
            font-weight: 500;
        `;
        errorDiv.textContent = message;
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 3000);
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize the visualization when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.trieVisualization = new TrieVisualization();
});
