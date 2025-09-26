# 🧩 Modular Content Management System

## Overview

The PrepGuides.dev content management system has been redesigned to use a modular approach with a base configuration and small payload files for new content submissions. This makes it much easier for contributors to add new content without managing the entire configuration file.

## 🏗️ System Architecture

### Core Components

1. **Base Configuration** (`base.json`)
   - Contains the core site structure and existing content
   - Defines all categories, subtopics, and their properties
   - Includes base statistics and metadata

2. **Payload Files** (`.github/content-payloads/*.json`)
   - Small JSON files containing only new content information
   - Easy to create and validate
   - Minimal risk of conflicts

3. **Merge Engine** (`scripts/merge-content.js`)
   - Combines base.json with all payload files
   - Generates the final content-config.json
   - Updates statistics automatically

4. **Navigation Updater** (`scripts/update-navigation.js`)
   - Runs merge engine first
   - Updates all site pages based on merged configuration
   - Maintains consistent navigation structure

## 📋 How It Works

### For Contributors

1. **Create Payload File**
   ```bash
   # Create a new payload file
   touch .github/content-payloads/my-content-payload.json
   ```

2. **Fill Payload Template**
   ```json
   {
     "version": "1.0.0",
     "type": "content-addition",
     "metadata": {
       "title": "My Content Title",
       "description": "Brief description",
       "author": "my-username",
       "submissionDate": "2025-01-27",
       "category": "kubernetes",
       "subtopic": "my-subtopic"
     },
     "content": {
       "id": "my-content-id",
       "title": "My Content Title",
       "description": "Detailed description",
       "repo": "owner/repository-name",
       "path": "path/to/markdown-file.md",
       "type": "guide",
       "status": "active"
     },
     "validation": {
       "repoAccessible": true,
       "fileExists": true,
       "contentValid": true,
       "categoryValid": true
     }
   }
   ```

3. **Submit PR**
   - Only the payload file needs to be included
   - System automatically merges with base configuration
   - Generates complete site preview

### For the System

1. **Payload Validation**
   - Validates JSON structure
   - Checks required fields
   - Verifies GitHub repository access

2. **Content Merging**
   - Combines base.json with all payload files
   - Updates statistics automatically
   - Generates final content-config.json

3. **Site Generation**
   - Updates all navigation pages
   - Generates category pages
   - Updates statistics display

## 📁 File Structure

```
prepguides.dev/
├── base.json                           # Base configuration
├── content-config.json                 # Generated configuration (auto-created)
├── .github/
│   ├── content-payloads/               # Payload files directory
│   │   ├── operator-guide-payload.json # Example payload
│   │   └── your-content-payload.json   # Your payload file
│   ├── content-templates/
│   │   ├── PAYLOAD_PR_TEMPLATE.md      # New PR template
│   │   └── content-payload-template.json # Payload template
│   └── workflows/
│       ├── payload-pr-handler.yml      # Payload-based PR validation
│       └── update-site-after-merge.yml # Post-merge updates
├── scripts/
│   ├── merge-content.js                # Content merge engine
│   └── update-navigation.js            # Navigation updater
└── template-md-renderer.html           # Dynamic MD renderer
```

## 🎯 Payload File Format

### Required Fields

```json
{
  "version": "1.0.0",                    // Payload version
  "type": "content-addition",            // Content type
  "metadata": {
    "title": "Content Title",            // Display title
    "description": "Brief description",  // Short description
    "author": "username",                // Contributor username
    "submissionDate": "2025-01-27",      // Submission date
    "category": "kubernetes",            // Main category
    "subtopic": "my-subtopic"           // Subtopic identifier
  },
  "content": {
    "id": "unique-content-id",           // Unique identifier
    "title": "Content Title",            // Content title
    "description": "Detailed description", // Full description
    "repo": "owner/repository-name",     // GitHub repository
    "path": "path/to/file.md",           // File path in repo
    "type": "guide",                     // Content type (guide/visualization)
    "status": "active"                   // Content status
  },
  "validation": {
    "repoAccessible": true,              // Repository access check
    "fileExists": true,                  // File existence check
    "contentValid": true,                // Content validation
    "categoryValid": true                // Category validation
  }
}
```

## 🔄 Workflow Process

### 1. Payload Creation
- Contributor creates payload file
- Fills in required information
- Validates locally (optional)

### 2. PR Submission
- Submit PR with payload file only
- GitHub Actions validates payload
- Tests repository access
- Generates site preview

### 3. Review Process
- Review generated preview
- Check content integration
- Verify navigation updates

### 4. Merge and Deploy
- Merge PR after approval
- System automatically:
  - Merges payload with base configuration
  - Updates all site pages
  - Deploys changes live

## 📊 Benefits

### For Contributors
- ✅ **Simple**: Only need to create one small JSON file
- ✅ **Safe**: No risk of breaking existing configuration
- ✅ **Fast**: Quick to create and submit
- ✅ **Clear**: Minimal required information

### For Maintainers
- ✅ **Isolated**: Changes are contained in payload files
- ✅ **Validated**: Automatic validation and testing
- ✅ **Trackable**: Easy to see what changed
- ✅ **Rollback**: Easy to remove specific content

### For the System
- ✅ **Modular**: Base configuration stays stable
- ✅ **Scalable**: Can handle many payload files
- ✅ **Automated**: Full automation from PR to deployment
- ✅ **Consistent**: Always generates valid configuration

## 🧪 Testing

### Local Testing
```bash
# Test merge engine
node scripts/merge-content.js

# Test navigation update
node scripts/update-navigation.js

# Test template renderer
open template-md-renderer.html?repo=owner/repo&path=file.md
```

### Validation Checklist
- [ ] Payload file structure is valid
- [ ] All required fields are present
- [ ] GitHub repository is accessible
- [ ] Markdown file exists
- [ ] Category and subtopic are valid
- [ ] Content merges successfully
- [ ] Navigation updates correctly
- [ ] Statistics are accurate

## 🚀 Example: Adding New Content

### Step 1: Create Payload
```bash
# Create payload file
echo '{
  "version": "1.0.0",
  "type": "content-addition",
  "metadata": {
    "title": "Docker Best Practices",
    "description": "Comprehensive guide to Docker best practices",
    "author": "contributor",
    "submissionDate": "2025-01-27",
    "category": "kubernetes",
    "subtopic": "docker-guide"
  },
  "content": {
    "id": "docker-best-practices",
    "title": "Docker Best Practices",
    "description": "Comprehensive guide to Docker best practices",
    "repo": "owner/docker-guide",
    "path": "README.md",
    "type": "guide",
    "status": "active"
  },
  "validation": {
    "repoAccessible": true,
    "fileExists": true,
    "contentValid": true,
    "categoryValid": true
  }
}' > .github/content-payloads/docker-guide-payload.json
```

### Step 2: Submit PR
```bash
git add .github/content-payloads/docker-guide-payload.json
git commit -m "Add Docker best practices guide"
git push origin feature/docker-guide
```

### Step 3: Review and Merge
- Review generated preview
- Check content integration
- Merge after approval

## 📞 Support

For questions or issues:
- Check payload file structure against template
- Verify GitHub repository access
- Review validation output in GitHub Actions
- Test locally with provided scripts

---

**The modular system makes content addition simple, safe, and scalable! 🎯**
