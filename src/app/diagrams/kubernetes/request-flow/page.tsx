'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeftIcon, PlayIcon, PauseIcon, ArrowsPointingOutIcon } from '@heroicons/react/24/outline'

const steps = [
  {
    number: 1,
    title: 'External Request',
    description: 'Client sends HTTP/HTTPS request to the cluster',
    details: [
      'Client initiates connection to cluster IP',
      'DNS resolution to load balancer endpoint',
      'HTTP/HTTPS protocol handshake'
    ]
  },
  {
    number: 2,
    title: 'Load Balancer',
    description: 'Distributes traffic across multiple ingress controllers',
    details: [
      'Traffic distribution algorithm (round-robin, least connections)',
      'SSL termination (optional)',
      'Health checks on backend services'
    ]
  },
  {
    number: 3,
    title: 'Ingress Controller',
    description: 'Routes based on hostname and path rules',
    details: [
      'Host-based routing (api.example.com)',
      'Path-based routing (/api/v1/users)',
      'SSL/TLS termination and certificate management'
    ]
  },
  {
    number: 4,
    title: 'Service Discovery',
    description: 'Looks up service endpoints and load balances',
    details: [
      'Service endpoint lookup via DNS',
      'Load balancing algorithm selection',
      'Health check validation'
    ]
  },
  {
    number: 5,
    title: 'Pod Routing',
    description: 'kube-proxy routes to healthy pod container',
    details: [
      'iptables/IPVS rule evaluation',
      'Container port forwarding',
      'Connection tracking maintenance'
    ]
  }
]

const responseSteps = [
  {
    number: 'R5',
    title: 'Pod Response',
    description: 'Application container processes request and generates response'
  },
  {
    number: 'R4',
    title: 'Service Response',
    description: 'kube-proxy forwards response back through service'
  },
  {
    number: 'R3',
    title: 'Ingress Response',
    description: 'Ingress controller processes and routes response'
  },
  {
    number: 'R2',
    title: 'Load Balancer Response',
    description: 'Load balancer forwards response to client'
  },
  {
    number: 'R1',
    title: 'Client Response',
    description: 'Final response delivered to client'
  }
]

const interviewQuestions = [
  'Walk me through what happens when a user makes a request to your Kubernetes application',
  'How does service discovery work in Kubernetes?',
  'What\'s the difference between a Service and an Ingress?',
  'How does kube-proxy work in the request flow?',
  'What happens if a pod fails during a request?',
  'How would you troubleshoot a request that\'s not reaching your pod?',
  'Explain the role of etcd in the request flow',
  'How does load balancing work at different levels?'
]

export default function RequestFlowPage() {
  const [activeStep, setActiveStep] = useState(1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const handleStepClick = (stepNumber: number) => {
    setActiveStep(stepNumber)
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
              <h1 className="text-xl font-semibold text-gray-900">Kubernetes Request Flow</h1>
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
                  src="/diagrams/kubernetes/k8s_request_flow.svg" 
                  alt="Kubernetes Request Flow Diagram"
                  className="w-full h-full object-contain"
                />
              </div>
              
              {/* Step Navigation */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Request Flow Steps</h3>
                <div className="grid grid-cols-5 gap-2">
                  {steps.map((step) => (
                    <button
                      key={step.number}
                      onClick={() => handleStepClick(step.number)}
                      className={`p-3 rounded-lg text-center transition-colors ${
                        activeStep === step.number
                          ? 'bg-blue-100 text-blue-900 border-2 border-blue-300'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <div className="text-lg font-bold">{step.number}</div>
                      <div className="text-xs mt-1">{step.title}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Current Step Details */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Step {activeStep}: {steps[activeStep - 1]?.title}
              </h3>
              <p className="text-gray-600 mb-4">
                {steps[activeStep - 1]?.description}
              </p>
              <ul className="space-y-2">
                {steps[activeStep - 1]?.details.map((detail, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                    {detail}
                  </li>
                ))}
              </ul>
            </div>

            {/* Response Flow */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Response Flow</h3>
              <div className="space-y-3">
                {responseSteps.map((step) => (
                  <div key={step.number} className="flex items-start space-x-3">
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                      {step.number}
                    </span>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{step.title}</div>
                      <div className="text-xs text-gray-600">{step.description}</div>
                    </div>
                  </div>
                ))}
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
                  href="/interview-questions/kubernetes" 
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
