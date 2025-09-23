import Link from 'next/link'
import { ArrowRightIcon, ChartBarIcon, ServerIcon, CodeBracketIcon } from '@heroicons/react/24/outline'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">PrepGuides.dev</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/diagrams" className="text-gray-700 hover:text-blue-600">Diagrams</Link>
              <Link href="/topics" className="text-gray-700 hover:text-blue-600">Topics</Link>
              <Link href="/interview-questions" className="text-gray-700 hover:text-blue-600">Questions</Link>
              <Link href="/about" className="text-gray-700 hover:text-blue-600">About</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Master Technical Interviews with
            <span className="text-blue-600"> Visual Learning</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Interactive diagrams and comprehensive guides to help you excel in technical interviews. 
            Learn complex concepts through visual representations and step-by-step explanations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/diagrams" 
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center"
            >
              Explore Diagrams
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Link>
            <Link 
              href="/interview-questions" 
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold border-2 border-blue-600 hover:bg-blue-50 transition-colors"
            >
              Practice Questions
            </Link>
          </div>
        </div>

        {/* Featured Categories */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Featured Topics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <CategoryCard
              title="Kubernetes"
              description="Container orchestration and microservices"
              icon={<ServerIcon className="h-8 w-8" />}
              href="/diagrams/kubernetes"
              color="bg-blue-500"
            />
            <CategoryCard
              title="Networking"
              description="OSI model, TCP/IP, and protocols"
              icon={<ChartBarIcon className="h-8 w-8" />}
              href="/diagrams/networking"
              color="bg-green-500"
            />
            <CategoryCard
              title="Algorithms"
              description="Sorting, searching, and data structures"
              icon={<CodeBracketIcon className="h-8 w-8" />}
              href="/diagrams/algorithms"
              color="bg-purple-500"
            />
            <CategoryCard
              title="System Design"
              description="Scalability and architecture patterns"
              icon={<ChartBarIcon className="h-8 w-8" />}
              href="/diagrams/system-design"
              color="bg-orange-500"
            />
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-20 bg-white rounded-2xl shadow-lg p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600">50+</div>
              <div className="text-gray-600">Interactive Diagrams</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">500+</div>
              <div className="text-gray-600">Interview Questions</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">10+</div>
              <div className="text-gray-600">Technical Topics</div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">PrepGuides.dev</h3>
              <p className="text-gray-400">
                Visual learning platform for technical interview preparation.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Topics</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/diagrams/kubernetes" className="hover:text-white">Kubernetes</Link></li>
                <li><Link href="/diagrams/networking" className="hover:text-white">Networking</Link></li>
                <li><Link href="/diagrams/databases" className="hover:text-white">Databases</Link></li>
                <li><Link href="/diagrams/system-design" className="hover:text-white">System Design</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/interview-questions" className="hover:text-white">Questions</Link></li>
                <li><Link href="/about" className="hover:text-white">About</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Connect</h4>
              <p className="text-gray-400">
                Built for developers, by developers.
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 PrepGuides.dev. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

interface CategoryCardProps {
  title: string
  description: string
  icon: React.ReactNode
  href: string
  color: string
}

function CategoryCard({ title, description, icon, href, color }: CategoryCardProps) {
  return (
    <Link href={href} className="group">
      <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
        <div className={`${color} text-white rounded-lg p-3 w-fit mb-4 group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </Link>
  )
}