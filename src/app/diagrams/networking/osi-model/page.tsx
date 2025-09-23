'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeftIcon, PlayIcon, PauseIcon, ArrowsPointingOutIcon } from '@heroicons/react/24/outline'

const layers = [
  {
    number: 7,
    name: 'Application',
    color: 'bg-red-500',
    protocols: ['HTTP', 'HTTPS', 'FTP', 'SMTP', 'DNS', 'SSH'],
    description: 'Provides network services directly to user applications',
    examples: ['Web browsers', 'Email clients', 'File transfer apps'],
    dataUnit: 'User data (messages, files, web pages)'
  },
  {
    number: 6,
    name: 'Presentation',
    color: 'bg-orange-500',
    protocols: ['SSL/TLS', 'JPEG', 'PNG', 'MPEG', 'ASCII', 'Unicode'],
    description: 'Handles data representation, encryption, and compression',
    examples: ['Image compression', 'Encryption libraries', 'Format converters'],
    dataUnit: 'Encoded/compressed user data'
  },
  {
    number: 5,
    name: 'Session',
    color: 'bg-yellow-500',
    protocols: ['RPC', 'SQL', 'NetBIOS', 'PPTP', 'L2TP'],
    description: 'Manages sessions between applications',
    examples: ['Database connections', 'Remote procedure calls'],
    dataUnit: 'Session data with control information'
  },
  {
    number: 4,
    name: 'Transport',
    color: 'bg-green-500',
    protocols: ['TCP', 'UDP', 'SCTP', 'DCCP'],
    description: 'Provides reliable data transfer between end systems',
    examples: ['Web servers', 'Streaming applications', 'DNS servers'],
    dataUnit: 'Segments (TCP) or Datagrams (UDP)'
  },
  {
    number: 3,
    name: 'Network',
    color: 'bg-blue-500',
    protocols: ['IPv4', 'IPv6', 'ICMP', 'OSPF', 'BGP', 'RIP'],
    description: 'Provides logical addressing and routing',
    examples: ['Routers', 'Layer 3 switches', 'Firewalls'],
    dataUnit: 'Packets with IP headers'
  },
  {
    number: 2,
    name: 'Data Link',
    color: 'bg-indigo-500',
    protocols: ['Ethernet', 'WiFi (802.11)', 'PPP', 'HDLC', 'Frame Relay'],
    description: 'Provides reliable data transfer across physical links',
    examples: ['Switches', 'Bridges', 'Network interface cards'],
    dataUnit: 'Frames with MAC headers'
  },
  {
    number: 1,
    name: 'Physical',
    color: 'bg-purple-500',
    protocols: ['Ethernet (10BASE-T)', 'WiFi (802.11)', 'Fiber Optic'],
    description: 'Transmits raw bits over physical media',
    examples: ['Cables', 'Hubs', 'Repeaters', 'Network cards', 'Antennas'],
    dataUnit: 'Raw bits (0s and 1s)'
  }
]

const interviewQuestions = [
  'Explain the OSI model and why it\'s important',
  'What\'s the difference between TCP and UDP?',
  'How does data flow through the OSI layers?',
  'What happens at each layer when you visit a website?',
  'What\'s the difference between a switch and a router?',
  'How does ARP work?',
  'Explain the difference between HTTP and HTTPS',
  'What\'s the purpose of port numbers?',
  'How does NAT work and why is it used?',
  'What\'s the difference between OSI and TCP/IP models?'
]

export default function OSIModelPage() {
  const [activeLayer, setActiveLayer] = useState(7)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const handleLayerClick = (layerNumber: number) => {
    setActiveLayer(layerNumber)
  }

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

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
              <h1 className="text-xl font-semibold text-gray-900">OSI 7-Layer Model</h1>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={togglePlay}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
              >
                {isPlaying ? <PauseIcon className="h-5 w-5" /> : <PlayIcon className="h-5 w-5" />}
              </button>
              <button
                onClick={toggleFullscreen}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
              >
                <ArrowsPointingOutIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Diagram */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="aspect-video bg-gray-50 rounded-lg overflow-hidden">
                <img 
                  src="/diagrams/networking/osi_layers.svg" 
                  alt="OSI 7-Layer Model Diagram"
                  className="w-full h-full object-contain"
                />
              </div>
              
              {/* Layer Navigation */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">OSI Layers</h3>
                <div className="grid grid-cols-7 gap-2">
                  {layers.map((layer) => (
                    <button
                      key={layer.number}
                      onClick={() => handleLayerClick(layer.number)}
                      className={`p-3 rounded-lg text-center transition-colors ${
                        activeLayer === layer.number
                          ? 'bg-blue-100 text-blue-900 border-2 border-blue-300'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <div className={`${layer.color} text-white rounded-full w-8 h-8 mx-auto mb-2 flex items-center justify-center text-sm font-bold`}>
                        {layer.number}
                      </div>
                      <div className="text-xs">{layer.name}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Current Layer Details */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <div className={`${layers[7 - activeLayer]?.color} text-white rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold mr-4`}>
                  {activeLayer}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Layer {activeLayer}: {layers[7 - activeLayer]?.name}
                  </h3>
                </div>
              </div>
              
              <p className="text-gray-600 mb-4">
                {layers[7 - activeLayer]?.description}
              </p>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Protocols</h4>
                  <div className="flex flex-wrap gap-2">
                    {layers[7 - activeLayer]?.protocols.map((protocol) => (
                      <span key={protocol} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        {protocol}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Examples</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {layers[7 - activeLayer]?.examples.map((example) => (
                      <li key={example} className="flex items-start">
                        <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0" />
                        {example}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Data Unit</h4>
                  <p className="text-sm text-gray-600">{layers[7 - activeLayer]?.dataUnit}</p>
                </div>
              </div>
            </div>

            {/* Data Flow Process */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Flow Process</h3>
              <div className="space-y-3">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-1">Encapsulation (Sending)</h4>
                  <p className="text-sm text-blue-700">Data flows down through layers, each adding its header</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-1">Decapsulation (Receiving)</h4>
                  <p className="text-sm text-green-700">Data flows up through layers, each removing its header</p>
                </div>
              </div>
            </div>

            {/* Interview Questions */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Interview Questions</h3>
              <div className="space-y-3">
                {interviewQuestions.slice(0, 4).map((question, index) => (
                  <div key={index} className="text-sm text-gray-700 p-3 bg-gray-50 rounded-lg">
                    {question}
                  </div>
                ))}
                <Link 
                  href="/interview-questions/networking" 
                  className="text-blue-600 text-sm font-medium hover:text-blue-700"
                >
                  View all questions →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
