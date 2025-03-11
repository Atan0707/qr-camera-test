import { useState, useEffect } from 'react'
import './App.css'
import QRGenerator from './components/QRGenerator'
import QRScanner from './components/QRScanner'

function App() {
  const [isIOS, setIsIOS] = useState(false);
  const [activeTab, setActiveTab] = useState<'generator' | 'scanner'>('generator');
  const [scanError, setScanError] = useState<string | null>(null);

  useEffect(() => {
    // More comprehensive iOS detection
    const iosDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && 
                      !/CriOS/.test(navigator.userAgent); // Excludes Chrome on iOS
    setIsIOS(iosDevice);
  }, []);

  const handleScanResult = (decodedText: string) => {
    console.log('Scan result:', decodedText);
    setScanError(null);
    // You can add additional handling here if needed
  };

  const handleScanError = (error: string) => {
    console.error('Scan error:', error);
    setScanError(error);
    // You can add additional error handling here
  };

  // Reset error when changing tabs
  useEffect(() => {
    setScanError(null);
  }, [activeTab]);

  return (
    <div className="app-container">
      <header>
        <h1>QR Code Tool</h1>
        <p className="subtitle">Create and scan QR codes for text, URLs, WiFi networks, and contacts</p>
      </header>

      <div className="toggle-container">
        <div className="toggle-buttons">
          <button 
            className={`toggle-button ${activeTab === 'generator' ? 'active' : ''}`}
            onClick={() => setActiveTab('generator')}
          >
            Generate QR
          </button>
          <button 
            className={`toggle-button ${activeTab === 'scanner' ? 'active' : ''}`}
            onClick={() => setActiveTab('scanner')}
          >
            Scan QR
          </button>
        </div>
      </div>

      {scanError && (
        <div className="app-error-message">
          <p>An error occurred: {scanError}</p>
        </div>
      )}

      <main>
        {activeTab === 'generator' ? (
          <div className="generator-section">
            <QRGenerator />
          </div>
        ) : (
          <div className="scanner-section">
            <QRScanner 
              onScan={handleScanResult}
              onError={handleScanError}
              onClose={() => setActiveTab('generator')}
            />
          </div>
        )}
        
        {activeTab === 'generator' && (
          <div className="instructions">
            <h3>How to use:</h3>
            <ol>
              <li>Select the type of QR code you want to create</li>
              <li>Fill in the required information</li>
              <li>Customize the colors and size if desired</li>
              <li>Download the generated QR code</li>
              <li>Scan with any QR code reader app</li>
            </ol>
            
            {isIOS && (
              <div className="ios-note">
                <h4>Note for iPhone users:</h4>
                <ul>
                  <li>You can scan QR codes directly with your iPhone camera</li>
                  <li>Just open your camera app and point it at the QR code</li>
                  <li>Tap the notification that appears to open the link or view the content</li>
                  <li>When using our scanner, you may need to use the "Upload QR Code Image" option</li>
                </ul>
              </div>
            )}
            
            <div className="features">
              <h4>Features:</h4>
              <ul>
                <li>Generate QR codes for text, URLs, WiFi networks, and contact information</li>
                <li>Customize QR code colors and size</li>
                <li>Download QR codes as PNG images</li>
                <li>Scan QR codes using your device camera</li>
                <li>Upload QR code images for scanning (great for iOS devices)</li>
                <li>Works on all devices and browsers</li>
              </ul>
            </div>
          </div>
        )}
      </main>

      <footer>
        <p>QR Code Tool | Made with ❤️ using React and TypeScript</p>
      </footer>
    </div>
  )
}

export default App
