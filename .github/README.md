# GitHub Workflows & Protection

This directory contains GitHub Actions workflows and configuration files that enforce the feature branch workflow and maintain code quality.

## 🛡️ Branch Protection

### Workflows

- **`protect-main-branch.yml`** - Blocks direct pushes to main branch
- **`ci.yml`** - Continuous integration checks for PRs and feature branches

### Configuration

- **`BRANCH_PROTECTION.md`** - Instructions for setting up GitHub branch protection rules
- **`hooks/pre-commit`** - Local pre-commit hook to prevent main branch commits

## 🚀 Quick Setup

### 1. Install Local Git Hooks
```bash
./setup-git-hooks.sh
```

### 2. Configure GitHub Branch Protection
Follow the instructions in `BRANCH_PROTECTION.md` to set up branch protection rules in GitHub.

## 🔒 Protection Features

### Server-Side (GitHub Actions)
- ❌ **Blocks direct pushes to main**
- ✅ **Validates Pull Requests**
- 🔍 **Checks HTML file structure**
- 🛡️ **Scans for sensitive information**
- 📋 **Enforces conventional commit format**

### Client-Side (Git Hooks)
- ❌ **Prevents local commits to main**
- 📝 **Encourages conventional commits**
- 💡 **Reminds about feature branch workflow**
- 🔍 **Checks for large files**

## 🎯 Workflow Enforcement

The protection system ensures:

1. **No direct commits to main** - All changes must go through PRs
2. **Code review required** - At least one reviewer must approve
3. **Quality checks** - Automated validation of HTML, links, and structure
4. **Security scanning** - Detection of potential security issues
5. **Consistent formatting** - Conventional commit message format

## 🚨 Emergency Override

In case of emergency, repository administrators can:
1. Temporarily disable branch protection rules in GitHub
2. Make necessary changes
3. Re-enable protection rules
4. Document the emergency in a PR or issue

## 📋 Benefits

- 🛡️ **Prevents accidental direct commits** to main
- 🔍 **Enforces code review** process
- 📋 **Maintains code quality** standards
- 🚀 **Ensures consistent workflow** across the team
- 📚 **Provides clear guidance** when rules are violated
- 🔒 **Protects against security issues**

## 🔧 Customization

You can customize the protection rules by:
- Modifying the workflow files in `.github/workflows/`
- Updating the git hooks in `.github/hooks/`
- Adjusting branch protection settings in GitHub
- Adding new validation checks to the CI workflow

## 📞 Support

If you encounter issues with the protection system:
1. Check the GitHub Actions logs
2. Review the error messages for guidance
3. Follow the suggested workflow steps
4. Contact repository administrators if needed
