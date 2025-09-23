import Link from 'next/link'
import { ServerIcon, ChartBarIcon, CpuChipIcon, CogIcon } from '@heroicons/react/24/outline'

const topics = [
  {
    name: 'Kubernetes',
    description: 'Container orchestration, microservices, and cloud-native applications',
    icon: <ServerIcon className="h-8 w-8" />,
    color: 'bg-blue-500',
    diagrams: 1,
    questions: 25,
    difficulty: 'Intermediate',
    concepts: ['Pods', 'Services', 'Ingress', 'Deployments', 'ConfigMaps', 'Secrets']
  },
  {
    name: 'Networking',
    description: 'OSI model, TCP/IP, protocols, and network architecture',
    icon: <ChartBarIcon className="h-8 w-8" />,
    color: 'bg-green-500',
    diagrams: 1,
    questions: 30,
    difficulty: 'Beginner',
    concepts: ['OSI Layers', 'TCP/UDP', 'HTTP/HTTPS', 'DNS', 'Load Balancing', 'CDN']
  },
  {
    name: 'Databases',
    description: 'Database design, replication, sharding, and performance optimization',
    icon: <CpuChipIcon className="h-8 w-8" />,
    color: 'bg-purple-500',
    diagrams: 0,
    questions: 20,
    difficulty: 'Advanced',
    concepts: ['ACID', 'CAP Theorem', 'Replication', 'Sharding', 'Indexing', 'Transactions']
  },
  {
    name: 'System Design',
    description: 'Scalability, architecture patterns, and distributed systems',
    icon: <CogIcon className="h-8 w-8" />,
    color: 'bg-orange-500',
    diagrams: 0,
    questions: 15,
    difficulty: 'Advanced',
    concepts: ['Microservices', 'Load Balancing', 'Caching', 'Message Queues', 'CDN', 'API Gateway']
  }
]

export default function TopicsPage() {
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
              <Link href="/diagrams" className="text-gray-700 hover:text-blue-600">Diagrams</Link>
              <Link href="/topics" className="text-blue-600 font-semibold">Topics</Link>
              <Link href="/interview-questions" className="text-gray-700 hover:text-blue-600">Questions</Link>
              <Link href="/about" className="text-gray-700 hover:text-blue-600">About</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Technical Topics</h1>
          <p className="text-xl text-gray-600">
            Explore comprehensive guides and interactive diagrams for key technical concepts
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {topics.map((topic) => (
            <TopicCard key={topic.name} topic={topic} />
          ))}
        </div>

        {/* Coming Soon Section */}
        <div className="mt-16 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Additional Topics Coming Soon</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <ComingSoonTopic title="Security" description="Authentication, authorization, encryption" />
            <ComingSoonTopic title="Monitoring" description="Observability, logging, metrics, tracing" />
            <ComingSoonTopic title="DevOps" description="CI/CD, infrastructure as code, automation" />
            <ComingSoonTopic title="Cloud" description="AWS, GCP, Azure services and architecture" />
          </div>
        </div>
      </main>
    </div>
  )
}

interface TopicCardProps {
  topic: {
    name: string
    description: string
    icon: React.ReactNode
    color: string
    diagrams: number
    questions: number
    difficulty: string
    concepts: string[]
  }
}

function TopicCard({ topic }: TopicCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      <div className="p-8">
        <div className="flex items-center mb-6">
          <div className={`${topic.color} text-white rounded-lg p-3 mr-4`}>
            {topic.icon}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{topic.name}</h2>
            <div className="flex items-center space-x-4 mt-1">
              <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                topic.difficulty === 'Beginner' 
                  ? 'bg-green-100 text-green-800'
                  : topic.difficulty === 'Intermediate'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {topic.difficulty}
              </span>
              <span className="text-sm text-gray-500">
                {topic.diagrams} diagrams • {topic.questions} questions
              </span>
            </div>
          </div>
        </div>

        <p className="text-gray-600 mb-6">{topic.description}</p>

        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Key Concepts</h3>
          <div className="flex flex-wrap gap-2">
            {topic.concepts.map((concept) => (
              <span key={concept} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                {concept}
              </span>
            ))}
          </div>
        </div>

        <div className="flex space-x-3">
          <Link 
            href={`/diagrams/${topic.name.toLowerCase()}`}
            className="flex-1 bg-blue-600 text-white text-center py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            View Diagrams
          </Link>
          <Link 
            href={`/interview-questions/${topic.name.toLowerCase()}`}
            className="flex-1 bg-gray-100 text-gray-700 text-center py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Practice Questions
          </Link>
        </div>
      </div>
    </div>
  )
}

interface ComingSoonTopicProps {
  title: string
  description: string
}

function ComingSoonTopic({ title, description }: ComingSoonTopicProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-4 border-2 border-dashed border-gray-300">
      <h3 className="font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 mb-2">{description}</p>
      <p className="text-xs text-gray-400">Coming Soon</p>
    </div>
  )
}
