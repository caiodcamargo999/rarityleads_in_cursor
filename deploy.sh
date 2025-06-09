#!/bin/bash

# 🚀 Rarity Leads Deployment Script
# This script helps you deploy your Rarity Leads project to GitHub and Netlify

echo "🚀 Rarity Leads Deployment Script"
echo "=================================="

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📝 Initializing Git repository..."
    git init
    echo "✅ Git initialized"
fi

# Add all files
echo "📁 Adding files to Git..."
git add .

# Get commit message from user
echo "💬 Enter commit message (or press Enter for default):"
read commit_message

if [ -z "$commit_message" ]; then
    commit_message="🚀 Deploy Rarity Leads with bulletproof authentication system"
fi

# Commit changes
echo "💾 Committing changes..."
git commit -m "$commit_message"

# Check if remote origin exists
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "🔗 Enter your GitHub repository URL:"
    echo "Example: https://github.com/yourusername/rarity-leads.git"
    read repo_url
    
    if [ ! -z "$repo_url" ]; then
        git remote add origin "$repo_url"
        echo "✅ Remote origin added"
    else
        echo "❌ No repository URL provided. Please add manually:"
        echo "git remote add origin https://github.com/yourusername/rarity-leads.git"
        exit 1
    fi
fi

# Push to GitHub
echo "📤 Pushing to GitHub..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo "✅ Successfully pushed to GitHub!"
    echo ""
    echo "🌐 Next Steps:"
    echo "1. Go to https://netlify.com"
    echo "2. Click 'New site from Git'"
    echo "3. Choose GitHub and select your repository"
    echo "4. Set build command: npm run build"
    echo "5. Set publish directory: ."
    echo "6. Click 'Deploy site'"
    echo ""
    echo "🔧 Don't forget to:"
    echo "- Update Supabase credentials in app-config.js"
    echo "- Enable Google OAuth in Supabase"
    echo "- Set up email verification templates"
    echo ""
    echo "🎉 Your Rarity Leads platform will be live soon!"
else
    echo "❌ Failed to push to GitHub. Please check your credentials and try again."
    exit 1
fi
