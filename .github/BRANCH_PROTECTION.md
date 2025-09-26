# Branch Protection Rules

This document outlines the branch protection rules that should be configured in GitHub to enforce the feature branch workflow.

## Required Branch Protection Rules for `main` branch:

### 1. **Require a pull request before merging**
- ✅ Enable: "Require a pull request before merging"
- ✅ Required number of reviewers: 1
- ✅ Dismiss stale PR approvals when new commits are pushed
- ✅ Require review from code owners (if CODEOWNERS file exists)

### 2. **Require status checks to pass before merging**
- ✅ Enable: "Require status checks to pass before merging"
- ✅ Required status checks:
  - `protect-main` (from protect-main-branch.yml workflow)
  - `validate-pr` (from protect-main-branch.yml workflow)

### 3. **Require branches to be up to date before merging**
- ✅ Enable: "Require branches to be up to date before merging"

### 4. **Restrict pushes that create files**
- ✅ Enable: "Restrict pushes that create files"
- ✅ Allow specified actors: Repository administrators only

### 5. **Allow force pushes**
- ❌ Disable: "Allow force pushes" (for everyone)
- ❌ Disable: "Allow force pushes" (for specified actors)

### 6. **Allow deletions**
- ❌ Disable: "Allow deletions"

## How to Configure:

1. Go to your repository on GitHub
2. Navigate to Settings → Branches
3. Click "Add rule" or edit existing rule for `main` branch
4. Configure the settings as outlined above
5. Click "Create" or "Save changes"

## Workflow Enforcement:

The `.github/workflows/protect-main-branch.yml` workflow will:
- ❌ **Block any direct pushes to main**
- ✅ **Validate Pull Requests**
- 📋 **Provide helpful error messages** with instructions
- 🔍 **Check PR title format** (conventional commits)
- 🛡️ **Enforce code quality standards**

## Emergency Override:

In case of emergency, repository administrators can:
1. Temporarily disable branch protection rules
2. Make necessary changes
3. Re-enable protection rules
4. Document the emergency in a PR or issue

## Benefits:

- 🛡️ **Prevents accidental direct commits** to main
- 🔍 **Enforces code review** process
- 📋 **Maintains code quality** standards
- 🚀 **Ensures consistent workflow** across the team
- 📚 **Provides clear guidance** when rules are violated
