# 📚 Content Management System

## Overview

The PrepGuides.dev Content Management System allows dynamic rendering of Markdown files from any public GitHub repository. This stealth mode feature enables seamless content addition through pull requests while maintaining a clean, organized site structure.

## 🏗️ System Architecture

### Core Components

1. **Template Renderer** (`template-md-renderer.html`)
   - Fetches and renders Markdown content from GitHub repositories
   - Supports syntax highlighting and responsive design
   - Provides breadcrumb navigation and metadata display

2. **Content Configuration** (`content-config.json`)
   - Central configuration file defining site structure
   - Maps content to categories and subtopics
   - Tracks statistics and metadata

3. **Navigation Updater** (`scripts/update-navigation.js`)
   - Updates all site pages based on content configuration
   - Generates category pages and updates statistics
   - Maintains consistent navigation structure

4. **GitHub Actions Workflows**
   - `content-pr-handler.yml`: Validates PR submissions
   - `update-site-after-merge.yml`: Updates site after PR merges

## 🚀 How to Add New Content

### Step 1: Prepare Your Content

Ensure your Markdown file is:
- Located in a public GitHub repository
- Properly formatted with clear headings
- Contains valuable educational content
- Is accessible via the GitHub API

### Step 2: Update Configuration

Edit `content-config.json` to add your content:

```json
{
  "categories": {
    "kubernetes": {
      "subtopics": {
        "your-subtopic": {
          "name": "Your Subtopic Name",
          "description": "Brief description of the content",
          "content": [
            {
              "id": "unique-content-id",
              "title": "Your Content Title",
              "description": "Detailed description",
              "repo": "owner/repository-name",
              "path": "path/to/your-file.md",
              "addedDate": "2025-01-27",
              "status": "active"
            }
          ]
        }
      }
    }
  }
}
```

### Step 3: Submit Pull Request

1. Fork the repository
2. Create a new branch for your content
3. Update `content-config.json` with your content details
4. Submit a PR using the provided template
5. The system will automatically validate your submission

### Step 4: Automatic Integration

Once your PR is merged:
- Content is automatically integrated into the site
- Navigation is updated to include your content
- Statistics are updated
- The content becomes immediately accessible

## 📋 Content Categories

### Available Categories

1. **Kubernetes** ☸️
   - Container orchestration and microservices
   - Operator patterns, request flows, scaling

2. **Algorithms** 🔢
   - Interactive algorithm visualizations
   - Sorting, trees, graphs, dynamic programming

3. **Networking** 🌐
   - OSI model, TCP/IP, network protocols
   - Network architecture and security

4. **Databases** 🗄️
   - Database design and optimization
   - Replication, scaling, and performance

5. **Microservices** 🏗️
   - Service mesh and API gateways
   - Distributed systems patterns

6. **System Design** 🏛️
   - Scalability patterns and architecture
   - Caching strategies and load balancing

## 🔧 Technical Details

### Template Renderer Features

- **Markdown Parsing**: Uses Marked.js for robust Markdown rendering
- **Syntax Highlighting**: Prism.js for code block highlighting
- **Responsive Design**: Mobile-friendly layout
- **Navigation**: Breadcrumb navigation with category links
- **Metadata**: Displays repository info, paths, and timestamps

### URL Parameters

The template renderer accepts these URL parameters:

- `repo`: GitHub repository (owner/repo)
- `path`: Path to Markdown file
- `category`: Main category (kubernetes, algorithms, etc.)
- `subtopic`: Subtopic identifier
- `title`: Display title for the content

Example:
```
template-md-renderer.html?repo=prepguides/go-interviews&path=operator/README.md&category=kubernetes&subtopic=operator-guide&title=Kubernetes%20Operator%20Guide
```

### Validation Process

The system validates:
- JSON syntax and structure
- GitHub repository accessibility
- Markdown file existence
- Required field presence
- Content categorization accuracy

## 📊 Statistics and Tracking

The system automatically tracks:
- Total content items
- Content by category
- Visualizations vs. guides
- Last updated timestamps
- Active vs. draft content

## 🎯 Example: Kubernetes Operator Guide

The first implementation demonstrates the system with the go-interviews operator guide:

- **Repository**: `prepguides/go-interviews`
- **Path**: `operator/README.md`
- **Category**: `kubernetes`
- **Subtopic**: `operator-guide`
- **Status**: Active and integrated

## 🔄 Workflow Automation

### PR Validation
- Validates JSON configuration
- Tests GitHub repository access
- Generates content preview
- Provides feedback to contributors

### Post-Merge Updates
- Updates navigation structure
- Regenerates category pages
- Updates statistics
- Validates site integrity

## 🛠️ Development and Testing

### Local Testing

1. Update `content-config.json`
2. Run navigation updater:
   ```bash
   node scripts/update-navigation.js
   ```
3. Test template renderer with sample content
4. Verify navigation updates

### Testing Checklist

- [ ] Content renders correctly
- [ ] Navigation links work
- [ ] Statistics are accurate
- [ ] Mobile responsiveness
- [ ] Code highlighting works
- [ ] Breadcrumb navigation functions

## 🚀 Future Enhancements

Planned improvements:
- Search functionality across all content
- Content rating and feedback system
- Automated content quality checks
- Integration with more content sources
- Advanced filtering and categorization
- Content versioning and history

## 📞 Support

For questions or issues:
- Check the GitHub repository issues
- Review the validation logs in GitHub Actions
- Test with the provided example content
- Verify repository accessibility and permissions

---

**Note**: This system is designed to be stealth mode until the first PR is merged and the content goes live. The infrastructure is ready for immediate content integration and scaling.
