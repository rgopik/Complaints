# Complaints Analyzer - Mobile App

A React Native mobile application built with Expo for analyzing complaint text. This app provides sentiment analysis, threat detection, vulnerability assessment, and allows users to submit feedback.

## Features

- **Text Input**: Enter up to 10,000 characters of complaint text
- **Analysis Display**: View sentiment, threat level, vulnerability, key expressions, and details
- **Feedback System**: Submit feedback about analysis results
- **Mobile-Optimized**: Responsive design optimized for mobile devices
- **Cross-Platform**: Runs on iOS, Android, and web browsers

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (version 14 or higher)
- npm or yarn package manager
- Expo CLI: `npm install -g @expo/cli`
- For physical device testing: Expo Go app from App Store/Google Play

## Installation

1. **Navigate to the expo directory**:
   ```bash
   cd expo
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

## Configuration

### Backend Server Setup

The app needs to be configured to connect to your backend server:

1. **Copy the configuration template**:
   ```bash
   cp config.example.js config.js
   ```

2. **Edit `config.js`** and update the `BACKEND_URL`:
   ```javascript
   export const CONFIG = {
     BACKEND_URL: 'http://YOUR_IP_ADDRESS:5000', // Replace with your backend server IP
     // ... other settings
   };
   ```

**Note**: If you don't create a `config.js` file, the app will use default settings with `http://192.168.1.100:5000` as the backend URL.

### Finding Your IP Address

To run the app on a physical device, you need your computer's IP address:

**On Windows:**
```bash
ipconfig
```
Look for "IPv4 Address" under your active network connection.

**On macOS/Linux:**
```bash
ifconfig
```
Look for "inet" under your active network interface (usually en0 or eth0).

**Example Configuration:**
```javascript
export const CONFIG = {
  BACKEND_URL: 'http://192.168.1.100:5000', // Your computer's IP
  // ... other settings
};
```

**Important Notes:**
- The `config.js` file is ignored by git, so your backend URL won't be committed
- Always use `config.example.js` as a template for new setups
- Make sure your backend server allows CORS requests from your mobile device IP

## Running the Application

### Development Mode

1. **Start the Expo development server**:
   ```bash
   npm start
   ```
   or
   ```bash
   expo start
   ```

2. **Choose your platform**:
   - Press `a` for Android emulator
   - Press `i` for iOS simulator (macOS only)
   - Press `w` for web browser
   - Scan QR code with Expo Go app on your phone

### Platform-Specific Commands

**For Android:**
```bash
npm run android
```

**For iOS (macOS only):**
```bash
npm run ios
```

**For Web:**
```bash
npm run web
```

## Testing on Physical Devices

### Using Expo Go App

1. **Install Expo Go** on your mobile device:
   - iOS: Download from App Store
   - Android: Download from Google Play Store

2. **Connect to the same network**: Ensure your mobile device and development computer are on the same Wi-Fi network

3. **Start the development server**:
   ```bash
   npm start
   ```

4. **Scan the QR code**: Use the Expo Go app to scan the QR code displayed in your terminal or browser

### Network Configuration

If you're having trouble connecting:

1. **Ensure firewall allows connections** on port 19000 (Expo default)
2. **Use tunnel mode** if on different networks:
   ```bash
   expo start --tunnel
   ```
3. **Check your IP address** is correctly configured in the `CONFIG.BACKEND_URL`

## Backend API Requirements

The mobile app expects the backend to provide the following endpoints:

### POST /analyze
Analyzes the provided text and returns analysis results.

**Request:**
```json
{
  "text": "Your complaint text here"
}
```

**Response:**
```json
{
  "sentiment": "negative|neutral|positive",
  "threat": "low|medium|high",
  "vulnerability": "description of vulnerability",
  "expressions": ["key", "phrases", "found"],
  "details": "Additional analysis details"
}
```

### POST /feedback
Submits user feedback about the analysis.

**Request:**
```json
{
  "originalText": "Original complaint text",
  "analysis": { /* analysis result object */ },
  "feedback": "User feedback text"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Feedback submitted successfully"
}
```

## Troubleshooting

### Common Issues

**1. "Network Error" when analyzing text:**
- Check that your backend server is running
- Verify the `BACKEND_URL` in `App.js` is correct
- Ensure your device can reach the backend server
- Check firewall settings

**2. "Unable to connect to development server":**
- Ensure your device and computer are on the same Wi-Fi network
- Try using tunnel mode: `expo start --tunnel`
- Check if port 19000 is blocked by firewall

**3. App crashes on startup:**
- Clear Expo cache: `expo start -c`
- Restart the Expo development server
- Check for JavaScript errors in the console

### Development Tips

**1. Hot Reloading:**
- The app supports hot reloading - changes will appear automatically
- Shake your device or press Ctrl+M (Android) / Cmd+D (iOS) for developer menu

**2. Debugging:**
- Use React Developer Tools for debugging
- Check the console output in your terminal
- Use `console.log()` statements for debugging

**3. Testing Different Devices:**
- Test on both iOS and Android if possible
- Use different screen sizes to ensure responsiveness
- Test with poor network conditions

## Project Structure

```
expo/
├── App.js                 # Main application component
├── config.js             # Configuration file (create from config.example.js)
├── config.example.js     # Configuration template
├── package.json          # Project dependencies and scripts
├── app.json             # Expo configuration
├── assets/              # Static assets (images, icons)
├── node_modules/        # Installed dependencies
├── .gitignore          # Git ignore rules
└── README.md           # This file
```

## Dependencies

- **expo**: Core Expo framework
- **react**: React library
- **react-native**: React Native framework
- **axios**: HTTP client for API requests
- **@react-native-async-storage/async-storage**: Local storage
- **react-native-paper**: Material Design components
- **react-native-vector-icons**: Icon library

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test on multiple platforms
5. Submit a pull request

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review Expo documentation: https://docs.expo.dev/
3. Open an issue in the repository

## License

This project is licensed under the MIT License.