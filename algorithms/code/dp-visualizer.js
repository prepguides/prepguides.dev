class DynamicProgrammingVisualizer {
    constructor() {
        this.currentAlgorithm = 'knapsack';
        this.isRunning = false;
        this.startTime = 0;
        this.cellsProcessed = 0;
        this.items = [];
        this.dpTable = [];
        
        this.initializeElements();
        this.setupEventListeners();
        this.generateKnapsackProblem();
    }

    initializeElements() {
        this.algorithmBtns = document.querySelectorAll('.algorithm-btn');
        this.knapsackControls = document.getElementById('knapsackControls');
        this.lcsControls = document.getElementById('lcsControls');
        this.lcsControls2 = document.getElementById('lcsControls2');
        this.capacityInput = document.getElementById('capacity');
        this.string1Input = document.getElementById('string1');
        this.string2Input = document.getElementById('string2');
        this.speedSlider = document.getElementById('speed');
        this.speedValue = document.getElementById('speedValue');
        this.generateBtn = document.getElementById('generate');
        this.startBtn = document.getElementById('start');
        this.resetBtn = document.getElementById('reset');
        this.cellsProcessedEl = document.getElementById('cellsProcessed');
        this.optimalValueEl = document.getElementById('optimalValue');
        this.timeEl = document.getElementById('time');
        this.algorithmInfo = document.getElementById('algorithmInfo');
        this.knapsackVisualization = document.getElementById('knapsackVisualization');
        this.lcsVisualization = document.getElementById('lcsVisualization');
    }

    setupEventListeners() {
        this.algorithmBtns.forEach(btn => {
            btn.addEventListener('click', () => this.selectAlgorithm(btn.dataset.algorithm));
        });

        this.generateBtn.addEventListener('click', () => this.generateProblem());
        this.startBtn.addEventListener('click', () => this.startDP());
        this.resetBtn.addEventListener('click', () => this.reset());
        this.speedSlider.addEventListener('input', (e) => {
            this.speedValue.textContent = e.target.value;
        });
    }

    selectAlgorithm(algorithm) {
        this.currentAlgorithm = algorithm;
        
        this.algorithmBtns.forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-algorithm="${algorithm}"]`).classList.add('active');
        
        if (algorithm === 'knapsack') {
            this.knapsackControls.style.display = 'flex';
            this.lcsControls.style.display = 'none';
            this.lcsControls2.style.display = 'none';
            this.knapsackVisualization.style.display = 'block';
            this.lcsVisualization.style.display = 'none';
            this.updateAlgorithmInfo('knapsack');
        } else {
            this.knapsackControls.style.display = 'none';
            this.lcsControls.style.display = 'flex';
            this.lcsControls2.style.display = 'flex';
            this.knapsackVisualization.style.display = 'none';
            this.lcsVisualization.style.display = 'block';
            this.updateAlgorithmInfo('lcs');
        }
    }

    updateAlgorithmInfo(algorithm) {
        if (algorithm === 'knapsack') {
            this.algorithmInfo.innerHTML = `
                <h4>0/1 Knapsack Problem</h4>
                <p>Given items with weights and values, determine the maximum value that can be obtained without exceeding the knapsack capacity. Each item can be used at most once.</p>
            `;
        } else {
            this.algorithmInfo.innerHTML = `
                <h4>Longest Common Subsequence (LCS)</h4>
                <p>Find the longest subsequence that appears in both strings. A subsequence is derived by deleting some or no elements without changing the order.</p>
            `;
        }
    }

    generateProblem() {
        if (this.currentAlgorithm === 'knapsack') {
            this.generateKnapsackProblem();
        } else {
            this.generateLCSProblem();
        }
    }

    generateKnapsackProblem() {
        const capacity = parseInt(this.capacityInput.value);
        this.items = [
            { id: 1, weight: 2, value: 3, name: 'Item 1' },
            { id: 2, weight: 3, value: 4, name: 'Item 2' },
            { id: 3, weight: 4, value: 5, name: 'Item 3' },
            { id: 4, weight: 5, value: 6, name: 'Item 4' },
            { id: 5, weight: 6, value: 7, name: 'Item 5' }
        ];

        this.renderItems();
        this.createKnapsackTable();
        this.resetStats();
    }

    generateLCSProblem() {
        const str1 = this.string1Input.value.toUpperCase();
        const str2 = this.string2Input.value.toUpperCase();
        
        this.string1 = str1;
        this.string2 = str2;
        
        this.createLCSTable();
        this.resetStats();
    }

    renderItems() {
        const itemsList = document.getElementById('itemsList');
        itemsList.innerHTML = '';
        
        this.items.forEach(item => {
            const itemCard = document.createElement('div');
            itemCard.className = 'item-card';
            itemCard.innerHTML = `
                <div>${item.name}</div>
                <div class="item-weight">Weight: ${item.weight}</div>
                <div class="item-value">Value: ${item.value}</div>
            `;
            itemsList.appendChild(itemCard);
        });
    }

    createKnapsackTable() {
        const capacity = parseInt(this.capacityInput.value);
        const n = this.items.length;
        
        this.dpTable = Array(n + 1).fill().map(() => Array(capacity + 1).fill(0));
        
        const table = document.getElementById('knapsackTable');
        table.innerHTML = '';
        table.style.gridTemplateColumns = `repeat(${capacity + 2}, 1fr)`;
        
        // Header row
        const headerRow = document.createElement('div');
        headerRow.className = 'dp-cell';
        headerRow.textContent = '';
        table.appendChild(headerRow);
        
        for (let w = 0; w <= capacity; w++) {
            const headerCell = document.createElement('div');
            headerCell.className = 'dp-cell';
            headerCell.textContent = w;
            table.appendChild(headerCell);
        }
        
        // Data rows
        for (let i = 0; i <= n; i++) {
            const rowHeader = document.createElement('div');
            rowHeader.className = 'dp-cell';
            rowHeader.textContent = i === 0 ? '' : `Item ${i}`;
            table.appendChild(rowHeader);
            
            for (let w = 0; w <= capacity; w++) {
                const cell = document.createElement('div');
                cell.className = 'dp-cell';
                cell.textContent = '0';
                cell.dataset.row = i;
                cell.dataset.col = w;
                table.appendChild(cell);
            }
        }
    }

    createLCSTable() {
        const m = this.string1.length;
        const n = this.string2.length;
        
        this.dpTable = Array(m + 1).fill().map(() => Array(n + 1).fill(0));
        
        const table = document.getElementById('lcsTable');
        table.innerHTML = '';
        table.style.gridTemplateColumns = `repeat(${n + 2}, 1fr)`;
        
        // Header row
        const headerRow = document.createElement('div');
        headerRow.className = 'dp-cell';
        headerRow.textContent = '';
        table.appendChild(headerRow);
        
        for (let j = 0; j <= n; j++) {
            const headerCell = document.createElement('div');
            headerCell.className = 'dp-cell';
            headerCell.textContent = j === 0 ? '' : this.string2[j - 1];
            table.appendChild(headerCell);
        }
        
        // Data rows
        for (let i = 0; i <= m; i++) {
            const rowHeader = document.createElement('div');
            rowHeader.className = 'dp-cell';
            rowHeader.textContent = i === 0 ? '' : this.string1[i - 1];
            table.appendChild(rowHeader);
            
            for (let j = 0; j <= n; j++) {
                const cell = document.createElement('div');
                cell.className = 'dp-cell';
                cell.textContent = '0';
                cell.dataset.row = i;
                cell.dataset.col = j;
                table.appendChild(cell);
            }
        }
    }

    async startDP() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.startBtn.disabled = true;
        this.resetStats();
        this.startTime = performance.now();

        if (this.currentAlgorithm === 'knapsack') {
            await this.knapsackDP();
        } else {
            await this.lcsDP();
        }

        this.isRunning = false;
        this.startBtn.disabled = false;
        this.updateDuration();
    }

    async knapsackDP() {
        const capacity = parseInt(this.capacityInput.value);
        const n = this.items.length;
        
        for (let i = 1; i <= n; i++) {
            for (let w = 1; w <= capacity; w++) {
                this.highlightCell(i, w, 'current');
                await this.delay(300);
                
                const item = this.items[i - 1];
                let value = this.dpTable[i - 1][w];
                
                if (item.weight <= w) {
                    const valueWithItem = this.dpTable[i - 1][w - item.weight] + item.value;
                    if (valueWithItem > value) {
                        value = valueWithItem;
                    }
                }
                
                this.dpTable[i][w] = value;
                this.updateCell(i, w, value);
                this.highlightCell(i, w, 'visited');
                
                this.cellsProcessed++;
                this.updateStats();
                
                await this.delay(200);
            }
        }
        
        // Highlight optimal solution
        this.highlightOptimalPath();
        this.optimalValueEl.textContent = this.dpTable[n][capacity];
    }

    async lcsDP() {
        const m = this.string1.length;
        const n = this.string2.length;
        
        for (let i = 1; i <= m; i++) {
            for (let j = 1; j <= n; j++) {
                this.highlightCell(i, j, 'current');
                await this.delay(300);
                
                let value;
                if (this.string1[i - 1] === this.string2[j - 1]) {
                    value = this.dpTable[i - 1][j - 1] + 1;
                } else {
                    value = Math.max(this.dpTable[i - 1][j], this.dpTable[i][j - 1]);
                }
                
                this.dpTable[i][j] = value;
                this.updateCell(i, j, value);
                this.highlightCell(i, j, 'visited');
                
                this.cellsProcessed++;
                this.updateStats();
                
                await this.delay(200);
            }
        }
        
        this.optimalValueEl.textContent = this.dpTable[m][n];
    }

    highlightCell(row, col, state) {
        const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        if (cell) {
            cell.className = `dp-cell ${state}`;
        }
    }

    updateCell(row, col, value) {
        const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        if (cell) {
            cell.textContent = value;
        }
    }

    highlightOptimalPath() {
        // Simple path highlighting for knapsack
        const capacity = parseInt(this.capacityInput.value);
        const n = this.items.length;
        
        let w = capacity;
        for (let i = n; i > 0; i--) {
            if (this.dpTable[i][w] !== this.dpTable[i - 1][w]) {
                this.highlightCell(i, w, 'optimal');
                w -= this.items[i - 1].weight;
            }
        }
    }

    reset() {
        this.cellsProcessed = 0;
        this.dpTable = [];
        this.resetStats();
        
        if (this.currentAlgorithm === 'knapsack') {
            this.createKnapsackTable();
        } else {
            this.createLCSTable();
        }
    }

    resetStats() {
        this.cellsProcessed = 0;
        this.startTime = 0;
        this.updateStats();
        this.optimalValueEl.textContent = '0';
    }

    updateStats() {
        this.cellsProcessedEl.textContent = this.cellsProcessed;
    }

    updateDuration() {
        const duration = Math.round(performance.now() - this.startTime);
        this.timeEl.textContent = `${duration}ms`;
    }

    delay(ms) {
        const speed = parseInt(this.speedSlider.value);
        const adjustedDelay = Math.max(50, ms - (speed - 5) * 50);
        return new Promise(resolve => setTimeout(resolve, adjustedDelay));
    }
}

// Initialize the visualizer when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.dpVisualizer = new DynamicProgrammingVisualizer();
});
