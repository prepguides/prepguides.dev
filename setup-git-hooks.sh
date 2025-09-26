#!/bin/bash

# Setup script to install git hooks for the PrepGuides.dev project
# This script helps enforce the feature branch workflow

echo "🔧 Setting up Git hooks for PrepGuides.dev..."

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "❌ Error: Not in a git repository"
    exit 1
fi

# Create hooks directory if it doesn't exist
mkdir -p .git/hooks

# Copy the pre-commit hook
if [ -f ".github/hooks/pre-commit" ]; then
    cp .github/hooks/pre-commit .git/hooks/pre-commit
    chmod +x .git/hooks/pre-commit
    echo "✅ Pre-commit hook installed successfully"
else
    echo "❌ Error: Pre-commit hook not found at .github/hooks/pre-commit"
    exit 1
fi

# Create a commit-msg hook for conventional commits
cat > .git/hooks/commit-msg << 'EOF'
#!/bin/bash

# Commit message hook to encourage conventional commit format
commit_regex='^(feat|fix|docs|style|refactor|test|chore|perf|ci|build|revert)(\(.+\))?: .+'

if ! grep -qE "$commit_regex" "$1"; then
    echo "⚠️  WARNING: Commit message doesn't follow conventional commit format"
    echo ""
    echo "💡 Recommended format:"
    echo "   feat: add new feature"
    echo "   fix: resolve bug"
    echo "   docs: update documentation"
    echo "   refactor: restructure code"
    echo ""
    echo "Current message: $(cat "$1")"
    echo ""
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Commit cancelled"
        exit 1
    fi
fi
EOF

chmod +x .git/hooks/commit-msg
echo "✅ Commit message hook installed successfully"

# Create a post-checkout hook to remind about workflow
cat > .git/hooks/post-checkout << 'EOF'
#!/bin/bash

# Post-checkout hook to remind about workflow
current_branch=$(git rev-parse --abbrev-ref HEAD)

if [ "$current_branch" = "main" ]; then
    echo "📋 You're now on the main branch"
    echo "💡 Remember: Use feature branches for new work:"
    echo "   git checkout -b feature/your-feature-name"
fi
EOF

chmod +x .git/hooks/post-checkout
echo "✅ Post-checkout hook installed successfully"

echo ""
echo "🎉 Git hooks setup completed!"
echo ""
echo "📋 What these hooks do:"
echo "   • Pre-commit: Prevents direct commits to main branch"
echo "   • Commit-msg: Encourages conventional commit format"
echo "   • Post-checkout: Reminds about feature branch workflow"
echo ""
echo "🛡️  These hooks help enforce the feature branch workflow:"
echo "   1. Create feature branch: git checkout -b feature/your-feature-name"
echo "   2. Make changes and commit"
echo "   3. Push feature branch: git push origin feature/your-feature-name"
echo "   4. Create Pull Request to merge into main"
echo ""
echo "✅ You're all set! Happy coding!"
