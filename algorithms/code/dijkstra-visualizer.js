class DijkstraVisualizer {
    constructor() {
        this.nodes = [];
        this.links = [];
        this.graph = [];
        this.distances = [];
        this.previous = [];
        this.visited = new Set();
        this.priorityQueue = [];
        this.isRunning = false;
        this.startTime = 0;
        
        // D3.js setup
        this.svg = d3.select('#graphSvg');
        this.width = 800;
        this.height = 500;
        
        // Group for zoom/pan
        this.g = this.svg.append('g');

        // Force simulation
        this.simulation = d3.forceSimulation()
            .force('link', d3.forceLink().id(d => d.id).distance(120))
            .force('charge', d3.forceManyBody().strength(-400))
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
        this.startNodeSelect = document.getElementById('startNode');
        this.endNodeSelect = document.getElementById('endNode');
        this.speedSlider = document.getElementById('speed');
        this.speedValue = document.getElementById('speedValue');
        this.generateBtn = document.getElementById('generate');
        this.startBtn = document.getElementById('start');
        this.resetBtn = document.getElementById('reset');
        this.nodesVisitedEl = document.getElementById('nodesVisited');
        this.shortestDistanceEl = document.getElementById('shortestDistance');
        this.timeEl = document.getElementById('time');
    }

    setupEventListeners() {
        this.generateBtn.addEventListener('click', () => this.generateGraph());
        this.startBtn.addEventListener('click', () => this.startDijkstra());
        this.resetBtn.addEventListener('click', () => this.resetGraph());
        this.speedSlider.addEventListener('input', (e) => {
            this.speedValue.textContent = e.target.value;
        });
    }

    generateGraph() {
        const nodeCount = 6;
        this.nodes = [];
        this.links = [];
        this.graph = Array(nodeCount).fill().map(() => []);
        
        // Generate nodes in a circle
        for (let i = 0; i < nodeCount; i++) {
            const angle = (2 * Math.PI * i) / nodeCount;
            const radius = 150;
            const centerX = this.width / 2;
            const centerY = this.height / 2;
            
            this.nodes.push({
                id: i,
                label: String.fromCharCode(65 + i),
                x: centerX + radius * Math.cos(angle),
                y: centerY + radius * Math.sin(angle)
            });
        }

        // Create weighted edges
        const edges = [
            { from: 0, to: 1, weight: 4 },
            { from: 0, to: 2, weight: 2 },
            { from: 1, to: 2, weight: 1 },
            { from: 1, to: 3, weight: 5 },
            { from: 2, to: 3, weight: 8 },
            { from: 2, to: 4, weight: 10 },
            { from: 3, to: 4, weight: 2 },
            { from: 3, to: 5, weight: 6 },
            { from: 4, to: 5, weight: 3 }
        ];

        edges.forEach(edge => {
            this.graph[edge.from].push({ to: edge.to, weight: edge.weight });
            this.graph[edge.to].push({ to: edge.from, weight: edge.weight });
            this.links.push({ 
                source: this.nodes[edge.from], 
                target: this.nodes[edge.to], 
                weight: edge.weight 
            });
        });

        this.renderGraph();
        this.resetStats();
    }

    renderGraph() {
        // Clear previous content
        this.g.selectAll('*').remove();

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

        // Link labels (weights)
        const linkLabel = this.g.selectAll('.link-label')
            .data(this.links)
            .join('text')
            .attr('class', 'link-label')
            .attr('x', d => (d.source.x + d.target.x) / 2)
            .attr('y', d => (d.source.y + d.target.y) / 2)
            .text(d => d.weight);

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

        // Distance labels
        const distanceLabel = this.g.selectAll('.distance-label')
            .data(this.nodes)
            .join('text')
            .attr('class', 'distance-label')
            .attr('x', 0)
            .attr('y', 35)
            .text(d => this.distances[d.id] !== undefined ? this.distances[d.id] : '∞');

        // Update positions on simulation tick
        this.simulation.on('tick', () => {
            link
                .attr('x1', d => d.source.x)
                .attr('y1', d => d.source.y)
                .attr('x2', d => d.target.x)
                .attr('y2', d => d.target.y);

            linkLabel
                .attr('x', d => (d.source.x + d.target.x) / 2)
                .attr('y', d => (d.source.y + d.target.y) / 2);

            node
                .attr('transform', d => `translate(${d.x},${d.y})`);

            distanceLabel
                .attr('x', d => d.x)
                .attr('y', d => d.y + 35)
                .text(d => this.distances[d.id] !== undefined ? this.distances[d.id] : '∞');
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

    async startDijkstra() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.startBtn.disabled = true;
        this.resetStats();
        this.startTime = performance.now();

        const startNode = parseInt(this.startNodeSelect.value);
        const endNode = parseInt(this.endNodeSelect.value);

        // Initialize distances
        this.distances = Array(this.nodes.length).fill(Infinity);
        this.previous = Array(this.nodes.length).fill(null);
        this.visited.clear();
        this.priorityQueue = [];

        // Set start node distance to 0
        this.distances[startNode] = 0;
        this.priorityQueue.push({ node: startNode, distance: 0 });

        // Highlight start and end nodes
        this.highlightNode(startNode, 'start');
        this.highlightNode(endNode, 'end');

        await this.dijkstra(startNode, endNode);

        this.isRunning = false;
        this.startBtn.disabled = false;
        this.updateDuration();
    }

    async dijkstra(startNode, endNode) {
        while (this.priorityQueue.length > 0) {
            // Get node with minimum distance
            this.priorityQueue.sort((a, b) => a.distance - b.distance);
            const { node: currentNode, distance: currentDistance } = this.priorityQueue.shift();

            if (this.visited.has(currentNode)) continue;

            // Mark as visited
            this.visited.add(currentNode);
            this.highlightNode(currentNode, 'visited');
            this.updateStats();

            await this.delay(800);

            // If we reached the end node, reconstruct path
            if (currentNode === endNode) {
                await this.reconstructPath(startNode, endNode);
                return;
            }

            // Explore neighbors
            for (const neighbor of this.graph[currentNode]) {
                if (this.visited.has(neighbor.to)) continue;

                const newDistance = currentDistance + neighbor.weight;
                
                if (newDistance < this.distances[neighbor.to]) {
                    this.distances[neighbor.to] = newDistance;
                    this.previous[neighbor.to] = currentNode;
                    
                    this.priorityQueue.push({ 
                        node: neighbor.to, 
                        distance: newDistance 
                    });

                    // Highlight the edge being considered
                    this.highlightEdge(currentNode, neighbor.to, 'current');
                    await this.delay(600);
                    this.highlightEdge(currentNode, neighbor.to, 'visited');
                }
            }

            this.renderGraph();
        }
    }

    async reconstructPath(startNode, endNode) {
        const path = [];
        let currentNode = endNode;

        while (currentNode !== null) {
            path.unshift(currentNode);
            currentNode = this.previous[currentNode];
        }

        // Highlight the shortest path
        for (let i = 0; i < path.length - 1; i++) {
            this.highlightEdge(path[i], path[i + 1], 'shortest');
            await this.delay(400);
        }

        this.shortestDistanceEl.textContent = this.distances[endNode];
    }

    highlightNode(nodeId, state) {
        this.g.selectAll('.node')
            .filter(d => d.id === nodeId)
            .classed('start', state === 'start')
            .classed('end', state === 'end')
            .classed('visited', state === 'visited')
            .classed('current', state === 'current');
    }

    highlightEdge(sourceId, targetId, state) {
        this.g.selectAll('.link')
            .filter(d => 
                (d.source.id === sourceId && d.target.id === targetId) ||
                (d.source.id === targetId && d.target.id === sourceId)
            )
            .classed('current', state === 'current')
            .classed('visited', state === 'visited')
            .classed('shortest', state === 'shortest');
    }

    resetGraph() {
        this.visited.clear();
        this.distances = [];
        this.previous = [];
        this.priorityQueue = [];
        this.renderGraph();
        this.resetStats();
    }

    resetStats() {
        this.visited.clear();
        this.startTime = 0;
        this.updateStats();
        this.shortestDistanceEl.textContent = '∞';
    }

    updateStats() {
        this.nodesVisitedEl.textContent = this.visited.size;
    }

    updateDuration() {
        const duration = Math.round(performance.now() - this.startTime);
        this.timeEl.textContent = `${duration}ms`;
    }

    delay(ms) {
        const speed = parseInt(this.speedSlider.value);
        const adjustedDelay = Math.max(50, ms - (speed - 5) * 100);
        return new Promise(resolve => setTimeout(resolve, adjustedDelay));
    }
}

// Initialize the visualizer when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.dijkstraVisualizer = new DijkstraVisualizer();
});
