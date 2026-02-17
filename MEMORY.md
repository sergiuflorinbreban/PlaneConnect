# LONG-TERM MEMORY - PlaneConnect Project & Automated Startup Ideas

## Overview
React Native app for airplane passenger Bluetooth connectivity (works with airplane mode enabled) + Research on automated digital startups.

## Project Structure
- Location: `/Users/brbclawd/.openclaw/workspace/PlaneConnect`
- Tech: React Native 0.76.5, TypeScript, BLE Manager
- Navigation: @react-navigation/native + stack

## Key Files
- App.tsx - Main app component with BLE scanning/advertising, state management, improved UX
- ios/PlaneConnect/Info.plist - Bluetooth permissions configured
- ios/Podfile - CocoaPods configuration

## Permissions Required (Info.plist)
- NSBluetoothAlwaysUsageDescription
- NSBluetoothPeripheralUsageDescription
- NSCameraUsageDescription (for future video)
- NSMicrophoneUsageDescription (for future video)

## Next Steps
1. ✅ Run `pod install` in ios directory - COMPLETED
2. ✅ Create GitHub repo (sergiuflorinbreban/PlaneConnect) - COMPLETED
3. ✅ Add new features targeting airline pain points - COMPLETED
4. ✅ Create feature branch and PR - COMPLETED
5. ✅ UX improvements with state management, BLE permissions, signal bars, emoji buttons - COMPLETED
6. Build in Xcode (requires Xcode installation)
7. Test on physical iOS device
8. Implement WiFi Direct for video streaming
9. Build video sync protocol

## Build Instructions
- Open `ios/PlaneConnect.xcworkspace` in Xcode 14+
- Or use: `npx expo run:ios`
- Xcode required for iOS builds (not installed on current machine)

## Status (2026-02-17)
- Pod install completed successfully (81 dependencies, 81 pods)
- Xcode project generated at `ios/PlaneConnect.xcworkspace`
- Ready to build in Xcode
- GitHub repo created: https://github.com/sergiuflorinbreban/PlaneConnect
- Feature branch `feature/new-features` pushed with new airline pain point features
- PR merged to main with UX improvements: state management, BLE permissions, signal bars, emoji buttons

## Automated Startup Ideas (2026-02-17)
Document: `/Users/brbclawd/.openclaw/workspace/AUTOMATED_STARTUP_IDEAS.md`

### 10 Automated Digital Startup Ideas
1. AI-Powered Micro-SaaS Tools (monthly subscription, $5-50/month)
2. Content Syndication Network (ad revenue, affiliate commissions)
3. Automated Dropshipping with AI (product markup)
4. Automated YouTube Channel with AI (AdSense, sponsorships)
5. API-Based Data Monetization (pay-per-API-call, tiered subscription)
6. Automated Print-on-Demand Store (product markup)
7. Automated Crypto Staking/DeFi Yields Aggregator (performance fee, subscription)
8. Automated Affiliate Marketing Platform (affiliate commissions)
9. Automated Stock Photography Platform (image licensing)
10. Automated SaaS for Niche Industries (monthly subscription)

### Key Success Factors
1. True automation (minimal manual intervention)
2. Scalable infrastructure (serverless preferred)
3. Monetization from day 1
4. Minimal maintenance design
5. Network effects where applicable

### Recommended Starting Points
Based on fullstack React Native/JavaScript skills:
1. API-Based Data Monetization
2. Automated Dropshipping with AI
3. Automated YouTube Channel with AI
4. Automated SaaS for Niche Industries

## BLE Service UUIDs
- SERVICE_UUID: 12345678-1234-5678-1234-56789abcdef0
- DATA_CHARACTERISTIC_UUID: 12345678-1234-5678-1234-56789abcdef1
- CONTROL_CHARACTERISTIC_UUID: 12345678-1234-5678-1234-56789abcdef2

## BLE Notes
- Works with airplane mode enabled
- iOS 13.4+ required
- BLE advertising limited to ~10m range
- Use BLE for discovery/control, WiFi Direct for video data (Android only)
- iOS fallback: hotspot sharing via BLE handshake

## Technical Notes
- State management: IDLE, SCANNING, ADVERTISING, CONNECTING, CONNECTED
- Android 12+ BLE permissions implemented with helpful error messages
- Bluetooth state changes monitored with event listeners
- Signal strength visualized with 5-bar indicator
- Progress bar with MM:SS time format
- Emoji quick-reaction buttons in chat

## Build Troubleshooting
- Pod install encoding issue resolved by setting `export LANG=en_US.UTF-8 && export LC_ALL=en_US.UTF-8`
- Homebrew Ruby encoding issues avoided by using system Ruby (`/usr/bin/ruby`)
- CocoaPods installed via `sudo /usr/bin/gem install cocoapods`
- Full Xcode required for iOS builds (not just command line tools)

## Decisions
- Use BLE (via `react-native-ble-manager`) as primary discovery/control channel
- Use `react-native-webrtc` for video/audio streaming
- Manual project init + dependency installation preferred
- Pod install locale fix via UTF-8 environment variables
- System Ruby + sudo gem install for CocoaPods
- Full Xcode required for iOS builds
- Memory organization: daily notes in `memory/YYYY-MM-DD.md`, high-level in `MEMORY.md`

## Lessons Learned
- Encoding issue with Homebrew Ruby can be resolved by using system Ruby and setting UTF-8 locale
- Xcode installation (not just CLI tools) is required for iOS builds
- BLE permissions must be requested for Android 12+
- Bluetooth state changes should be monitored with event listeners

## Next Steps
- Install Xcode on current machine or use remote machine
- Build and run `PlaneConnect` app on iOS device
- Test BLE functionality end-to-end
- Implement BLE data transmission for chat and sync commands
- Review automated startup ideas and select one for MVP development