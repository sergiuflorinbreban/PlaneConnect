# PlaneConnect - iOS App

A React Native app that enables Bluetooth-based connectivity between passengers on airplanes for real-time collaboration and video sharing - all working with airplane mode enabled.

## Features

- **BLE Device Discovery** - Scan for nearby devices using Bluetooth Low Energy (works with airplane mode)
- **Advertise Mode** - Make your device discoverable to other passengers
- **Device Connection** - Connect to discovered devices
- **Cross-Platform** - Works on both iOS and Android

## Tech Stack

- React Native 0.76.5
- React Navigation 6.x
- react-native-ble-manager for Bluetooth LE
- TypeScript

## Prerequisites

- Node.js 18+
- Xcode 14+ (for iOS development)
- iOS device or simulator

## Installation

```bash
cd PlaneConnect
npm install
cd ios
pod install
cd ..
```

## Running the App

### iOS Simulator
```bash
npx react-native run-ios
```

### iOS Physical Device
1. Open `ios/PlaneConnect.xcworkspace` in Xcode
2. Select your device
3. Click Run

## iOS Permissions

The app requires Bluetooth permissions. These are configured in `ios/PlaneConnect/Info.plist`:

- `NSBluetoothAlwaysUsageDescription`
- `NSBluetoothPeripheralUsageDescription`

## Current Status

✅ Project structure created
✅ BLE manager integrated
✅ UI screens created (Home, Scan, Advertise, Device Detail)
✅ Navigation set up
✅ iOS configuration files created

## To Test:

1. Run `pod install` in the `ios` directory
2. Build and run in Xcode
3. Test BLE scanning on a physical device (BLE doesn't work well in iOS simulator)

## Next Steps

1. Test BLE scanning on physical iOS device
2. Implement WiFi Direct for high-bandwidth video streaming
3. Build video sync protocol for coordinated playback
4. Add real-time collaboration features

## License

MIT
