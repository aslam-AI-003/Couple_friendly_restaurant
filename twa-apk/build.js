#!/usr/bin/env node
/**
 * Non-interactive APK builder using @bubblewrap/core
 * Builds a TWA (Trusted Web Activity) APK from the twa-manifest.json
 */

const { TwaManifest, TwaGenerator, JdkHelper, AndroidSdkTools, GradleWrapper, ConsoleLog, KeyTool } = require('@bubblewrap/core');
const path = require('path');
const fs = require('fs');

const ANDROID_HOME = '/home/ANT.AMAZON.COM/slmmzm/.bubblewrap/android_sdk';
const JAVA_HOME = '/home/ANT.AMAZON.COM/slmmzm/.bubblewrap/jdk/jdk-17.0.11+9';

async function build() {
  console.log('🏗️  Building Couple Friendly Hub APK...\n');

  const log = new ConsoleLog('build');

  // Read twa-manifest
  const manifestPath = path.join(__dirname, 'twa-manifest.json');
  const manifestData = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

  // Create JDK helper
  const jdkHelper = new JdkHelper(process, JAVA_HOME);

  // Create Android SDK tools  
  const androidSdkTools = new AndroidSdkTools(process, ANDROID_HOME, jdkHelper);

  // Create TWA manifest from data
  const twaManifest = new TwaManifest(manifestData);

  // Generate project
  const outputDir = path.join(__dirname, 'output');
  if (fs.existsSync(outputDir)) {
    fs.rmSync(outputDir, { recursive: true });
  }
  fs.mkdirSync(outputDir, { recursive: true });

  console.log('📦 Generating TWA project...');
  const twaGenerator = new TwaGenerator(log);
  await twaGenerator.createTwaProject(outputDir, twaManifest);

  console.log('🔨 Building APK with Gradle...');
  const gradleWrapper = new GradleWrapper(process, androidSdkTools, outputDir);
  await gradleWrapper.assembleRelease();

  // Find the APK
  const possiblePaths = [
    path.join(outputDir, 'app', 'build', 'outputs', 'apk', 'release', 'app-release-unsigned.apk'),
    path.join(outputDir, 'app', 'build', 'outputs', 'apk', 'release', 'app-release.apk'),
    path.join(outputDir, 'build', 'outputs', 'apk', 'release', 'app-release-unsigned.apk'),
  ];

  let apkFound = false;
  for (const apkPath of possiblePaths) {
    if (fs.existsSync(apkPath)) {
      const destPath = path.join(__dirname, 'couple-friendly-hub.apk');
      fs.copyFileSync(apkPath, destPath);
      console.log(`\n✅ APK built successfully!`);
      console.log(`   Location: ${destPath}`);
      console.log(`   Size: ${(fs.statSync(destPath).size / 1024 / 1024).toFixed(2)} MB`);
      apkFound = true;
      break;
    }
  }

  if (!apkFound) {
    console.log('\n⚠️  Looking for APK files...');
    const walk = (dir) => {
      try {
        const files = fs.readdirSync(dir);
        files.forEach(file => {
          const fullPath = path.join(dir, file);
          const stat = fs.statSync(fullPath);
          if (stat.isDirectory()) {
            walk(fullPath);
          } else if (file.endsWith('.apk')) {
            console.log(`  Found: ${fullPath}`);
            const destPath = path.join(__dirname, 'couple-friendly-hub.apk');
            fs.copyFileSync(fullPath, destPath);
            console.log(`  ✅ Copied to: ${destPath}`);
          }
        });
      } catch (e) {}
    };
    walk(outputDir);
  }
}

build().catch(err => {
  console.error('\n❌ Build failed:', err.message);
  console.error(err.stack);
  process.exit(1);
});
