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
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Sorting Algorithms Visualizer</h2>
          <p className="text-gray-600 text-sm">
            Interactive visualization of 6 sorting algorithms with real-time performance metrics.
          </p>
        </div>

        {/* Algorithm Information */}
        <div className="mb-6">
          <div className="bg-white border rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Time Complexity</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
              <div className="text-center">
                <div className="font-medium text-gray-900">Bubble Sort</div>
                <div className="text-gray-600">O(n²)</div>
              </div>
              <div className="text-center">
                <div className="font-medium text-gray-900">Selection Sort</div>
                <div className="text-gray-600">O(n²)</div>
              </div>
              <div className="text-center">
                <div className="font-medium text-gray-900">Insertion Sort</div>
                <div className="text-gray-600">O(n²)</div>
              </div>
              <div className="text-center">
                <div className="font-medium text-gray-900">Merge Sort</div>
                <div className="text-gray-600">O(n log n)</div>
              </div>
              <div className="text-center">
                <div className="font-medium text-gray-900">Quick Sort</div>
                <div className="text-gray-600">O(n log n)</div>
              </div>
              <div className="text-center">
                <div className="font-medium text-gray-900">Heap Sort</div>
                <div className="text-gray-600">O(n log n)</div>
              </div>
            </div>
          </div>
        </div>

        {/* Visualizer Container */}
        <div className="bg-white border rounded-lg overflow-hidden">
          <div className="relative" style={{ height: '600px' }}>
            <iframe
              ref={iframeRef}
              className="w-full h-full border-0"
              title="Sorting Algorithms Visualizer"
              sandbox="allow-scripts allow-same-origin"
            />
          </div>
        </div>

        {/* Related Topics */}
        <div className="mt-6">
          <div className="flex space-x-4 text-sm">
            <Link href="/diagrams/algorithms/searching" className="text-gray-600 hover:text-gray-900">
              Searching Algorithms
            </Link>
            <Link href="/diagrams/algorithms/graph" className="text-gray-600 hover:text-gray-900">
              Graph Algorithms
            </Link>
            <Link href="/diagrams/algorithms/dynamic-programming" className="text-gray-600 hover:text-gray-900">
              Dynamic Programming
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
