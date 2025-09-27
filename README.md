# PrepGuides.dev

**Master technical interviews with interactive diagrams and comprehensive guides for cloud computing, containerization, and distributed systems.**

## 🌐 Live Site

Visit [prepguides.dev](https://prepguides.dev) to explore interactive diagrams and interview resources.

## 🚀 What's Included

### Interactive Learning Tools
- **Algorithm Visualizations** - 6 interactive algorithm visualizations with real-time performance metrics
  - **Sorting Algorithms** - 6 sorting algorithms (Bubble, Selection, Insertion, Merge, Quick, Heap)
  - **Binary Search Tree** - Insert, delete, search, and traversal operations
  - **BFS/DFS Graph Traversal** - Breadth-first and depth-first search algorithms
  - **Trie Operations** - Prefix tree with insert, search, and delete operations
  - **Dijkstra's Algorithm** - Shortest path finding in weighted graphs
  - **Dynamic Programming** - Knapsack and Longest Common Subsequence problems
- **Kubernetes Request Flow** - Complete bidirectional network flow with step-by-step explanations
- **OSI 7-Layer Model** - Fundamental networking concepts with detailed layer information
- **Interview Questions** - Curated questions for each diagram topic

### Technical Topics Covered
- **Algorithms** - Sorting, searching, and data structures with live visualizations
- **Kubernetes** - Container orchestration, microservices, and cluster architecture
- **Networking** - OSI model, TCP/IP, protocols, and network troubleshooting
- **System Design** - Scalability patterns, caching strategies, and architecture design
- **Databases** - Replication, sharding, ACID properties, and CAP theorem
- **Microservices** - Service mesh, API gateways, and distributed systems

## 🎯 Perfect For

### Technical Interview Preparation
- **System Design Interviews** - Visual explanations of complex architectures
- **Coding Interviews** - Interactive algorithm visualizations
- **DevOps Interviews** - Kubernetes and networking concepts
- **Architecture Discussions** - Scalability and design patterns

### Learning & Understanding
- **Visual Learning** - Complex concepts made simple through diagrams
- **Step-by-Step Explanations** - Break down complex processes
- **Real-World Examples** - Practical scenarios and use cases
- **Interview Practice** - Common questions and answers

## 📊 Interactive Features

### Sorting Algorithms Visualizer
- **6 Algorithms**: Bubble Sort, Selection Sort, Insertion Sort, Merge Sort, Quick Sort, Heap Sort
- **Real-time Metrics**: Comparisons, swaps, and execution time
- **Adjustable Parameters**: Array size and animation speed
- **Performance Analysis**: Time and space complexity for each algorithm

### Kubernetes Request Flow
- **Complete Flow**: External client → Load balancer → Ingress → Service → Pod
- **Component Explanations**: What each component does and why it's needed
- **Troubleshooting Guide**: Common issues and debugging strategies
- **Interview Questions**: System design and technical deep-dive questions

### OSI 7-Layer Model
- **Layer-by-Layer Breakdown**: Detailed explanation of each layer
- **Protocol Examples**: HTTP, TCP, IP, Ethernet, and more
- **Data Flow Process**: How data moves through the layers
- **Troubleshooting Approach**: Systematic debugging methodology

## 🛠️ Quick Start

### Local Development
```bash
# Clone the repository
git clone https://github.com/prepguides/prepguides.dev.git
cd prepguides.dev

# Start local server
./serve.sh

# Open http://localhost:8000 in your browser
```

### Adding Your Own Content
1. **Add HTML files** to the `public/diagrams/` directory
2. **Create new pages** following the existing structure
3. **Update navigation** in `index.html`
4. **Deploy to Vercel** - automatic deployment on push

### Documentation and Testing
- **Documentation**: All project docs are organized in the `docs/` directory
- **Testing**: Test files and resources are in the `tests/` directory
- **Development**: Follow the workflow in `docs/development/DEVELOPMENT_WORKFLOW.md`
- **Algorithm Development**: Use the template in `docs/algorithm/ALGORITHM_TEMPLATE.html`

## 🎨 Content Structure

```
├── index.html              # Main navigation hub
├── algorithms.html         # Algorithm visualizations index
├── kubernetes.html         # K8s request flow diagram
├── networking.html         # OSI model diagram
├── databases.html          # Database concepts (coming soon)
├── microservices.html      # Service architecture (coming soon)
├── system-design.html      # Scalability patterns (coming soon)
├── algorithms/             # Interactive algorithm visualizations
│   ├── sorting.html        # 6 sorting algorithms
│   ├── binary-search-tree.html  # BST operations with explicit positioning
│   ├── bfs-dfs-graph-traversal.html  # Graph traversal
│   ├── trie-operations.html     # Trie data structure
│   ├── binary-heap.html         # Min/Max heap operations
│   ├── dijkstra-algorithm.html  # Shortest path algorithm
│   ├── segment-tree.html        # Range queries and tree construction
│   ├── dynamic-programming.html # DP concepts and examples
│   └── code/                    # Shared code and styles
│       ├── algorithm-layout.css # Generic layout styles
│       ├── code-highlighting.css # Syntax highlighting
│       └── code-execution-sync.js # Code synchronization
├── docs/                   # Project documentation
│   ├── algorithm/          # Algorithm development docs
│   ├── development/        # Development workflow docs
│   ├── testing/           # Testing documentation
│   └── reports/           # Issue reports and fixes
├── tests/                  # Testing files and resources
│   ├── core/              # Core algorithm tests
│   └── visualization/     # UI and visualization tests
└── public/diagrams/        # Static diagrams and resources
    ├── algorithms/
    ├── kubernetes/
    ├── networking/
    └── ...
```

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Automatic deployment on every push
4. Custom domain support

### Other Platforms
- **Netlify**: Drag and drop the folder
- **GitHub Pages**: Enable in repository settings
- **Any Static Host**: Upload the files directly

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Add New Diagrams** - Create interactive visualizations
2. **Improve Explanations** - Make concepts clearer
3. **Add Interview Questions** - Expand question banks
4. **Fix Issues** - Report bugs or submit fixes
5. **Suggest Topics** - What would you like to see?

## 📈 Roadmap

### Phase 1 - Essential (Complete - 6/6 ✅)
- ✅ **Sorting Algorithms** - 6 sorting algorithms with performance metrics
- ✅ **Binary Search Tree** - Complete BST operations with explicit left/right positioning
- ✅ **BFS/DFS Graph Traversal** - Graph traversal algorithms
- ✅ **Trie Operations** - Prefix tree with D3.js visualization
- ✅ **Binary Heap Operations** - Min/Max heap with insert, extract, and heapify
- ✅ **Dijkstra's Algorithm** - Shortest path finding in weighted graphs

### Phase 2 - Important (In Progress - 1/4 Complete)
- ✅ **Segment Tree** - Range queries and tree construction with sum/min/max operations
- **KMP String Matching** - Pattern matching with failure function
- **Topological Sort** - DAG ordering and dependency resolution
- **Union-Find** - Disjoint sets with path compression

### Phase 3 - Advanced (Planned)
- **A* Pathfinding** - Heuristic search with grid visualization
- **Red-Black Tree** - Self-balancing tree with color properties
- **Maximum Flow** - Network flow with capacity constraints
- **Convex Hull** - Computational geometry algorithms
- **B-Tree Operations** - Multi-way trees for database indexing

### Other Topics
- **Database Diagrams** - Replication, sharding, and indexing
- **Microservices Architecture** - Service mesh and API gateways
- **System Design Patterns** - Caching, load balancing, and scaling
- **Interactive Quizzes** - Test your knowledge

### Future Features
- **Dark Mode** - Toggle between light and dark themes
- **Search Functionality** - Find content quickly
- **User Progress** - Track learning progress
- **Mobile App** - Native mobile experience

## 💡 Usage Tips

1. **Study the Complete Flow** - Don't just memorize individual components
2. **Practice Explaining** - Use the diagrams to practice verbal explanations
3. **Understand Failures** - Know what happens when each component fails
4. **Scale Considerations** - Think about how systems behave under load
5. **Security Implications** - Understand security at each layer

## 📄 License

This project is open source and available under the MIT License.

---

**Built with ❤️ for the developer community**

*Helping developers excel in technical interviews through visual learning and comprehensive guides.*