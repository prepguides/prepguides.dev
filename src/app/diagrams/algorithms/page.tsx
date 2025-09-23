import Link from 'next/link'
import { ArrowRightIcon, CodeBracketIcon, ClockIcon, ChartBarIcon } from '@heroicons/react/24/outline'

const algorithms = [
  {
    title: 'Sorting Algorithms',
    description: 'Interactive visualization of 6 sorting algorithms with real-time statistics',
    href: '/diagrams/algorithms/sorting',
    icon: <ChartBarIcon className="h-8 w-8" />,
    color: 'bg-blue-500',
    algorithms: ['Bubble Sort', 'Selection Sort', 'Insertion Sort', 'Merge Sort', 'Quick Sort', 'Heap Sort'],
    complexity: 'O(n log n) to O(n²)',
    difficulty: 'Beginner'
  },
  {
    title: 'Searching Algorithms',
    description: 'Binary search, linear search, and advanced searching techniques',
    href: '/diagrams/algorithms/searching',
    icon: <CodeBracketIcon className="h-8 w-8" />,
    color: 'bg-green-500',
    algorithms: ['Linear Search', 'Binary Search', 'Jump Search', 'Interpolation Search'],
    complexity: 'O(log n) to O(n)',
    difficulty: 'Beginner'
  },
  {
    title: 'Graph Algorithms',
    description: 'BFS, DFS, shortest path, and minimum spanning tree algorithms',
    href: '/diagrams/algorithms/graph',
    icon: <ChartBarIcon className="h-8 w-8" />,
    color: 'bg-purple-500',
    algorithms: ['BFS', 'DFS', "Dijkstra's", "Kruskal's", "Prim's"],
    complexity: 'O(V + E) to O(V²)',
    difficulty: 'Intermediate'
  },
  {
    title: 'Dynamic Programming',
    description: 'Memoization, tabulation, and optimization techniques',
    href: '/diagrams/algorithms/dynamic-programming',
    icon: <ClockIcon className="h-8 w-8" />,
    color: 'bg-orange-500',
    algorithms: ['Fibonacci', 'Knapsack', 'LCS', 'Edit Distance', 'Coin Change'],
    complexity: 'O(n²) to O(n³)',
    difficulty: 'Advanced'
  }
]

function AlgorithmCard({ algorithm }: { algorithm: typeof algorithms[0] }) {
  return (
    <Link href={algorithm.href} className="group">
      <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 group-hover:scale-105">
        <div className="flex items-start space-x-4">
          <div className={`${algorithm.color} p-3 rounded-lg text-white`}>
            {algorithm.icon}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2">{algorithm.title}</h3>
            <p className="text-gray-600 mb-4">{algorithm.description}</p>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-500">Algorithms:</span>
                <span className="text-sm text-gray-700">{algorithm.algorithms.join(', ')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-500">Complexity:</span>
                <span className="text-sm text-gray-700">{algorithm.complexity}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-500">Difficulty:</span>
                <span className={`text-sm px-2 py-1 rounded-full ${
                  algorithm.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                  algorithm.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {algorithm.difficulty}
                </span>
              </div>
            </div>
            
            <div className="flex items-center text-blue-600 group-hover:text-blue-700">
              <span className="text-sm font-medium">Explore Visualizations</span>
              <ArrowRightIcon className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default function AlgorithmsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8">
            <h1 className="text-3xl font-bold text-gray-900">Algorithm Visualizations</h1>
            <p className="mt-2 text-lg text-gray-600">
              Master algorithms through interactive visualizations and step-by-step explanations
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Introduction */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Algorithm Visualizations?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <p className="text-gray-600 mb-4">
                Understanding algorithms is crucial for technical interviews and software development. 
                Our interactive visualizations help you:
              </p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  See algorithms in action with real-time animations
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Track performance metrics and complexity analysis
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Understand step-by-step execution with code highlights
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Practice with different input sizes and configurations
                </li>
              </ul>
            </div>
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="font-semibold text-blue-900 mb-3">Interview Tips</h3>
              <ul className="space-y-2 text-blue-800 text-sm">
                <li>• Always start with the brute force approach</li>
                <li>• Discuss time and space complexity</li>
                <li>• Consider edge cases and optimizations</li>
                <li>• Walk through examples step by step</li>
                <li>• Be ready to implement on a whiteboard</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Algorithm Categories */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold text-gray-900">Algorithm Categories</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {algorithms.map((algorithm) => (
              <AlgorithmCard key={algorithm.href} algorithm={algorithm} />
            ))}
          </div>
        </div>

        {/* Complexity Reference */}
        <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Time Complexity Reference</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">Complexity</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">Name</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">Example</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">Performance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-3 font-mono text-green-600">O(1)</td>
                  <td className="px-4 py-3">Constant</td>
                  <td className="px-4 py-3">Array access, hash table lookup</td>
                  <td className="px-4 py-3 text-green-600">Excellent</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-mono text-green-600">O(log n)</td>
                  <td className="px-4 py-3">Logarithmic</td>
                  <td className="px-4 py-3">Binary search, balanced tree operations</td>
                  <td className="px-4 py-3 text-green-600">Excellent</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-mono text-yellow-600">O(n)</td>
                  <td className="px-4 py-3">Linear</td>
                  <td className="px-4 py-3">Linear search, single loop</td>
                  <td className="px-4 py-3 text-yellow-600">Good</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-mono text-yellow-600">O(n log n)</td>
                  <td className="px-4 py-3">Linearithmic</td>
                  <td className="px-4 py-3">Merge sort, heap sort</td>
                  <td className="px-4 py-3 text-yellow-600">Good</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-mono text-orange-600">O(n²)</td>
                  <td className="px-4 py-3">Quadratic</td>
                  <td className="px-4 py-3">Bubble sort, nested loops</td>
                  <td className="px-4 py-3 text-orange-600">Fair</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-mono text-red-600">O(2ⁿ)</td>
                  <td className="px-4 py-3">Exponential</td>
                  <td className="px-4 py-3">Recursive Fibonacci, brute force</td>
                  <td className="px-4 py-3 text-red-600">Poor</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Master Algorithms?</h2>
          <p className="text-lg mb-6 opacity-90">
            Start with our sorting algorithms visualizer and work your way up to advanced topics
          </p>
          <Link 
            href="/diagrams/algorithms/sorting"
            className="inline-flex items-center px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
          >
            Start with Sorting Algorithms
            <ArrowRightIcon className="h-5 w-5 ml-2" />
          </Link>
        </div>
      </div>
    </div>
  )
}
