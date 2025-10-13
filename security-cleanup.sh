#!/bin/bash

echo "🔒 TrickShare Security Cleanup"

# 1. Remove .env.local from git history (if accidentally committed)
git filter-branch --force --index-filter 'git rm --cached --ignore-unmatch .env.local' --prune-empty --tag-name-filter cat -- --all

# 2. Add .env.local to .gitignore if not already there
if ! grep -q ".env.local" .gitignore; then
    echo ".env.local" >> .gitignore
    echo "✅ Added .env.local to .gitignore"
fi

# 3. Remove any AWS credentials from git history
git filter-branch --force --index-filter 'git rm --cached --ignore-unmatch *.pem *.key *credentials*' --prune-empty --tag-name-filter cat -- --all

# 4. Clean up any temporary files
rm -f *.log
rm -f .DS_Store
rm -rf node_modules/.cache

echo "✅ Security cleanup completed"
echo "⚠️  Remember to:"
echo "   - Rotate any exposed AWS credentials"
echo "   - Update environment variables in deployment"
echo "   - Force push to remote: git push origin --force --all"
