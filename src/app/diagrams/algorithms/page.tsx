import Link from 'next/link'
import { ArrowRightIcon, CodeBracketIcon, ClockIcon, ChartBarIcon } from '@heroicons/react/24/outline'

const algorithms = [
  {
    title: 'Sorting Algorithms',
    description: 'Interactive visualization of 6 sorting algorithms with real-time statistics',
    href: '/diagrams/algorithms/sorting',
    icon: <ChartBarIcon className="h-5 w-5" />,
    color: 'bg-blue-500',
    algorithms: ['Bubble Sort', 'Selection Sort', 'Insertion Sort', 'Merge Sort', 'Quick Sort', 'Heap Sort'],
    complexity: 'O(n log n) to O(n²)',
    difficulty: 'Beginner'
  },
  {
    title: 'Searching Algorithms',
    description: 'Binary search, linear search, and advanced searching techniques',
    href: '/diagrams/algorithms/searching',
    icon: <CodeBracketIcon className="h-5 w-5" />,
    color: 'bg-green-500',
    algorithms: ['Linear Search', 'Binary Search', 'Jump Search', 'Interpolation Search'],
    complexity: 'O(log n) to O(n)',
    difficulty: 'Beginner'
  },
  {
    title: 'Graph Algorithms',
    description: 'BFS, DFS, shortest path, and minimum spanning tree algorithms',
    href: '/diagrams/algorithms/graph',
    icon: <ChartBarIcon className="h-5 w-5" />,
    color: 'bg-purple-500',
    algorithms: ['BFS', 'DFS', "Dijkstra's", "Kruskal's", "Prim's"],
    complexity: 'O(V + E) to O(V²)',
    difficulty: 'Intermediate'
  },
  {
    title: 'Dynamic Programming',
    description: 'Memoization, tabulation, and optimization techniques',
    href: '/diagrams/algorithms/dynamic-programming',
    icon: <ClockIcon className="h-5 w-5" />,
    color: 'bg-orange-500',
    algorithms: ['Fibonacci', 'Knapsack', 'LCS', 'Edit Distance', 'Coin Change'],
    complexity: 'O(n²) to O(n³)',
    difficulty: 'Advanced'
  }
]

function AlgorithmCard({ algorithm }: { algorithm: typeof algorithms[0] }) {
  return (
    <Link href={algorithm.href} className="block">
      <div className="bg-white border rounded-lg p-4 hover:border-gray-300 transition-colors">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-gray-900">{algorithm.title}</h3>
            <p className="text-sm text-gray-600">{algorithm.description}</p>
          </div>
          <ArrowRightIcon className="h-4 w-4 text-gray-400" />
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
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Algorithm Visualizations</h2>
          <p className="text-gray-600 text-sm">
            Interactive visualizations to help you understand and master algorithms for technical interviews.
          </p>
        </div>

        {/* Algorithm Categories */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {algorithms.map((algorithm) => (
              <AlgorithmCard key={algorithm.href} algorithm={algorithm} />
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
