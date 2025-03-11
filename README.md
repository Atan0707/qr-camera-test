# QR Code Scanner App

A simple, mobile-friendly QR code scanner web application built with React, TypeScript, and Vite. This app allows users to scan QR codes using their device's camera and displays the decoded content.

## Features

- Scan QR codes using your device's camera
- Upload QR code images for scanning (especially useful for iOS devices)
- Works on mobile browsers including iPhone Safari
- Automatically detects and provides clickable links for URL QR codes
- Clean, responsive UI optimized for mobile devices
- Simple and intuitive user experience

## Prerequisites

- Node.js (v14 or higher)
- Yarn package manager

## Installation

1. Clone this repository:
```bash
git clone <repository-url>
cd qr-test
```

2. Install dependencies:
```bash
yarn install
```

3. Start the development server:
```bash
yarn dev
```

4. Open the application in your browser:
- For local development: http://localhost:5173/
- For testing on mobile devices, you'll need to:
  - Make sure your computer and mobile device are on the same network
  - Use your computer's local IP address (e.g., http://192.168.1.x:5173)
  - Or use a tool like ngrok to expose your local server

## Usage

1. Open the app in your mobile browser
2. Click "Start Camera Scanning" to activate your camera
   - Or use "Upload QR Code Image" to scan from an image (recommended for iOS)
3. If using camera mode:
   - Point your camera at a QR code
   - Hold steady until the code is recognized
4. If using upload mode:
   - Select an image containing a QR code from your device
   - The app will automatically process and decode it
5. View the decoded content
6. Click "Close Scanner" to return to the main screen

## iOS-Specific Instructions

Due to limitations with camera access in web browsers on iOS devices, we recommend:

1. **Use the Upload Feature**: The most reliable method on iOS is to use the "Upload QR Code Image" button
   - Take a photo of the QR code using your native camera app
   - Then upload that image through our app

2. **Alternative Method**: Use the built-in iOS Camera app
   - The native iOS Camera app has QR code scanning capabilities
   - Simply open your Camera app and point it at a QR code
   - Tap the notification that appears to open the link or view the content

3. **Camera Access**: If you prefer to use our in-app scanner:
   - Make sure to grant camera permissions when prompted
   - Use good lighting conditions
   - Hold the device steady
   - If scanning doesn't work, try the upload method instead

## Building for Production

To build the app for production:

```bash
yarn build
```

The built files will be in the `dist` directory, ready to be deployed to a web server.

## Technologies Used

- React
- TypeScript
- Vite
- html5-qrcode

## Browser Compatibility

This app works best on:
- Safari on iOS (iPhone, iPad) - using the image upload feature
- Chrome on Android
- Modern desktop browsers (Chrome, Firefox, Safari, Edge)

## Troubleshooting

If you experience issues with the scanner:

1. **Camera not working on iOS**: This is a known limitation. Use the "Upload QR Code Image" feature instead.
2. **Permission denied**: Make sure you've granted camera permissions to the website.
3. **Scanner not detecting codes**: Ensure good lighting and hold the device steady.
4. **App crashes or freezes**: Try refreshing the page or using a different browser.

## License

MIT
