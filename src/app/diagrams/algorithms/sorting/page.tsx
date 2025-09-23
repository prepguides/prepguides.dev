'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { ArrowLeftIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'

export default function SortingAlgorithmsPage() {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    // Ensure the iframe loads the visualizer
    if (iframeRef.current) {
      iframeRef.current.src = '/diagrams/algorithms/sorting-algorithms-visualizer.html'
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link 
                href="/diagrams" 
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Back to Diagrams
              </Link>
              <div className="h-6 w-px bg-gray-300" />
              <h1 className="text-xl font-semibold text-gray-900">Sorting Algorithms Visualizer</h1>
            </div>
            <a
              href="/diagrams/algorithms/sorting-algorithms-visualizer.html"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-blue-600 hover:text-blue-700"
            >
              <ArrowTopRightOnSquareIcon className="h-5 w-5 mr-2" />
              Open in New Tab
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Description */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Interactive Sorting Algorithms</h2>
          <p className="text-gray-600 mb-4">
            Explore and understand how different sorting algorithms work through interactive visualizations. 
            Watch as algorithms like Bubble Sort, Quick Sort, and Merge Sort organize data step by step.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">6 Algorithms</h3>
              <p className="text-blue-700 text-sm">Bubble, Selection, Insertion, Merge, Quick, and Heap Sort</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2">Real-time Stats</h3>
              <p className="text-green-700 text-sm">Track comparisons, swaps, and execution time</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-900 mb-2">Interactive Controls</h3>
              <p className="text-purple-700 text-sm">Adjust speed, array size, and pause/resume</p>
            </div>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
            <h4 className="font-semibold text-yellow-800 mb-2">💡 How to Use</h4>
            <ul className="text-yellow-700 text-sm space-y-1">
              <li>• Select an algorithm from the top buttons</li>
              <li>• Click &ldquo;Start Sorting&rdquo; to begin the visualization</li>
              <li>• Use the speed slider to control animation speed</li>
              <li>• Try different array sizes to see performance differences</li>
              <li>• Watch the code execution and statistics in real-time</li>
            </ul>
          </div>
        </div>

        {/* Algorithm Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Algorithm Complexities</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-2 py-1 text-left text-xs">Algorithm</th>
                    <th className="px-2 py-1 text-center text-xs">Best</th>
                    <th className="px-2 py-1 text-center text-xs">Average</th>
                    <th className="px-2 py-1 text-center text-xs">Worst</th>
                    <th className="px-2 py-1 text-center text-xs">Space</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-2 py-1 text-xs font-medium">Bubble Sort</td>
                    <td className="px-2 py-1 text-center text-xs text-green-600">O(n)</td>
                    <td className="px-2 py-1 text-center text-xs text-yellow-600">O(n²)</td>
                    <td className="px-2 py-1 text-center text-xs text-red-600">O(n²)</td>
                    <td className="px-2 py-1 text-center text-xs text-blue-600">O(1)</td>
                  </tr>
                  <tr>
                    <td className="px-2 py-1 text-xs font-medium">Selection Sort</td>
                    <td className="px-2 py-1 text-center text-xs text-yellow-600">O(n²)</td>
                    <td className="px-2 py-1 text-center text-xs text-yellow-600">O(n²)</td>
                    <td className="px-2 py-1 text-center text-xs text-red-600">O(n²)</td>
                    <td className="px-2 py-1 text-center text-xs text-blue-600">O(1)</td>
                  </tr>
                  <tr>
                    <td className="px-2 py-1 text-xs font-medium">Insertion Sort</td>
                    <td className="px-2 py-1 text-center text-xs text-green-600">O(n)</td>
                    <td className="px-2 py-1 text-center text-xs text-yellow-600">O(n²)</td>
                    <td className="px-2 py-1 text-center text-xs text-red-600">O(n²)</td>
                    <td className="px-2 py-1 text-center text-xs text-blue-600">O(1)</td>
                  </tr>
                  <tr>
                    <td className="px-2 py-1 text-xs font-medium">Merge Sort</td>
                    <td className="px-2 py-1 text-center text-xs text-green-600">O(n log n)</td>
                    <td className="px-2 py-1 text-center text-xs text-green-600">O(n log n)</td>
                    <td className="px-2 py-1 text-center text-xs text-green-600">O(n log n)</td>
                    <td className="px-2 py-1 text-center text-xs text-yellow-600">O(n)</td>
                  </tr>
                  <tr>
                    <td className="px-2 py-1 text-xs font-medium">Quick Sort</td>
                    <td className="px-2 py-1 text-center text-xs text-green-600">O(n log n)</td>
                    <td className="px-2 py-1 text-center text-xs text-green-600">O(n log n)</td>
                    <td className="px-2 py-1 text-center text-xs text-red-600">O(n²)</td>
                    <td className="px-2 py-1 text-center text-xs text-yellow-600">O(log n)</td>
                  </tr>
                  <tr>
                    <td className="px-2 py-1 text-xs font-medium">Heap Sort</td>
                    <td className="px-2 py-1 text-center text-xs text-green-600">O(n log n)</td>
                    <td className="px-2 py-1 text-center text-xs text-green-600">O(n log n)</td>
                    <td className="px-2 py-1 text-center text-xs text-green-600">O(n log n)</td>
                    <td className="px-2 py-1 text-center text-xs text-blue-600">O(1)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Interview Questions</h3>
            <div className="space-y-2">
              <div className="p-2 bg-gray-50 rounded text-xs">
                &ldquo;Explain the difference between stable and unstable sorting algorithms&rdquo;
              </div>
              <div className="p-2 bg-gray-50 rounded text-xs">
                &ldquo;When would you choose Quick Sort over Merge Sort?&rdquo;
              </div>
              <div className="p-2 bg-gray-50 rounded text-xs">
                &ldquo;What is the time complexity of Bubble Sort and why is it rarely used?&rdquo;
              </div>
              <div className="p-2 bg-gray-50 rounded text-xs">
                &ldquo;How does Heap Sort work and what are its advantages?&rdquo;
              </div>
              <div className="p-2 bg-gray-50 rounded text-xs">
                &ldquo;Implement Quick Sort with a custom partition function&rdquo;
              </div>
            </div>
          </div>
        </div>

        {/* Visualizer Container */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-4 bg-gray-50 border-b">
            <h3 className="text-lg font-semibold text-gray-900">Interactive Visualizer</h3>
            <p className="text-sm text-gray-600">Use the controls below to explore different sorting algorithms</p>
          </div>
          <div className="relative" style={{ height: '800px' }}>
            <iframe
              ref={iframeRef}
              className="w-full h-full border-0"
              title="Sorting Algorithms Visualizer"
              sandbox="allow-scripts allow-same-origin"
            />
          </div>
        </div>

        {/* Related Topics */}
        <div className="mt-6 bg-white rounded-lg shadow-sm p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Related Topics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Link href="/diagrams/algorithms/searching" className="p-3 bg-blue-50 rounded hover:bg-blue-100 transition-colors">
              <h4 className="font-medium text-blue-900 text-sm">Searching Algorithms</h4>
              <p className="text-blue-700 text-xs">Binary Search, Linear Search, and more</p>
            </Link>
            <Link href="/diagrams/algorithms/graph" className="p-3 bg-green-50 rounded hover:bg-green-100 transition-colors">
              <h4 className="font-medium text-green-900 text-sm">Graph Algorithms</h4>
              <p className="text-green-700 text-xs">BFS, DFS, Dijkstra&apos;s Algorithm</p>
            </Link>
            <Link href="/diagrams/algorithms/dynamic-programming" className="p-3 bg-purple-50 rounded hover:bg-purple-100 transition-colors">
              <h4 className="font-medium text-purple-900 text-sm">Dynamic Programming</h4>
              <p className="text-purple-700 text-xs">Memoization, Tabulation, and optimization</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
