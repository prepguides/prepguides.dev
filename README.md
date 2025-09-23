# PrepGuides.dev - Bare Bones HTML Renderer

A minimal static HTML app that directly renders interactive content without any framework complexity.

## What's Included

- **Pure HTML/CSS/JavaScript** - No frameworks, no build steps
- **Interactive Sorting Visualizer** - Complete with 6 sorting algorithms
- **Direct SVG/HTML Rendering** - Perfect for displaying your custom diagrams
- **Vercel Ready** - Deploy directly to Vercel with zero configuration

## Files Structure

```
├── index.html              # Main HTML file with sorting visualizer
├── vercel.json            # Vercel configuration for static hosting
├── package.json           # Minimal package.json (no dependencies needed)
└── public/
    └── diagrams/          # Your custom HTML/SVG files
        ├── algorithms/
        ├── kubernetes/
        ├── networking/
        └── system-design/
```

## How to Use

1. **Add your HTML files** to the `public/diagrams/` directory
2. **Update `index.html`** to point to your specific HTML file
3. **Deploy to Vercel** - just push to GitHub and connect to Vercel

## Local Development

```bash
# Simple Python server (no Node.js needed)
python3 -m http.server 3000

# Or use any static file server
npx serve .
```

## Adding Your Own Content

To render a different HTML file, simply:

1. Place your HTML file in `public/diagrams/`
2. Update the file path in `index.html` if needed
3. Or create multiple HTML files and link between them

## Deploy to Vercel

1. Push this code to GitHub
2. Connect your GitHub repo to Vercel
3. Vercel will automatically detect it's a static site
4. Your app will be live at `your-app.vercel.app`

That's it! No build process, no dependencies, just pure HTML rendering.