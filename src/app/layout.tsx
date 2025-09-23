import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PrepGuides.dev - Technical Interview Visual Resources',
  description: 'Master technical interviews with interactive diagrams and comprehensive guides for cloud computing, containerization, and distributed systems.',
  keywords: 'technical interview, kubernetes, networking, system design, diagrams, interview prep',
  authors: [{ name: 'PrepGuides.dev' }],
  openGraph: {
    title: 'PrepGuides.dev - Technical Interview Visual Resources',
    description: 'Master technical interviews with interactive diagrams and comprehensive guides.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PrepGuides.dev - Technical Interview Visual Resources',
    description: 'Master technical interviews with interactive diagrams and comprehensive guides.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}