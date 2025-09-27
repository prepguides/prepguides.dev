class GraphTraversal {
    constructor() {
        this.nodes = [];
        this.links = [];
        this.graph = [];
        this.currentAlgorithm = 'bfs';
        this.isRunning = false;
        this.visitedNodes = new Set();
        this.traversedEdges = new Set();
        this.startTime = 0;
        
        // D3.js setup
        this.svg = d3.select('#graphSvg');
        this.width = 800;
        this.height = 500;
        
        // Group for zoom/pan
        this.g = this.svg.append('g');

        // Force simulation
        this.simulation = d3.forceSimulation()
            .force('link', d3.forceLink().id(d => d.id).distance(100))
            .force('charge', d3.forceManyBody().strength(-300))
            .force('center', d3.forceCenter(this.width / 2, this.height / 2));

        // Zoom behavior
        this.zoom = d3.zoom()
            .scaleExtent([0.1, 4])
            .on('zoom', (event) => {
                this.g.attr('transform', event.transform);
            });
        
        this.svg.call(this.zoom);
        
        this.initializeElements();
        this.setupEventListeners();
        this.generateGraph();
    }

    initializeElements() {
        this.bfsBtn = document.getElementById('bfsBtn');
        this.dfsBtn = document.getElementById('dfsBtn');
        this.nodeCountInput = document.getElementById('nodeCount');
        this.startNodeSelect = document.getElementById('startNode');
        this.generateBtn = document.getElementById('generate');
        this.startBtn = document.getElementById('start');
        this.resetBtn = document.getElementById('reset');
        this.nodesVisitedEl = document.getElementById('nodesVisited');
        this.edgesTraversedEl = document.getElementById('edgesTraversed');
        this.timeEl = document.getElementById('time');
    }

    setupEventListeners() {
        this.bfsBtn.addEventListener('click', () => this.selectAlgorithm('bfs'));
        this.dfsBtn.addEventListener('click', () => this.selectAlgorithm('dfs'));
        this.generateBtn.addEventListener('click', () => this.generateGraph());
        this.startBtn.addEventListener('click', () => this.startTraversal());
        this.resetBtn.addEventListener('click', () => this.resetGraph());
        this.nodeCountInput.addEventListener('change', () => this.updateStartNodeOptions());
    }

    selectAlgorithm(algorithm) {
        this.currentAlgorithm = algorithm;
        
        // Update button states
        document.querySelectorAll('.algorithm-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        if (algorithm === 'bfs') {
            this.bfsBtn.classList.add('active');
        } else {
            this.dfsBtn.classList.add('active');
        }
    }

    updateStartNodeOptions() {
        const nodeCount = parseInt(this.nodeCountInput.value);
        const startNodeSelect = this.startNodeSelect;
        
        // Clear existing options
        startNodeSelect.innerHTML = '';
        
        // Add options based on node count
        for (let i = 0; i < nodeCount; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = String.fromCharCode(65 + i);
            startNodeSelect.appendChild(option);
        }
    }

    generateGraph() {
        const nodeCount = parseInt(this.nodeCountInput.value);
        this.nodes = [];
        this.links = [];
        this.graph = Array(nodeCount).fill().map(() => []);
        
        // Generate nodes in a circle
        for (let i = 0; i < nodeCount; i++) {
            const angle = (2 * Math.PI * i) / nodeCount;
            const radius = Math.min(150, 200 - nodeCount * 5);
            const centerX = this.width / 2;
            const centerY = this.height / 2;
            
            this.nodes.push({
                id: i,
                label: String.fromCharCode(65 + i),
                x: centerX + radius * Math.cos(angle),
                y: centerY + radius * Math.sin(angle)
            });
        }

        // Ensure connectivity with a cycle
        for (let i = 0; i < nodeCount; i++) {
            const next = (i + 1) % nodeCount;
            if (!this.graph[i].includes(next)) {
                this.graph[i].push(next);
                this.graph[next].push(i);
                this.links.push({ source: this.nodes[i], target: this.nodes[next] });
            }
        }

        // Add additional edges
        const additionalEdges = Math.min(Math.floor(nodeCount * 0.4), nodeCount - 1);
        let edgesAdded = 0;
        let attempts = 0;
        
        while (edgesAdded < additionalEdges && attempts < nodeCount * 2) {
            const from = Math.floor(Math.random() * nodeCount);
            const to = Math.floor(Math.random() * nodeCount);
            
            if (from !== to && !this.graph[from].includes(to)) {
                this.graph[from].push(to);
                this.graph[to].push(from);
                this.links.push({ source: this.nodes[from], target: this.nodes[to] });
                edgesAdded++;
            }
            attempts++;
        }

        console.log('Generated graph:', this.nodes.length, 'nodes,', this.links.length, 'links');
        this.renderGraph();
        this.resetStats();
    }

    renderGraph() {
        // Clear previous content
        this.g.selectAll('*').remove();

        console.log('Rendering graph with', this.nodes.length, 'nodes and', this.links.length, 'links');

        // Update simulation
        this.simulation.nodes(this.nodes);
        this.simulation.force('link').links(this.links);

        // Links
        const link = this.g.selectAll('.link')
            .data(this.links)
            .join('line')
            .attr('class', 'link')
            .attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y);

        // Nodes
        const node = this.g.selectAll('.node')
            .data(this.nodes)
            .join('g')
            .attr('class', 'node')
            .attr('transform', d => `translate(${d.x},${d.y})`)
            .call(this.drag(this.simulation));

        node.append('circle')
            .attr('r', 25);

        node.append('text')
            .text(d => d.label)
            .attr('dy', '0.31em');

        // Update positions on simulation tick
        this.simulation.on('tick', () => {
            link
                .attr('x1', d => d.source.x)
                .attr('y1', d => d.source.y)
                .attr('x2', d => d.target.x)
                .attr('y2', d => d.target.y);

            node
                .attr('transform', d => `translate(${d.x},${d.y})`);
        });

        // Start simulation
        this.simulation.alpha(1).restart();
    }

    drag(simulation) {
        function dragstarted(event) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            event.subject.fx = event.subject.x;
            event.subject.fy = event.subject.y;
        }

        function dragged(event) {
            event.subject.fx = event.x;
            event.subject.fy = event.y;
        }

        function dragended(event) {
            if (!event.active) simulation.alphaTarget(0);
            event.subject.fx = null;
            event.subject.fy = null;
        }

        return d3.drag()
            .on('start', dragstarted)
            .on('drag', dragged)
            .on('end', dragended);
    }

    async startTraversal() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.startBtn.disabled = true;
        this.resetStats();
        this.startTime = performance.now();

        const startNode = parseInt(this.startNodeSelect.value);
        this.visitedNodes.clear();
        this.traversedEdges.clear();

        if (this.currentAlgorithm === 'bfs') {
            await this.bfs(startNode);
        } else {
            await this.dfs(startNode);
        }

        this.isRunning = false;
        this.startBtn.disabled = false;
        this.updateDuration();
    }

    async bfs(startNode) {
        const queue = [startNode];
        const visited = new Set();
        
        while (queue.length > 0) {
            const current = queue.shift();
            
            if (visited.has(current)) continue;
            
            visited.add(current);
            this.visitedNodes.add(current);
            this.updateStats();
            this.highlightNode(current, 'current');
            
            await this.delay(800);
            
            this.highlightNode(current, 'visited');
            
            // Add neighbors to queue
            for (const neighbor of this.graph[current]) {
                if (!visited.has(neighbor) && !queue.includes(neighbor)) {
                    queue.push(neighbor);
                    this.highlightEdge(current, neighbor, 'current');
                    await this.delay(400);
                    this.highlightEdge(current, neighbor, 'visited');
                }
            }
        }
    }

    async dfs(startNode) {
        const stack = [startNode];
        const visited = new Set();
        
        while (stack.length > 0) {
            const current = stack.pop();
            
            if (visited.has(current)) continue;
            
            visited.add(current);
            this.visitedNodes.add(current);
            this.updateStats();
            this.highlightNode(current, 'current');
            
            await this.delay(800);
            
            this.highlightNode(current, 'visited');
            
            // Add neighbors to stack (in reverse order for consistent traversal)
            const neighbors = [...this.graph[current]].reverse();
            for (const neighbor of neighbors) {
                if (!visited.has(neighbor) && !stack.includes(neighbor)) {
                    stack.push(neighbor);
                    this.highlightEdge(current, neighbor, 'current');
                    await this.delay(400);
                    this.highlightEdge(current, neighbor, 'visited');
                }
            }
        }
    }

    highlightNode(nodeId, state) {
        this.g.selectAll('.node')
            .filter(d => d.id === nodeId)
            .classed('current', state === 'current')
            .classed('visited', state === 'visited');
    }

    highlightEdge(sourceId, targetId, state) {
        this.g.selectAll('.link')
            .filter(d => 
                (d.source.id === sourceId && d.target.id === targetId) ||
                (d.source.id === targetId && d.target.id === sourceId)
            )
            .classed('current', state === 'current')
            .classed('visited', state === 'visited');
    }

    resetGraph() {
        this.visitedNodes.clear();
        this.traversedEdges.clear();
        this.renderGraph();
        this.resetStats();
    }

    resetStats() {
        this.visitedNodes.clear();
        this.traversedEdges.clear();
        this.startTime = 0;
        this.updateStats();
    }

    updateStats() {
        this.nodesVisitedEl.textContent = this.visitedNodes.size;
        this.edgesTraversedEl.textContent = this.traversedEdges.size;
    }

    updateDuration() {
        const duration = Math.round(performance.now() - this.startTime);
        this.timeEl.textContent = `${duration}ms`;
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize the visualizer when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.graphTraversal = new GraphTraversal();
});
