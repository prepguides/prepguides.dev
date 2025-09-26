#!/usr/bin/env node

/**
 * Navigation Update Script
 * Updates the main index.html and category pages based on content-config.json
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG_FILE = 'content-config.json';
const INDEX_FILE = 'index.html';
const CATEGORY_DIR = './';

// Color mappings for categories
const CATEGORY_COLORS = {
  'kubernetes': { primary: '#3b82f6', secondary: '#1d4ed8' },
  'algorithms': { primary: '#8b5cf6', secondary: '#a855f7' },
  'networking': { primary: '#10b981', secondary: '#059669' },
  'databases': { primary: '#f59e0b', secondary: '#d97706' },
  'microservices': { primary: '#ef4444', secondary: '#dc2626' },
  'system-design': { primary: '#6366f1', secondary: '#4f46e5' }
};

/**
 * Load and parse content configuration
 */
function loadConfig() {
  try {
    // First, run the merge engine to generate content-config.json
    const { execSync } = require('child_process');
    console.log('🔄 Running content merge engine...');
    execSync('node scripts/merge-content.js', { stdio: 'inherit' });
    
    // Then load the generated configuration
    const configPath = path.resolve(CONFIG_FILE);
    const configData = fs.readFileSync(configPath, 'utf8');
    return JSON.parse(configData);
  } catch (error) {
    console.error('Error loading content config:', error.message);
    process.exit(1);
  }
}

/**
 * Generate category card HTML
 */
function generateCategoryCard(categoryId, category) {
  const colors = CATEGORY_COLORS[categoryId] || { primary: '#6366f1', secondary: '#4f46e5' };
  const hasContent = Object.keys(category.subtopics).length > 0;
  
  let itemsHtml = '';
  let totalItems = 0;
  
  // Generate subtopic items
  for (const [subtopicId, subtopic] of Object.entries(category.subtopics)) {
    if (subtopic.content && subtopic.content.length > 0) {
      totalItems += subtopic.content.length;
      
      for (const contentItem of subtopic.content) {
        if (contentItem.status === 'active') {
          let link = '#';
          let linkText = contentItem.title;
          
          if (contentItem.type === 'visualization') {
            link = contentItem.path;
          } else if (contentItem.repo && contentItem.path) {
            // Generate link to template renderer
            const params = new URLSearchParams({
              repo: contentItem.repo,
              path: contentItem.path,
              category: categoryId,
              subtopic: subtopicId,
              title: contentItem.title
            });
            link = `template-md-renderer.html?${params.toString()}`;
          }
          
          itemsHtml += `<li><a href="${link}">${linkText}</a></li>`;
        }
      }
    }
  }
  
  // Add "All [Category]" link if there are items
  if (totalItems > 0) {
    const allLink = hasContent ? `${categoryId}.html` : '#';
    itemsHtml = `<li><a href="${allLink}">All ${category.name} Content (${totalItems} Available)</a></li>${itemsHtml}`;
  } else {
    itemsHtml = '<li><a href="#">Coming Soon</a></li>';
  }
  
  return `
    <div class="category-card" onclick="window.location.href='${categoryId}.html'">
      <div class="category-icon" style="background: linear-gradient(135deg, ${colors.primary}, ${colors.secondary});">
        ${category.icon}
      </div>
      <h3 class="category-title">${category.name}</h3>
      <p class="category-description">${category.description}</p>
      <ul class="category-items">
        ${itemsHtml}
      </ul>
    </div>`;
}

/**
 * Generate statistics
 */
function generateStatistics(config) {
  let totalContent = 0;
  let totalVisualizations = 0;
  let totalGuides = 0;
  let categoriesWithContent = 0;
  
  for (const category of Object.values(config.categories)) {
    if (Object.keys(category.subtopics).length > 0) {
      categoriesWithContent++;
      
      for (const subtopic of Object.values(category.subtopics)) {
        for (const contentItem of subtopic.content) {
          if (contentItem.status === 'active') {
            totalContent++;
            if (contentItem.type === 'visualization') {
              totalVisualizations++;
            } else {
              totalGuides++;
            }
          }
        }
      }
    }
  }
  
  return {
    totalContent,
    totalVisualizations,
    totalGuides,
    categoriesWithContent,
    totalCategories: Object.keys(config.categories).length
  };
}

/**
 * Update main index.html
 */
function updateIndexHtml(config) {
  const indexPath = path.resolve(INDEX_FILE);
  let indexContent = fs.readFileSync(indexPath, 'utf8');
  
  // Generate category cards
  let categoriesHtml = '';
  for (const [categoryId, category] of Object.entries(config.categories)) {
    categoriesHtml += generateCategoryCard(categoryId, category);
  }
  
  // Generate statistics
  const stats = generateStatistics(config);
  
  // Replace category cards section
  const categoryCardsRegex = /<div class="categories">([\s\S]*?)<\/div>/;
  const newCategoriesSection = `<div class="categories">\n${categoriesHtml}\n            </div>`;
  indexContent = indexContent.replace(categoryCardsRegex, newCategoriesSection);
  
  // Update statistics
  const statsRegex = /<div class="stat-value">(\d+[+]?)<\/div>\s*<div class="stat-label">([^<]+)<\/div>/g;
  const statsReplacements = [
    { value: stats.totalContent.toString(), label: 'Total Content Items' },
    { value: stats.totalVisualizations.toString(), label: 'Interactive Visualizations' },
    { value: stats.totalGuides.toString(), label: 'Guides & Tutorials' },
    { value: stats.categoriesWithContent.toString(), label: 'Active Categories' }
  ];
  
  let replacementIndex = 0;
  indexContent = indexContent.replace(statsRegex, (match, value, label) => {
    if (replacementIndex < statsReplacements.length) {
      const replacement = statsReplacements[replacementIndex];
      replacementIndex++;
      return `<div class="stat-value">${replacement.value}</div>\n                    <div class="stat-label">${replacement.label}</div>`;
    }
    return match;
  });
  
  // Write updated content
  fs.writeFileSync(indexPath, indexContent, 'utf8');
  console.log('✅ Updated index.html');
}

/**
 * Generate category page HTML
 */
function generateCategoryPage(categoryId, category) {
  const colors = CATEGORY_COLORS[categoryId] || { primary: '#6366f1', secondary: '#4f46e5' };
  
  let contentHtml = '';
  let hasContent = false;
  
  for (const [subtopicId, subtopic] of Object.entries(category.subtopics)) {
    if (subtopic.content && subtopic.content.length > 0) {
      hasContent = true;
      
      for (const contentItem of subtopic.content) {
        if (contentItem.status === 'active') {
          let link = '#';
          let buttonText = 'View Content →';
          
          if (contentItem.type === 'visualization') {
            link = contentItem.path;
            buttonText = 'View Visualization →';
          } else if (contentItem.repo && contentItem.path) {
            const params = new URLSearchParams({
              repo: contentItem.repo,
              path: contentItem.path,
              category: categoryId,
              subtopic: subtopicId,
              title: contentItem.title
            });
            link = `template-md-renderer.html?${params.toString()}`;
            buttonText = 'View Guide →';
          }
          
          contentHtml += `
            <div class="visualization-card" onclick="window.location.href='${link}'">
              <h3 class="visualization-title">${contentItem.title}</h3>
              <p class="visualization-description">${contentItem.description}</p>
              <ul class="visualization-features">
                <li>Comprehensive ${contentItem.type || 'content'}</li>
                <li>Interactive learning experience</li>
                <li>Interview preparation focused</li>
                <li>Best practices and examples</li>
              </ul>
              <a href="${link}" class="access-button">${buttonText}</a>
            </div>`;
        }
      }
    }
  }
  
  if (!hasContent) {
    contentHtml = `
      <div class="coming-soon">
        <h3>More ${category.name} Content Coming Soon</h3>
        <p>We're working on additional ${category.name.toLowerCase()} content including:</p>
        <ul style="list-style: none; margin-top: 15px;">
          <li>• Interactive visualizations</li>
          <li>• Comprehensive guides</li>
          <li>• Interview questions</li>
          <li>• Best practices</li>
        </ul>
      </div>`;
  }
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${category.name} - PrepGuides.dev</title>
    <meta name="description" content="${category.description}">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        :root {
            --primary: ${colors.primary};
            --secondary: ${colors.secondary};
            --success: #10b981;
            --warning: #f59e0b;
            --danger: #ef4444;
            --dark: #1f2937;
            --light: #f3f4f6;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }

        .main-container {
            max-width: 1400px;
            margin: 0 auto;
            background: rgba(255, 255, 255, 0.98);
            border-radius: 24px;
            overflow: hidden;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }

        header {
            background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
            color: white;
            padding: 40px;
            text-align: center;
            position: relative;
            overflow: hidden;
        }

        .back-button {
            position: absolute;
            top: 20px;
            left: 20px;
            background: rgba(255, 255, 255, 0.2);
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 8px;
            cursor: pointer;
            text-decoration: none;
            font-weight: 500;
            transition: all 0.3s ease;
        }

        .back-button:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: translateY(-2px);
        }

        h1 {
            font-size: 3rem;
            font-weight: 800;
            margin-bottom: 1rem;
        }

        .subtitle {
            font-size: 1.2rem;
            opacity: 0.9;
        }

        .content {
            padding: 40px;
        }

        .visualization-card {
            background: white;
            border-radius: 16px;
            padding: 30px;
            margin-bottom: 30px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
            border: 1px solid #e5e7eb;
            transition: all 0.3s ease;
            cursor: pointer;
        }

        .visualization-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 20px 25px rgba(0, 0, 0, 0.1);
        }

        .visualization-title {
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--dark);
            margin-bottom: 10px;
        }

        .visualization-description {
            color: #6b7280;
            margin-bottom: 20px;
            line-height: 1.6;
        }

        .visualization-features {
            list-style: none;
            margin-bottom: 20px;
        }

        .visualization-features li {
            padding: 5px 0;
            color: #6b7280;
        }

        .visualization-features li::before {
            content: "✓";
            color: var(--success);
            font-weight: bold;
            margin-right: 10px;
        }

        .access-button {
            background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            text-decoration: none;
            display: inline-block;
            transition: all 0.3s ease;
        }

        .access-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(59, 130, 246, 0.3);
        }

        .coming-soon {
            background: #f8fafc;
            border: 2px dashed #cbd5e1;
            border-radius: 16px;
            padding: 40px;
            text-align: center;
            color: #64748b;
        }

        .coming-soon h3 {
            font-size: 1.5rem;
            margin-bottom: 10px;
            color: var(--dark);
        }

        @media (max-width: 768px) {
            h1 {
                font-size: 2rem;
            }
            
            .content {
                padding: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="main-container">
        <header>
            <a href="index.html" class="back-button">← Back to Home</a>
            <h1>${category.icon} ${category.name}</h1>
            <p class="subtitle">${category.description}</p>
        </header>

        <div class="content">
            ${contentHtml}
        </div>
    </div>
</body>
</html>`;
}

/**
 * Update category pages
 */
function updateCategoryPages(config) {
  for (const [categoryId, category] of Object.entries(config.categories)) {
    const categoryPagePath = path.resolve(`${categoryId}.html`);
    const categoryPageContent = generateCategoryPage(categoryId, category);
    
    fs.writeFileSync(categoryPagePath, categoryPageContent, 'utf8');
    console.log(`✅ Updated ${categoryId}.html`);
  }
}

/**
 * Main execution
 */
function main() {
  console.log('🚀 Starting navigation update...');
  
  const config = loadConfig();
  console.log(`📋 Loaded configuration for ${Object.keys(config.categories).length} categories`);
  
  updateIndexHtml(config);
  updateCategoryPages(config);
  
  const stats = generateStatistics(config);
  console.log('📊 Updated statistics:');
  console.log(`   - Total content items: ${stats.totalContent}`);
  console.log(`   - Visualizations: ${stats.totalVisualizations}`);
  console.log(`   - Guides: ${stats.totalGuides}`);
  console.log(`   - Active categories: ${stats.categoriesWithContent}`);
  
  console.log('✅ Navigation update completed successfully!');
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  loadConfig,
  generateStatistics,
  updateIndexHtml,
  updateCategoryPages
};
