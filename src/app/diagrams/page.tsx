import Link from 'next/link'
import { ArrowRightIcon, EyeIcon } from '@heroicons/react/24/outline'

const diagrams = [
  {
    category: 'Kubernetes',
    title: 'Request Flow Diagram',
    description: 'Complete bidirectional network flow from external client to pod containers with response path',
    href: '/diagrams/kubernetes/request-flow',
    image: '/diagrams/kubernetes/k8s_request_flow.svg',
    difficulty: 'Intermediate',
    topics: ['Networking', 'Load Balancing', 'Service Discovery']
  },
  {
    category: 'Networking',
    title: 'OSI 7-Layer Model',
    description: 'Fundamental networking concepts with detailed layer explanations and protocols',
    href: '/diagrams/networking/osi-model',
    image: '/diagrams/networking/osi_layers.svg',
    difficulty: 'Beginner',
    topics: ['Protocols', 'Data Flow', 'Network Architecture']
  },
  {
    category: 'Algorithms',
    title: 'Sorting Algorithms Visualizer',
    description: 'Interactive visualization of 6 sorting algorithms with real-time statistics and step-by-step execution',
    href: '/diagrams/algorithms/sorting',
    image: '/diagrams/algorithms/sorting-algorithms-visualizer.html',
    difficulty: 'Beginner',
    topics: ['Bubble Sort', 'Quick Sort', 'Merge Sort', 'Heap Sort']
  }
]

export default function DiagramsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href="/" className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">PrepGuides.dev</h1>
            </Link>
            <nav className="hidden md:flex space-x-8">
              <Link href="/diagrams" className="text-blue-600 font-semibold">Diagrams</Link>
              <Link href="/topics" className="text-gray-700 hover:text-blue-600">Topics</Link>
              <Link href="/interview-questions" className="text-gray-700 hover:text-blue-600">Questions</Link>
              <Link href="/about" className="text-gray-700 hover:text-blue-600">About</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Interactive Diagrams</h1>
          <p className="text-xl text-gray-600">
            Explore complex technical concepts through interactive visual representations
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
            <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md">
              All
            </button>
            <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 rounded-md">
              Kubernetes
            </button>
            <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 rounded-md">
              Networking
            </button>
            <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 rounded-md">
              Algorithms
            </button>
            <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 rounded-md">
              Databases
            </button>
            <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 rounded-md">
              System Design
            </button>
          </div>
        </div>

        {/* Diagrams Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {diagrams.map((diagram) => (
            <DiagramCard key={diagram.href} diagram={diagram} />
          ))}
        </div>

        {/* Coming Soon Section */}
        <div className="mt-16 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Coming Soon</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <ComingSoonCard title="TCP/IP Stack" category="Networking" />
            <ComingSoonCard title="Database Replication" category="Databases" />
            <ComingSoonCard title="Load Balancer Types" category="System Design" />
            <ComingSoonCard title="Microservices Architecture" category="System Design" />
          </div>
        </div>
      </main>
    </div>
  )
}

interface DiagramCardProps {
  diagram: {
    category: string
    title: string
    description: string
    href: string
    image: string
    difficulty: string
    topics: string[]
  }
}

function DiagramCard({ diagram }: DiagramCardProps) {
  return (
    <Link href={diagram.href} className="group">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
        <div className="aspect-video bg-gray-100 relative overflow-hidden">
          <img 
            src={diagram.image} 
            alt={diagram.title}
            className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform"
          />
          <div className="absolute top-4 left-4">
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {diagram.category}
            </span>
          </div>
          <div className="absolute top-4 right-4">
            <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
              diagram.difficulty === 'Beginner' 
                ? 'bg-green-100 text-green-800'
                : diagram.difficulty === 'Intermediate'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {diagram.difficulty}
            </span>
          </div>
        </div>
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
            {diagram.title}
          </h3>
          <p className="text-gray-600 mb-4 line-clamp-2">
            {diagram.description}
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            {diagram.topics.map((topic) => (
              <span key={topic} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                {topic}
              </span>
            ))}
          </div>
          <div className="flex items-center text-blue-600 font-medium group-hover:text-blue-700">
            View Diagram
            <ArrowRightIcon className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  )
}

interface ComingSoonCardProps {
  title: string
  category: string
}

function ComingSoonCard({ title, category }: ComingSoonCardProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-4 border-2 border-dashed border-gray-300">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium text-gray-900">{title}</h3>
        <EyeIcon className="h-4 w-4 text-gray-400" />
      </div>
      <p className="text-sm text-gray-500">{category}</p>
      <p className="text-xs text-gray-400 mt-2">Coming Soon</p>
    </div>
  )
}
