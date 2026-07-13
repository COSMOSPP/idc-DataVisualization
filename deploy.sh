#!/usr/bin/env bash

# abort on errors
set -e

# Get remote URL
REMOTE_URL=$(git remote get-url origin)

# Build the project
npm run build

# Navigate into the build output directory
cd dist

# Initialize a temporary git repo in dist
git init
git checkout -b gh-pages
git add -A
git commit -m 'deploy'

# Force push to the gh-pages branch of the remote repo
git push -f "$REMOTE_URL" gh-pages

cd -
