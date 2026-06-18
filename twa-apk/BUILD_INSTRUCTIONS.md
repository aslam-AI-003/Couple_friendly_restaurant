# Build APK Instructions for Couple Friendly Hub

## Option 1: Build APK using Bubblewrap CLI (Local Build)

Run these commands **one by one** in your terminal:

```bash
# 1. Navigate to the twa-apk directory
cd ~/couply/Couple_friendly_restaurant/twa-apk

# 2. Set environment variables
export ANDROID_HOME=/home/ANT.AMAZON.COM/slmmzm/.bubblewrap/android_sdk
export JAVA_HOME=/home/ANT.AMAZON.COM/slmmzm/.bubblewrap/jdk/jdk-17.0.11+9
export PATH="$JAVA_HOME/bin:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/build-tools/33.0.0:$PATH"

# 3. Initialize the TWA project (interactive - press Enter to accept defaults)
npx @bubblewrap/cli init --manifest="https://couple-friendly-restaurant.vercel.app/manifest.json"

# 4. Build the APK (will ask for keystore password - use "android" or create your own)
npx @bubblewrap/cli build
```

### During `init`, it will ask:
- **Domain**: couple-friendly-restaurant.vercel.app (press Enter - auto-detected)
- **URL path**: / (press Enter)
- **App name**: Couple Friendly Hub (press Enter)
- **Short name**: Couple Friendly (press Enter)
- **Package ID**: com.couplefriendly.hub (press Enter)
- **Theme color**: #e91e63 (press Enter)
- **Background color**: #1a1a2e (press Enter)
- **Start URL**: / (press Enter)
- **Icon URL**: press Enter to accept
- **Signing key**: It will ask to create a new signing key - say Yes
  - **Keystore password**: Enter a password you'll remember (e.g., `couple123`)
  - **Key alias**: couple-friendly
  - **Key password**: Same as keystore password
  - **First and Last Name**: Your Name
  - **Organization**: Couple Friendly Hub

### During `build`:
- Enter your keystore password when prompted
- The APK will be generated in the current directory

---

## Option 2: Use PWABuilder (Easiest - No Local Setup Required!)

This is the **RECOMMENDED** and easiest approach:

1. Go to **https://www.pwabuilder.com/**
2. Enter your website URL: `https://couple-friendly-restaurant.vercel.app`
3. Click **"Start"**
4. It will analyze your PWA and show a report
5. Click **"Package for stores"**
6. Select **"Android"**
7. Choose **"Google Play"** option
8. Configure:
   - Package ID: `com.couplefriendly.hub`
   - App name: `Couple Friendly Hub`
   - Version: `1.0.0`
9. Click **"Generate"**
10. Download the APK/AAB file

This generates a signed APK that you can:
- Install directly on Android phones
- Upload to Google Play Store

---

## Option 3: Use Bubblewrap on PWABuilder (Online)

1. Go to https://nicolo.nicolo.nicolo... 

Actually the simplest is **PWABuilder.com** - it does everything online without needing Android SDK locally.

---

## Installing the APK on your phone

Once you have the APK file:

1. Transfer it to your Android phone (via email, Google Drive, or USB)
2. On your phone, go to **Settings > Security > Install unknown apps**
3. Allow installation from the source you're using
4. Open the APK file and tap **Install**

---

## For Google Play Store submission

You'll need an AAB (Android App Bundle) instead of APK:
- PWABuilder generates both APK and AAB
- Upload the AAB to Google Play Console ($25 one-time fee)
