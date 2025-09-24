# Development Workflow

## 🚫 **NEVER Commit Directly to Main**

All changes, fixes, and new features must go through the proper PR process.

## ✅ **Proper Development Process**

### **For Bug Fixes:**
```bash
# 1. Create feature branch for the fix
git checkout main
git pull origin main
git checkout -b fix/description-of-fix

# 2. Make changes and commit
git add .
git commit -m "Fix: [Description of the fix]"

# 3. Push branch and create PR
git push origin fix/description-of-fix
gh pr create --title "Fix: [Description]" --body "## 🐛 Bug Fix

### Problem
[Describe the issue]

### Solution
[Describe the fix]

### Testing
- [ ] Tested locally
- [ ] Verified fix works
- [ ] No breaking changes"
```

### **For New Features:**
```bash
# 1. Create feature branch
git checkout main
git pull origin main
git checkout -b feature/algorithm-name

# 2. Implement feature
# [Make changes]

# 3. Commit and push
git add .
git commit -m "Add [Algorithm] visualization (Phase X - [Category])"
git push origin feature/algorithm-name

# 4. Create PR
gh pr create --title "Add [Algorithm] Visualization" --body-file PR_TEMPLATE.md
```

### **For Improvements:**
```bash
# 1. Create improvement branch
git checkout main
git pull origin main
git checkout -b improve/description-of-improvement

# 2. Make improvements
# [Make changes]

# 3. Commit and push
git add .
git commit -m "Improve: [Description of improvement]"
git push origin improve/description-of-improvement

# 4. Create PR
gh pr create --title "Improve: [Description]" --body "## 🔧 Improvement

### What Changed
[Describe the improvement]

### Why
[Explain the reasoning]

### Testing
- [ ] Tested locally
- [ ] No breaking changes
- [ ] Performance verified"
```

## 📋 **Branch Naming Conventions**

- **Features**: `feature/algorithm-name` (e.g., `feature/bfs-dfs`)
- **Bug Fixes**: `fix/description` (e.g., `fix/navigation-links`)
- **Improvements**: `improve/description` (e.g., `improve/tree-rendering`)
- **Documentation**: `docs/description` (e.g., `docs/workflow-guide`)

## 🔄 **PR Process**

### **1. Create PR**
```bash
gh pr create --title "[Type]: [Description]" --body "[Description]"
```

### **2. Review Process**
- Code review required
- Manual testing
- Performance verification
- No breaking changes

### **3. Merge**
```bash
# After approval
gh pr merge [PR_NUMBER] --merge --delete-branch
```

## 🚨 **Emergency Fixes**

For critical production issues only:
```bash
# 1. Create hotfix branch
git checkout main
git checkout -b hotfix/critical-issue

# 2. Fix and commit
git add .
git commit -m "Hotfix: [Critical issue description]"

# 3. Push and create PR immediately
git push origin hotfix/critical-issue
gh pr create --title "🚨 Hotfix: [Issue]" --body "Critical production fix"
```

## 📊 **Current Status**

### **Recent Direct Commits (Should Have Been PRs):**
- `9a732bc` - Fix navigation links in algorithm pages
- `f4e0f1b` - Fix BST visualization with proper tree structure
- `793a99b` - Update main index page with new algorithm structure
- `790475a` - Create algorithms index page and reorganize structure

### **Proper PR Process:**
- `ececaba` - ✅ Merge pull request #1 (Binary Search Tree)

## 🎯 **Going Forward**

**ALL changes must follow this process:**
1. Create feature branch
2. Make changes
3. Commit with descriptive message
4. Push branch
5. Create PR with proper description
6. Review and merge

**No exceptions for:**
- Bug fixes
- New features
- Improvements
- Documentation updates
- Configuration changes

## 🔧 **Quick Commands**

### **Start New Algorithm:**
```bash
git checkout main && git pull origin main
git checkout -b feature/algorithm-name
# Implement algorithm
git add . && git commit -m "Add [Algorithm] visualization"
git push origin feature/algorithm-name
gh pr create --title "Add [Algorithm] Visualization" --body-file PR_TEMPLATE.md
```

### **Fix Bug:**
```bash
git checkout main && git pull origin main
git checkout -b fix/bug-description
# Fix bug
git add . && git commit -m "Fix: [Bug description]"
git push origin fix/bug-description
gh pr create --title "Fix: [Bug]" --body "## 🐛 Bug Fix\n\n[Description]"
```

---

**Remember: Main branch should only receive merges from approved PRs!**
