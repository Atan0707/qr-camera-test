# QR Code Scanner App

A simple, mobile-friendly QR code scanner web application built with React, TypeScript, and Vite. This app allows users to scan QR codes using their device's camera and displays the decoded content.

## Features

- Scan QR codes using your device's camera
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

1. Open the app in your mobile browser (Safari for iPhone)
2. Click "Start Scanning" to activate your camera
3. Point your camera at a QR code
4. Hold steady until the code is recognized
5. View the decoded content
6. Click "Scan Another Code" to scan a new QR code

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
- Safari on iOS (iPhone, iPad)
- Chrome on Android
- Modern desktop browsers (Chrome, Firefox, Safari, Edge)

## Notes for iOS Safari Users

- When using the app on iOS Safari, you'll need to grant camera permissions when prompted
- For optimal scanning, ensure good lighting conditions
- Hold the device steady when scanning QR codes

## License

MIT
