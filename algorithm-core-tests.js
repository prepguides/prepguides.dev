/**
 * Algorithm Core Logic Tests
 * Tests the actual algorithm implementations independent of UI rendering
 */

// ============================================================================
// BINARY SEARCH TREE CORE LOGIC
// ============================================================================

class BSTNode {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
        this.id = Math.random().toString(36).substr(2, 9);
    }
}

class BinarySearchTree {
    constructor() {
        this.root = null;
        this.operations = 0;
        this.comparisons = 0;
    }

    insert(value) {
        this.operations++;
        this.root = this._insertNode(this.root, value);
    }

    _insertNode(node, value) {
        if (!node) {
            return new BSTNode(value);
        }

        this.comparisons++;
        if (value < node.value) {
            node.left = this._insertNode(node.left, value);
        } else if (value > node.value) {
            node.right = this._insertNode(node.right, value);
        }
        // If value equals node.value, do nothing (no duplicates)

        return node;
    }

    search(value) {
        this.operations++;
        return this._searchNode(this.root, value);
    }

    _searchNode(node, value) {
        if (!node) {
            return false;
        }

        this.comparisons++;
        if (value === node.value) {
            return true;
        } else if (value < node.value) {
            return this._searchNode(node.left, value);
        } else {
            return this._searchNode(node.right, value);
        }
    }

    delete(value) {
        this.operations++;
        this.root = this._deleteNode(this.root, value);
    }

    _deleteNode(node, value) {
        if (!node) return null;

        this.comparisons++;
        if (value < node.value) {
            node.left = this._deleteNode(node.left, value);
        } else if (value > node.value) {
            node.right = this._deleteNode(node.right, value);
        } else {
            // Node to be deleted found
            if (!node.left) return node.right;
            if (!node.right) return node.left;

            // Node with two children: get inorder successor
            const minNode = this._findMin(node.right);
            node.value = minNode.value;
            node.right = this._deleteNode(node.right, minNode.value);
        }

        return node;
    }

    _findMin(node) {
        while (node.left) {
            node = node.left;
        }
        return node;
    }

    inorderTraversal() {
        this.operations++;
        const result = [];
        this._inorder(this.root, result);
        return result;
    }

    _inorder(node, result) {
        if (node) {
            this._inorder(node.left, result);
            result.push(node.value);
            this._inorder(node.right, result);
        }
    }

    getHeight() {
        return this._getHeight(this.root);
    }

    _getHeight(node) {
        if (!node) return 0;
        return 1 + Math.max(this._getHeight(node.left), this._getHeight(node.right));
    }
}

// ============================================================================
// BFS/DFS GRAPH TRAVERSAL CORE LOGIC
// ============================================================================

class Graph {
    constructor(vertices) {
        this.vertices = vertices;
        this.adjacencyList = Array(vertices).fill().map(() => []);
    }

    addEdge(from, to) {
        this.adjacencyList[from].push(to);
        this.adjacencyList[to].push(from); // Undirected graph
    }

    bfs(startVertex) {
        const visited = new Array(this.vertices).fill(false);
        const queue = [startVertex];
        const result = [];
        
        visited[startVertex] = true;

        while (queue.length > 0) {
            const vertex = queue.shift();
            result.push(vertex);

            for (const neighbor of this.adjacencyList[vertex]) {
                if (!visited[neighbor]) {
                    visited[neighbor] = true;
                    queue.push(neighbor);
                }
            }
        }

        return result;
    }

    dfs(startVertex) {
        const visited = new Array(this.vertices).fill(false);
        const result = [];
        
        this._dfsRecursive(startVertex, visited, result);
        return result;
    }

    _dfsRecursive(vertex, visited, result) {
        visited[vertex] = true;
        result.push(vertex);

        for (const neighbor of this.adjacencyList[vertex]) {
            if (!visited[neighbor]) {
                this._dfsRecursive(neighbor, visited, result);
            }
        }
    }

    isConnected() {
        if (this.vertices === 0) return true;
        
        const visited = new Array(this.vertices).fill(false);
        this._dfsRecursive(0, visited, []);
        
        return visited.every(v => v);
    }
}

// ============================================================================
// TRIE CORE LOGIC
// ============================================================================

class TrieNode {
    constructor() {
        this.children = new Map();
        this.isEndOfWord = false;
    }
}

class Trie {
    constructor() {
        this.root = new TrieNode();
    }

    insert(word) {
        let current = this.root;
        
        for (const char of word) {
            if (!current.children.has(char)) {
                current.children.set(char, new TrieNode());
            }
            current = current.children.get(char);
        }
        
        current.isEndOfWord = true;
    }

    search(word) {
        let current = this.root;
        
        for (const char of word) {
            if (!current.children.has(char)) {
                return false;
            }
            current = current.children.get(char);
        }
        
        return current.isEndOfWord;
    }

    startsWith(prefix) {
        let current = this.root;
        
        for (const char of prefix) {
            if (!current.children.has(char)) {
                return false;
            }
            current = current.children.get(char);
        }
        
        return true;
    }

    delete(word) {
        return this._deleteRecursive(this.root, word, 0);
    }

    _deleteRecursive(node, word, index) {
        if (index === word.length) {
            if (!node.isEndOfWord) return false;
            node.isEndOfWord = false;
            return node.children.size === 0;
        }

        const char = word[index];
        const child = node.children.get(char);
        
        if (!child) return false;

        const shouldDeleteChild = this._deleteRecursive(child, word, index + 1);

        if (shouldDeleteChild) {
            node.children.delete(char);
            return node.children.size === 0 && !node.isEndOfWord;
        }

        return false;
    }

    getAllWords() {
        const words = [];
        this._getAllWordsRecursive(this.root, '', words);
        return words;
    }

    _getAllWordsRecursive(node, prefix, words) {
        if (node.isEndOfWord) {
            words.push(prefix);
        }

        for (const [char, child] of node.children) {
            this._getAllWordsRecursive(child, prefix + char, words);
        }
    }
}

// ============================================================================
// SORTING ALGORITHMS CORE LOGIC
// ============================================================================

class SortingAlgorithms {
    static bubbleSort(arr) {
        const result = [...arr];
        const comparisons = [];
        const swaps = [];
        
        for (let i = 0; i < result.length - 1; i++) {
            for (let j = 0; j < result.length - i - 1; j++) {
                comparisons.push([j, j + 1]);
                if (result[j] > result[j + 1]) {
                    [result[j], result[j + 1]] = [result[j + 1], result[j]];
                    swaps.push([j, j + 1]);
                }
            }
        }
        
        return { result, comparisons, swaps };
    }

    static selectionSort(arr) {
        const result = [...arr];
        const comparisons = [];
        const swaps = [];
        
        for (let i = 0; i < result.length - 1; i++) {
            let minIndex = i;
            for (let j = i + 1; j < result.length; j++) {
                comparisons.push([i, j]);
                if (result[j] < result[minIndex]) {
                    minIndex = j;
                }
            }
            if (minIndex !== i) {
                [result[i], result[minIndex]] = [result[minIndex], result[i]];
                swaps.push([i, minIndex]);
            }
        }
        
        return { result, comparisons, swaps };
    }

    static insertionSort(arr) {
        const result = [...arr];
        const comparisons = [];
        const swaps = [];
        
        for (let i = 1; i < result.length; i++) {
            let j = i;
            while (j > 0 && result[j] < result[j - 1]) {
                comparisons.push([j, j - 1]);
                [result[j], result[j - 1]] = [result[j - 1], result[j]];
                swaps.push([j, j - 1]);
                j--;
            }
        }
        
        return { result, comparisons, swaps };
    }

    static mergeSort(arr) {
        const result = [...arr];
        const comparisons = [];
        const swaps = [];
        
        this._mergeSortRecursive(result, 0, result.length - 1, comparisons, swaps);
        
        return { result, comparisons, swaps };
    }

    static _mergeSortRecursive(arr, left, right, comparisons, swaps) {
        if (left < right) {
            const mid = Math.floor((left + right) / 2);
            this._mergeSortRecursive(arr, left, mid, comparisons, swaps);
            this._mergeSortRecursive(arr, mid + 1, right, comparisons, swaps);
            this._merge(arr, left, mid, right, comparisons, swaps);
        }
    }

    static _merge(arr, left, mid, right, comparisons, swaps) {
        const leftArr = arr.slice(left, mid + 1);
        const rightArr = arr.slice(mid + 1, right + 1);
        
        let i = 0, j = 0, k = left;
        
        while (i < leftArr.length && j < rightArr.length) {
            comparisons.push([left + i, mid + 1 + j]);
            if (leftArr[i] <= rightArr[j]) {
                arr[k] = leftArr[i];
                i++;
            } else {
                arr[k] = rightArr[j];
                j++;
            }
            k++;
        }
        
        while (i < leftArr.length) {
            arr[k] = leftArr[i];
            i++;
            k++;
        }
        
        while (j < rightArr.length) {
            arr[k] = rightArr[j];
            j++;
            k++;
        }
    }

    static quickSort(arr) {
        const result = [...arr];
        const comparisons = [];
        const swaps = [];
        
        this._quickSortRecursive(result, 0, result.length - 1, comparisons, swaps);
        
        return { result, comparisons, swaps };
    }

    static _quickSortRecursive(arr, low, high, comparisons, swaps) {
        if (low < high) {
            const pivotIndex = this._partition(arr, low, high, comparisons, swaps);
            this._quickSortRecursive(arr, low, pivotIndex - 1, comparisons, swaps);
            this._quickSortRecursive(arr, pivotIndex + 1, high, comparisons, swaps);
        }
    }

    static _partition(arr, low, high, comparisons, swaps) {
        const pivot = arr[high];
        let i = low - 1;
        
        for (let j = low; j < high; j++) {
            comparisons.push([j, high]);
            if (arr[j] < pivot) {
                i++;
                [arr[i], arr[j]] = [arr[j], arr[i]];
                swaps.push([i, j]);
            }
        }
        
        [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
        swaps.push([i + 1, high]);
        
        return i + 1;
    }
}

// ============================================================================
// TESTING FRAMEWORK
// ============================================================================

class AlgorithmTester {
    constructor() {
        this.results = {
            bst: { passed: 0, failed: 0, tests: [] },
            graph: { passed: 0, failed: 0, tests: [] },
            trie: { passed: 0, failed: 0, tests: [] },
            sorting: { passed: 0, failed: 0, tests: [] }
        };
    }

    runAllTests() {
        console.log('🧪 Starting Algorithm Core Logic Tests...\n');
        
        this.testBST();
        this.testGraph();
        this.testTrie();
        this.testSorting();
        
        this.printResults();
    }

    testBST() {
        console.log('🌳 Testing Binary Search Tree...');
        
        const bst = new BinarySearchTree();
        
        // Test 1: Insert and search
        bst.insert(5);
        bst.insert(3);
        bst.insert(7);
        bst.insert(1);
        bst.insert(9);
        
        this.assert(bst.search(5), 'BST: Search for existing value (5)');
        this.assert(bst.search(3), 'BST: Search for existing value (3)');
        this.assert(!bst.search(10), 'BST: Search for non-existing value (10)');
        
        // Test 2: Inorder traversal
        const inorder = bst.inorderTraversal();
        this.assert(JSON.stringify(inorder) === JSON.stringify([1, 3, 5, 7, 9]), 'BST: Inorder traversal');
        
        // Test 3: Delete
        bst.delete(3);
        this.assert(!bst.search(3), 'BST: Delete existing value');
        this.assert(bst.search(5), 'BST: Other values still exist after delete');
        
        // Test 4: Height
        const height = bst.getHeight();
        this.assert(height >= 2 && height <= 4, 'BST: Height calculation');
        
        console.log(`   ✅ BST Tests: ${this.results.bst.passed} passed, ${this.results.bst.failed} failed\n`);
    }

    testGraph() {
        console.log('🕸️ Testing Graph Traversal...');
        
        const graph = new Graph(6);
        graph.addEdge(0, 1);
        graph.addEdge(0, 2);
        graph.addEdge(1, 3);
        graph.addEdge(2, 4);
        graph.addEdge(3, 5);
        
        // Test 1: Connectivity
        this.assert(graph.isConnected(), 'Graph: Is connected');
        
        // Test 2: BFS
        const bfsResult = graph.bfs(0);
        this.assert(bfsResult.length === 6, 'Graph: BFS visits all nodes');
        this.assert(bfsResult[0] === 0, 'Graph: BFS starts from correct node');
        
        // Test 3: DFS
        const dfsResult = graph.dfs(0);
        this.assert(dfsResult.length === 6, 'Graph: DFS visits all nodes');
        this.assert(dfsResult[0] === 0, 'Graph: DFS starts from correct node');
        
        // Test 4: Different starting points
        const bfsFrom1 = graph.bfs(1);
        this.assert(bfsFrom1.length === 6, 'Graph: BFS from different start');
        
        console.log(`   ✅ Graph Tests: ${this.results.graph.passed} passed, ${this.results.graph.failed} failed\n`);
    }

    testTrie() {
        console.log('📝 Testing Trie Operations...');
        
        const trie = new Trie();
        
        // Test 1: Insert and search
        trie.insert('cat');
        trie.insert('car');
        trie.insert('card');
        trie.insert('care');
        
        this.assert(trie.search('cat'), 'Trie: Search existing word (cat)');
        this.assert(trie.search('car'), 'Trie: Search existing word (car)');
        this.assert(!trie.search('ca'), 'Trie: Search non-existing word (ca)');
        this.assert(!trie.search('cats'), 'Trie: Search non-existing word (cats)');
        
        // Test 2: Prefix search
        this.assert(trie.startsWith('ca'), 'Trie: Prefix search (ca)');
        this.assert(trie.startsWith('car'), 'Trie: Prefix search (car)');
        this.assert(!trie.startsWith('xyz'), 'Trie: Prefix search non-existing');
        
        // Test 3: Delete
        trie.delete('car');
        this.assert(!trie.search('car'), 'Trie: Delete existing word');
        this.assert(trie.search('card'), 'Trie: Other words still exist after delete');
        
        // Test 4: Get all words
        const allWords = trie.getAllWords();
        this.assert(allWords.includes('cat'), 'Trie: Get all words includes cat');
        this.assert(allWords.includes('card'), 'Trie: Get all words includes card');
        this.assert(!allWords.includes('car'), 'Trie: Get all words excludes deleted word');
        
        console.log(`   ✅ Trie Tests: ${this.results.trie.passed} passed, ${this.results.trie.failed} failed\n`);
    }

    testSorting() {
        console.log('🔢 Testing Sorting Algorithms...');
        
        const testArray = [64, 34, 25, 12, 22, 11, 90];
        const expected = [11, 12, 22, 25, 34, 64, 90];
        
        // Test 1: Bubble Sort
        const bubbleResult = SortingAlgorithms.bubbleSort(testArray);
        this.assert(JSON.stringify(bubbleResult.result) === JSON.stringify(expected), 'Sorting: Bubble sort');
        
        // Test 2: Selection Sort
        const selectionResult = SortingAlgorithms.selectionSort(testArray);
        this.assert(JSON.stringify(selectionResult.result) === JSON.stringify(expected), 'Sorting: Selection sort');
        
        // Test 3: Insertion Sort
        const insertionResult = SortingAlgorithms.insertionSort(testArray);
        this.assert(JSON.stringify(insertionResult.result) === JSON.stringify(expected), 'Sorting: Insertion sort');
        
        // Test 4: Merge Sort
        const mergeResult = SortingAlgorithms.mergeSort(testArray);
        this.assert(JSON.stringify(mergeResult.result) === JSON.stringify(expected), 'Sorting: Merge sort');
        
        // Test 5: Quick Sort
        const quickResult = SortingAlgorithms.quickSort(testArray);
        this.assert(JSON.stringify(quickResult.result) === JSON.stringify(expected), 'Sorting: Quick sort');
        
        // Test 6: Edge cases
        const emptyArray = SortingAlgorithms.bubbleSort([]);
        this.assert(emptyArray.result.length === 0, 'Sorting: Empty array');
        
        const singleElement = SortingAlgorithms.bubbleSort([42]);
        this.assert(JSON.stringify(singleElement.result) === JSON.stringify([42]), 'Sorting: Single element');
        
        console.log(`   ✅ Sorting Tests: ${this.results.sorting.passed} passed, ${this.results.sorting.failed} failed\n`);
    }

    assert(condition, testName) {
        const category = testName.split(':')[0].toLowerCase();
        if (category.includes('bst')) {
            this.results.bst.tests.push({ name: testName, passed: condition });
            if (condition) this.results.bst.passed++; else this.results.bst.failed++;
        } else if (category.includes('graph')) {
            this.results.graph.tests.push({ name: testName, passed: condition });
            if (condition) this.results.graph.passed++; else this.results.graph.failed++;
        } else if (category.includes('trie')) {
            this.results.trie.tests.push({ name: testName, passed: condition });
            if (condition) this.results.trie.passed++; else this.results.trie.failed++;
        } else if (category.includes('sorting')) {
            this.results.sorting.tests.push({ name: testName, passed: condition });
            if (condition) this.results.sorting.passed++; else this.results.sorting.failed++;
        }
        
        if (condition) {
            console.log(`   ✅ ${testName}`);
        } else {
            console.log(`   ❌ ${testName}`);
        }
    }

    printResults() {
        console.log('📊 Test Results Summary:');
        console.log('========================');
        
        const totalPassed = Object.values(this.results).reduce((sum, r) => sum + r.passed, 0);
        const totalFailed = Object.values(this.results).reduce((sum, r) => sum + r.failed, 0);
        const totalTests = totalPassed + totalFailed;
        
        console.log(`🌳 BST: ${this.results.bst.passed}/${this.results.bst.passed + this.results.bst.failed} tests passed`);
        console.log(`🕸️ Graph: ${this.results.graph.passed}/${this.results.graph.passed + this.results.graph.failed} tests passed`);
        console.log(`📝 Trie: ${this.results.trie.passed}/${this.results.trie.passed + this.results.trie.failed} tests passed`);
        console.log(`🔢 Sorting: ${this.results.sorting.passed}/${this.results.sorting.passed + this.results.sorting.failed} tests passed`);
        console.log(`\n🎯 Overall: ${totalPassed}/${totalTests} tests passed (${Math.round(totalPassed/totalTests*100)}%)`);
        
        if (totalFailed === 0) {
            console.log('\n🎉 All algorithm core logic tests passed!');
        } else {
            console.log(`\n⚠️ ${totalFailed} tests failed. Check the implementation.`);
        }
    }
}

// ============================================================================
// EXPORT FOR TESTING
// ============================================================================

if (typeof module !== 'undefined' && module.exports) {
    // Node.js environment
    module.exports = {
        BinarySearchTree,
        Graph,
        Trie,
        SortingAlgorithms,
        AlgorithmTester
    };
} else {
    // Browser environment
    window.AlgorithmTester = AlgorithmTester;
    window.BinarySearchTree = BinarySearchTree;
    window.Graph = Graph;
    window.Trie = Trie;
    window.SortingAlgorithms = SortingAlgorithms;
}

// Auto-run tests if in browser
if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
        const tester = new AlgorithmTester();
        tester.runAllTests();
    });
}
