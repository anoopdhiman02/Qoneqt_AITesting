#!/bin/bash

# --- Configuration ---
# The URL of the repository you want to check.
# IMPORTANT: Update this if your Qoneqt repo URL is different.
REPO_URL="https://github.com/anoopdhiman02/Qoneqt_AITesting.git" 

# The local directory where a TEST CLONE of the repo will be stored.
# This keeps the test separate from your main project files.
TEST_CLONE_DIR="/Users/hqpl/Desktop/QA_RN"

# The branch to check.
BRANCH="main"

echo "-------------------------------------"
echo "Starting update check on $(date)"
echo "Repository: $REPO_URL"
echo "Branch: $BRANCH"
echo "-------------------------------------"

# --- Initial Setup ---
# If the test directory doesn't exist, clone the repo for the first time.
if [ ! -d "$TEST_CLONE_DIR" ]; then
    echo "Test clone directory not found."
    echo "Cloning repository into '$TEST_CLONE_DIR'..."
    git clone "$REPO_URL" "$TEST_CLONE_DIR"
    if [ $? -ne 0 ]; then
        echo "Error: Failed to clone repository."
        exit 1
    fi
else
    echo "Test clone directory found."
fi

# Navigate into the test repository directory
cd "$TEST_CLONE_DIR" || exit

# --- Check for Updates ---
echo "Fetching latest data from remote..."
git fetch origin

LOCAL=$(git rev-parse $BRANCH)
REMOTE=$(git rev-parse origin/$BRANCH)

echo "Local Hash:  $LOCAL"
echo "Remote Hash: $REMOTE"

if [ "$LOCAL" = "$REMOTE" ]; then
    echo "✅ Your local branch is up-to-date. No action needed."
else
    echo "❗️ Changes detected. Pulling new commits..."
    git pull origin $BRANCH
    echo "✅ Pull complete."
    
    # --- PLACEHOLDER FOR YOUR NEXT STEPS ---
    echo "🚀 Now you would trigger the build and tests..."
    #
    # Example:
    # echo "Running build command..."
    # cd /Users/hqpl/Desktop/Qoneqt-Mobile-App-v3 && npm install && npx expo prebuild
    #
    # echo "Running Maestro tests..."
    # cd /Users/hqpl/Desktop/Qoneqt-Mobile-App-v3 && maestro test maestro_tests/your_flow.yml
    #
fi

echo "-------------------------------------"
echo "Script finished on $(date)"
echo "-------------------------------------"