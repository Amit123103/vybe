# 📱 VYBE — Social Media App

> *"Where your vibe finds its tribe"*

A short-form social media app built with **React Native**, **Expo SDK 50**, and **TypeScript** — featuring photo/video posts, stories, real-time messaging, custom reactions, and a bold Gen Z aesthetic.

---

## 📋 Table of Contents

- [Prerequisites](#-prerequisites)
- [Quick Start (Development)](#-quick-start-development)
- [Run on Your Phone (Expo Go)](#-run-on-your-phone-expo-go)
- [Build & Deploy to Real Device](#-build--deploy-to-real-device)
  - [Option A — EAS Build (Recommended)](#option-a--eas-build-recommended-easiest)
  - [Option B — Local Build](#option-b--local-build-advanced)
- [Publish to App Stores](#-publish-to-app-stores)
- [Project Structure](#-project-structure)
- [Tech Stack](#-tech-stack)
- [Environment Variables](#-environment-variables)
- [Troubleshooting](#-troubleshooting)

---

## 🔧 Prerequisites

Install these on your computer before starting:

| Tool | Version | Install Command / Link |
|------|---------|----------------------|
| **Node.js** | 18+ | [https://nodejs.org](https://nodejs.org) |
| **npm** | 9+ | Comes with Node.js |
| **Expo CLI** | Latest | `npm install -g expo-cli` |
| **EAS CLI** | Latest | `npm install -g eas-cli` |
| **Git** | Any | [https://git-scm.com](https://git-scm.com) |
| **Expo Go App** | Latest | Download from App Store / Play Store on your phone |

### Verify Installation

```bash
node --version    # Should show v18.x or higher
npm --version     # Should show 9.x or higher
expo --version    # Should show latest version
eas --version     # Should show latest version
```

---

## 🚀 Quick Start (Development)

### Step 1 — Clone & Install

```bash
# Navigate to project
cd "c:\Users\amita\My Project\Projects\app"

# Install all dependencies
npm install
```

### Step 2 — Add Fonts

Download these fonts and place the `.otf` files in `assets/fonts/`:

| Font | Download |
|------|----------|
| **Clash Display** (Bold, Semibold, Medium) | [https://www.fontshare.com/fonts/clash-display](https://www.fontshare.com/fonts/clash-display) |
| **Satoshi** (Regular, Medium, Bold) | [https://www.fontshare.com/fonts/satoshi](https://www.fontshare.com/fonts/satoshi) |

Required files:
```
assets/fonts/
├── ClashDisplay-Bold.otf
├── ClashDisplay-Semibold.otf
├── ClashDisplay-Medium.otf
├── Satoshi-Regular.otf
├── Satoshi-Medium.otf
└── Satoshi-Bold.otf
```

### Step 3 — Set Up Environment

```bash
# Copy the example env file
copy .env.example .env
```

Edit `.env` and fill in your values:
```env
EXPO_PUBLIC_API_URL=https://your-backend-url.com/api
EXPO_PUBLIC_SOCKET_URL=https://your-backend-url.com
EXPO_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
EXPO_PUBLIC_APPLE_CLIENT_ID=com.vybe.app
```

> 💡 If you don't have a backend yet, the app will still load — it just won't fetch data.

### Step 4 — Start Development Server

```bash
npx expo start
```

This will show a QR code in your terminal. You're ready!

---

## 📲 Run on Your Phone (Expo Go)

This is the **fastest way** to see the app on your real phone — no build needed.

### For Android:

1. Install **Expo Go** from Google Play Store
2. Run `npx expo start` on your computer
3. Open Expo Go app on your phone
4. **Scan the QR code** shown in the terminal
5. The app loads instantly on your phone! 🎉

### For iPhone:

1. Install **Expo Go** from Apple App Store
2. Run `npx expo start` on your computer
3. Open your **iPhone Camera app**
4. **Scan the QR code** shown in the terminal
5. Tap the notification banner to open in Expo Go
6. The app loads instantly on your phone! 🎉

> ⚠️ **Important**: Your computer and phone must be on the **same Wi-Fi network**.

> 💡 If QR code doesn't work, press `s` in terminal to switch to **Tunnel mode**, then scan again.

---

## 📦 Build & Deploy to Real Device

When you want a **standalone app** (.apk for Android / .ipa for iOS) that works without Expo Go:

### Option A — EAS Build (Recommended, Easiest)

EAS (Expo Application Services) builds your app in the cloud. No Xcode or Android Studio needed!

#### Step 1 — Create Expo Account

```bash
# Sign up at https://expo.dev/signup, then login:
eas login
```

#### Step 2 — Configure EAS

```bash
eas build:configure
```

This creates an `eas.json` file. Ensure it looks like this:

```json
{
  "cli": {
    "version": ">= 7.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "autoIncrement": true
    }
  },
  "submit": {
    "production": {}
  }
}
```

#### Step 3 — Build for Android (.apk)

```bash
# Build a preview APK (can install directly on phone)
eas build --platform android --profile preview
```

⏱️ **Wait time**: 10–20 minutes (builds in the cloud)

When done, you'll get a **download link**. 

#### Step 4 — Install on Android Phone

1. Open the **download link** on your Android phone's browser
2. Download the `.apk` file
3. Tap the downloaded file
4. If prompted, allow **"Install from unknown sources"**:
   - Go to Settings → Security → Enable "Unknown Sources"
   - Or Settings → Apps → Special Access → Install Unknown Apps
5. Tap **Install**
6. Open the app! 🎉

#### Step 5 — Build for iOS (.ipa)

```bash
# Build for iOS (requires Apple Developer Account - $99/year)
eas build --platform ios --profile preview
```

⏱️ **Wait time**: 15–30 minutes

#### Step 6 — Install on iPhone

**Method 1 — Using EAS (Easiest)**:
1. After build completes, EAS gives you a QR code
2. Scan with your iPhone camera
3. Install the app from the prompt

**Method 2 — Using TestFlight**:
1. Build with production profile: `eas build --platform ios --profile production`
2. Submit to TestFlight: `eas submit --platform ios`
3. Open TestFlight app on your iPhone
4. Accept the invite and install

---

### Option B — Local Build (Advanced)

For building on your own machine:

#### Android Local Build

**Requirements**: Android Studio + JDK 17

```bash
# Generate Android project
npx expo prebuild --platform android

# Build APK
cd android
./gradlew assembleRelease

# APK will be at:
# android/app/build/outputs/apk/release/app-release.apk
```

Transfer the APK to your phone and install.

#### iOS Local Build

**Requirements**: Mac + Xcode 15+ + Apple Developer Account

```bash
# Generate iOS project
npx expo prebuild --platform ios

# Open in Xcode
cd ios
open VybeApp.xcworkspace

# In Xcode:
# 1. Select your team under Signing & Capabilities
# 2. Connect your iPhone via USB
# 3. Select your iPhone as the run target
# 4. Click the Play ▶ button
```

---

## 🌍 Publish to App Stores

### Google Play Store

1. **Create a Google Play Developer Account** ($25 one-time fee)
   - [https://play.google.com/console](https://play.google.com/console)

2. **Build production version**:
   ```bash
   eas build --platform android --profile production
   ```

3. **Submit to Play Store**:
   ```bash
   eas submit --platform android
   ```
   
4. Or manually upload the `.aab` file in Google Play Console

5. Fill in store listing (screenshots, description, etc.)

6. Submit for review (usually 1–3 days)

### Apple App Store

1. **Create an Apple Developer Account** ($99/year)
   - [https://developer.apple.com](https://developer.apple.com)

2. **Build production version**:
   ```bash
   eas build --platform ios --profile production
   ```

3. **Submit to App Store**:
   ```bash
   eas submit --platform ios
   ```

4. Fill in App Store Connect listing

5. Submit for review (usually 1–2 days)

---

## 🗂️ Project Structure

```
app/
├── App.tsx                    # Entry point with all providers
├── assets/fonts/              # Custom fonts (Clash Display + Satoshi)
├── global.css                 # NativeWind global styles
├── babel.config.js            # Babel config
├── tailwind.config.js         # Tailwind/NativeWind config
├── .env.example               # Environment variables template
└── src/
    ├── constants/             # Colors, typography, spacing, config, endpoints
    ├── types/                 # TypeScript interfaces (user, post, message, etc.)
    ├── services/              # API client, auth, feed, post, user, socket, storage
    ├── store/                 # Zustand stores (auth, theme, notification, draft)
    ├── utils/                 # Validators, formatters, helpers
    ├── hooks/                 # Custom hooks (useAuth, useFeed, useChat, etc.)
    ├── components/
    │   ├── common/            # VybeButton, VybeInput, VybeAvatar, etc.
    │   ├── layout/            # Screen, AppHeader, TabBar
    │   ├── feed/              # PostCard, PostMedia, VybeReactions, StoriesBar
    │   ├── profile/           # ProfileHeader, ProfileGrid, FollowButton
    │   └── messaging/         # ChatBubble, ChatInput, ConversationItem
    ├── navigation/            # Auth, Feed, Profile, Main, App navigators
    └── screens/
        ├── Auth/              # Splash, Onboarding, Login, Register, ForgotPassword
        ├── Feed/              # FeedScreen, PostDetailScreen
        ├── Explore/           # ExploreScreen
        ├── Create/            # CreatePostScreen, CameraScreen
        ├── Notifications/     # NotificationsScreen
        ├── Messages/          # InboxScreen, ChatScreen
        └── Profile/           # ProfileScreen, EditProfile, Followers, Settings
```

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | React Native + Expo SDK 50 |
| Language | TypeScript (strict) |
| Navigation | React Navigation v6 |
| State | Zustand + TanStack Query |
| Storage | MMKV + SecureStore |
| Styling | NativeWind (Tailwind CSS) |
| Animations | React Native Reanimated v3 |
| Forms | React Hook Form + Zod |
| Lists | FlashList |
| Real-time | Socket.IO Client |
| HTTP | Axios |

---

## 🔐 Environment Variables

| Variable | Description |
|----------|-------------|
| `EXPO_PUBLIC_API_URL` | Backend API base URL |
| `EXPO_PUBLIC_SOCKET_URL` | Socket.IO server URL |
| `EXPO_PUBLIC_GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `EXPO_PUBLIC_APPLE_CLIENT_ID` | Apple Sign-In client ID |

---

## ❓ Troubleshooting

### "Module not found" error
```bash
npm install
npx expo start --clear
```

### QR code not working
- Ensure phone and PC are on **same Wi-Fi**
- Press `s` in terminal to switch to **Tunnel mode**
- Or press `w` to open web version first to verify

### Fonts not loading
- Ensure all 6 `.otf` files are in `assets/fonts/`
- Files must not be empty (download actual fonts from FontShare)
- Restart with `npx expo start --clear`

### Build fails on EAS
```bash
# Check build logs:
eas build:list

# View specific build log:
eas build:view
```

### Android install blocked
- Settings → Security → Enable "Install from unknown sources"
- Or Settings → Apps → Vybe → Allow installation

### iOS "Untrusted Developer" error
- Settings → General → VPN & Device Management → Trust your developer profile

---

## 📝 Common Commands

```bash
# Start development server
npx expo start

# Start with cache cleared
npx expo start --clear

# Start in tunnel mode (when QR doesn't work)
npx expo start --tunnel

# Build Android APK
eas build --platform android --profile preview

# Build iOS
eas build --platform ios --profile preview

# Build both platforms
eas build --platform all --profile production

# Submit to stores
eas submit --platform android
eas submit --platform ios

# Update over-the-air (no new build needed)
eas update --branch production --message "Bug fixes"
```

---

## 📄 License

MIT © Vybe Team

---

**Built with ❤️ using React Native & Expo**
