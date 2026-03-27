# PakiAPPS (Customer Mobile App)

Welcome to the React Native (Expo) mobile application for PakiAPPS.
The original design concepts are available on [Figma](https://www.figma.com/design/E4Y9z4rrXBx9JwQDgUONIt/PakiAPPS--Copy-).

## Getting Started

### 1. Install Dependencies
Make sure you are in the project folder and run:
```bash
npm install
```
*(If you need to install any missing dependencies, you can also run `npx expo install`)*

### 2. Run the App
This is an Expo project, which means you can easily test it directly on your smartphone by downloading the **Expo Go** app from the iOS App Store or Google Play Store.

**Option A: Tunnel Connection (Most Reliable)**
If your computer has firewall restrictions or your phone isn't on the exact same Wi-Fi network, start the server using a tunnel:
```bash
npx expo start --tunnel
```
Once it finishes starting, simply scan the QR code that appears in your terminal with your phone (use the Camera app on iOS, or the Expo Go app's scanner on Android) to instantly preview the app!

**Option B: Local Network (Faster)**
If your phone and computer are successfully connected to the same Wi-Fi:
```bash
npx expo start
```

## Tech Stack 🛠️
- **Framework:** React Native (`expo`)
- **Navigation:** Expo Router (`app/` directory)
- **Icons:** `lucide-react-native`
- **Component Styling:** `StyleSheet` & specific NativeWind styling.