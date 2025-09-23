# PrepGuides.dev

A professional platform for technical interview preparation through interactive visual diagrams and comprehensive guides.

## 🌐 Live Site

Visit [prepguides.dev](https://prepguides.dev) to explore interactive diagrams and interview resources.

## 🚀 Features

### Interactive Diagrams
- **Kubernetes Request Flow**: Complete bidirectional network flow with step-by-step explanations
- **OSI 7-Layer Model**: Fundamental networking concepts with detailed layer information
- **Step-by-step Navigation**: Click through each step of complex processes
- **Interview Questions**: Curated questions for each diagram topic

### Professional Design
- **Responsive Layout**: Optimized for desktop, tablet, and mobile
- **Dark/Light Mode**: Toggle between themes (coming soon)
- **Interactive Elements**: Hover effects, animations, and smooth transitions
- **Accessibility**: Screen reader friendly and keyboard navigation

### Content Organization
- **Categorized Topics**: Kubernetes, Networking, Databases, System Design
- **Difficulty Levels**: Beginner, Intermediate, Advanced
- **Search Functionality**: Find diagrams and topics quickly
- **Related Content**: Discover connected concepts

## 🛠️ Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Heroicons
- **Animations**: Framer Motion
- **Deployment**: Vercel (recommended)

## 📁 Project Structure

```
src/
├── app/
│   ├── diagrams/
│   │   ├── kubernetes/
│   │   │   └── request-flow/
│   │   └── networking/
│   │       └── osi-model/
│   ├── topics/
│   ├── interview-questions/
│   ├── about/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
└── lib/
public/
├── diagrams/
│   ├── kubernetes/
│   ├── networking/
│   ├── databases/
│   └── system-design/
└── images/
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/prepguides/diagrams.git
cd prepguides.dev
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📝 Adding New Diagrams

1. Add SVG files to `public/diagrams/[category]/`
2. Create a new page in `src/app/diagrams/[category]/[diagram-name]/`
3. Update the diagrams list in `src/app/diagrams/page.tsx`
4. Add interview questions and step explanations

## 🎨 Customization

### Colors
Update the color scheme in `tailwind.config.js`:
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        }
      }
    }
  }
}
```

### Content
- Update diagram data in individual page components
- Modify interview questions in the sidebar components
- Add new categories in the navigation

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure custom domain (prepguides.dev)
3. Deploy automatically on push to main branch

### Other Platforms
- **Netlify**: Use `npm run build` and deploy the `out` folder
- **AWS Amplify**: Connect repository and configure build settings
- **Custom Server**: Use `npm run build` and `npm start`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-diagram`
3. Commit changes: `git commit -m 'Add new diagram'`
4. Push to branch: `git push origin feature/new-diagram`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Kubernetes community for excellent documentation
- OSI model standards and networking concepts
- Next.js team for the amazing framework
- Tailwind CSS for the utility-first approach

---

Built with ❤️ for the developer community