#!/bin/bash
# Build APK for Couple Friendly Hub using Bubblewrap
# Run this script from the twa-apk/ directory

set -e

# Set environment
export ANDROID_HOME=/home/ANT.AMAZON.COM/slmmzm/.bubblewrap/android_sdk
export JAVA_HOME=/home/ANT.AMAZON.COM/slmmzm/.bubblewrap/jdk/jdk-17.0.11+9
export PATH="$JAVA_HOME/bin:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/build-tools/33.0.0:$PATH"

echo "============================================"
echo "  Couple Friendly Hub - APK Builder"
echo "============================================"
echo ""
echo "Step 1: Initializing Bubblewrap project..."
echo ""

# Run bubblewrap init (interactive - will ask questions)
# Accept defaults for most questions
npx @bubblewrap/cli init --manifest="https://couple-friendly-restaurant.vercel.app/manifest.json"

echo ""
echo "Step 2: Building APK..."
echo ""

# Build the APK
npx @bubblewrap/cli build

echo ""
echo "============================================"
echo "  Build complete!"
echo "  Look for the APK file in this directory"
echo "============================================"
echo ""
ls -la *.apk 2>/dev/null || echo "No APK found - check for errors above"
