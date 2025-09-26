# 📝 Add New Content (Payload-Based)

## 🎯 Content Information

**Content Title**: `Your Content Title`
**Description**: `Brief description of what this content covers`

## 📂 Categorization

**Main Category**: 
- [ ] Kubernetes
- [ ] Algorithms  
- [ ] Networking
- [ ] Databases
- [ ] Microservices
- [ ] System Design

**Subtopic**: `your-subtopic-name`
**Content Type**: 
- [ ] Guide/Tutorial
- [ ] Reference Documentation
- [ ] Best Practices
- [ ] Interview Questions
- [ ] Code Examples

## 📋 Content Details

**Source Repository**: 
```
https://github.com/owner/repository-name
```

**Markdown File Path**:
```
path/to/your-markdown-file.md
```

**Content ID**: `unique-content-identifier`

## 🔍 Preview

**What will users learn from this content?**
<!-- Describe the key learning outcomes -->

**How does this fit into the existing content structure?**
<!-- Explain how this complements existing content -->

## 📄 Payload File

Create a file named `your-content-id-payload.json` in the `.github/content-payloads/` directory with the following structure:

```json
{
  "version": "1.0.0",
  "type": "content-addition",
  "metadata": {
    "title": "Your Content Title",
    "description": "Brief description of what this content covers",
    "author": "your-username",
    "submissionDate": "2025-01-27",
    "category": "your-category",
    "subtopic": "your-subtopic"
  },
  "content": {
    "id": "unique-content-identifier",
    "title": "Your Content Title",
    "description": "Detailed description of the content",
    "repo": "owner/repository-name",
    "path": "path/to/your-markdown-file.md",
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

## ✅ Checklist

- [ ] I have verified the GitHub repository is public and accessible
- [ ] I have confirmed the markdown file exists and is readable
- [ ] I have created the payload file in `.github/content-payloads/`
- [ ] I have provided accurate categorization information
- [ ] I have added appropriate description and metadata
- [ ] I understand this content will be publicly available on PrepGuides.dev

## 🚀 Expected Outcome

After this PR is merged:
1. The content will be automatically merged into the base configuration
2. Navigation will be updated to include this content
3. Site statistics will be updated
4. The content will be accessible via the template renderer

## 📸 Screenshots (Optional)

<!-- If applicable, add screenshots of the content -->

---

**Note**: This PR uses the new payload-based system. You only need to add a small JSON payload file - the system will automatically merge it with the base configuration and update all navigation.
