# Branch Protection Setup Guide

## 🛡️ Required GitHub Settings

To enable auto-merge functionality, you need to configure branch protection rules for the `main` branch.

### **Step 1: Go to Repository Settings**
1. Navigate to your GitHub repository
2. Click on **Settings** tab
3. Click on **Branches** in the left sidebar

### **Step 2: Add Branch Protection Rule**
1. Click **Add rule** or **Add branch protection rule**
2. In **Branch name pattern**, enter: `main`

### **Step 3: Configure Protection Settings**

#### **Required Settings:**
- ✅ **Require a pull request before merging**
  - ✅ Require approvals: `1`
  - ✅ Dismiss stale PR approvals when new commits are pushed
  - ✅ Require review from code owners: `false` (unless you have CODEOWNERS file)

#### **Optional but Recommended:**
- ✅ **Require status checks to pass before merging**
  - ✅ Require branches to be up to date before merging
  - ✅ Status checks: `PR Automation` (this will be available after first workflow run)

- ✅ **Require conversation resolution before merging**

- ✅ **Require signed commits**: `false` (optional)

- ✅ **Require linear history**: `false` (allows merge commits)

- ✅ **Include administrators**: `true` (applies rules to admins too)

- ✅ **Allow force pushes**: `false`

- ✅ **Allow deletions**: `false`

### **Step 4: Save the Rule**
Click **Create** to save the branch protection rule.

## 🤖 How Auto-Merge Works

### **Trigger Conditions:**
1. **PR Review**: Someone with write access approves the PR (+1)
2. **Self-Approval**: Author comments `/approve` on their own PR
3. **Branch Protection**: All required checks pass
4. **PR Requirements**: 
   - Not in draft mode
   - Has description
   - Follows naming convention (`feature/*`, `fix/*`, `docs/*`, `improve/*`)

### **Auto-Merge Process:**

#### **Option 1: Admin/Reviewer Approval**
1. ✅ **Approval Received**: Admin/contributor approves PR (+1)
2. ✅ **Checks Pass**: All status checks pass
3. ✅ **Auto-Merge**: PR is automatically merged to main
4. ✅ **Branch Cleanup**: Feature branch is deleted
5. ✅ **Deployment**: Vercel automatically deploys changes
6. ✅ **Notification**: Comments added to PR with status

#### **Option 2: Self-Approval (Author)**
1. ✅ **Self-Approval**: Author comments `/approve` on their PR
2. ✅ **Validation**: System checks PR requirements
3. ✅ **Auto-Merge**: PR is automatically merged to main
4. ✅ **Branch Cleanup**: Feature branch is deleted
5. ✅ **Deployment**: Vercel automatically deploys changes
6. ✅ **Notification**: Comments added to PR with status

### **How to Self-Approve:**
1. **Create PR** with proper naming (`feature/algorithm-name`)
2. **Add description** (required)
3. **Comment on PR**: Type `/approve` in a comment
4. **Auto-merge triggers** immediately (if requirements met)

### **Self-Approval Requirements:**
- ✅ **Author Only**: Only the PR author can self-approve
- ✅ **Proper Naming**: Branch must follow convention (`feature/*`, `fix/*`, etc.)
- ✅ **Has Description**: PR must have a description
- ✅ **Not Draft**: PR must not be in draft mode

### **Manual Override:**
- You can still manually merge PRs if needed
- Auto-merge only triggers on approval, not on manual merge
- Draft PRs are never auto-merged

## 🔧 Workflow Files

### **`.github/workflows/auto-merge.yml`**
- Simple auto-merge on approval
- Basic functionality

### **`.github/workflows/pr-automation.yml`**
- Comprehensive PR automation
- Includes requirement checks
- Deployment notifications
- Better error handling

## 🚨 Troubleshooting

### **Auto-merge not working?**
1. Check if branch protection is enabled
2. Verify the PR has been approved
3. Ensure all status checks pass
4. Check if PR follows naming convention
5. Verify PR is not in draft mode

### **Status checks failing?**
1. Check GitHub Actions tab for workflow runs
2. Look for error messages in the logs
3. Ensure all required secrets are set

### **Permission issues?**
1. Verify the GitHub token has necessary permissions
2. Check if the user approving has write access
3. Ensure branch protection allows the workflow to merge

## 📋 Testing the Setup

### **Test PR:**
1. Create a test PR with proper naming (`feature/test-auto-merge`)
2. Add a description
3. Approve the PR
4. Watch it auto-merge

### **Expected Behavior:**
- PR gets approved
- Workflow runs automatically
- PR merges to main
- Branch gets deleted
- Deployment notification appears

## 🎯 Benefits

- **Faster Development**: No manual merge step
- **Consistent Process**: All PRs follow same workflow
- **Automatic Deployment**: Changes go live immediately
- **Clean History**: Branches auto-deleted after merge
- **Notifications**: Clear status updates on PRs

---

**Note**: This setup requires GitHub repository admin access to configure branch protection rules.
