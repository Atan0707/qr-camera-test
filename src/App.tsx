import { useState, useEffect } from 'react'
import './App.css'
import QRScanner from './components/QRScanner'
import QRResult from './components/QRResult'

function App() {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if we're on iOS
    const iosDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iosDevice);
  }, []);

  const handleScanSuccess = (decodedText: string) => {
    console.log('App received scan result:', decodedText);
    
    // Validate the decoded text
    if (!decodedText || decodedText.trim() === '') {
      console.error('App received empty scan result');
      setScanError('Empty QR code detected');
      return;
    }
    
    setScanResult(decodedText);
    setScanError(null);
  };

  const handleScanError = (error: string) => {
    console.error('App received scan error:', error);
    setScanError(error);
  };

  const handleReset = () => {
    console.log('Resetting scan state');
    setScanResult(null);
    setScanError(null);
  };

  return (
    <div className="app-container">
      <header>
        <h1>QR Code Scanner</h1>
        <p className="subtitle">Scan QR codes with your iPhone camera</p>
      </header>

      <main>
        {!scanResult ? (
          <>
            <div className="scanner-section">
              <QRScanner 
                onScanSuccess={handleScanSuccess} 
                onScanError={handleScanError}
              />
            </div>
            {scanError && (
              <div className="error-message">
                <p>Error: {scanError}</p>
              </div>
            )}
            <div className="instructions">
              <h3>How to use:</h3>
              <ol>
                <li>Click "Start Scanning" to activate your camera</li>
                <li>Point your camera at a QR code</li>
                <li>Hold steady until the code is recognized</li>
                <li>View the decoded content</li>
              </ol>
              
              {isIOS && (
                <div className="ios-note">
                  <h4>Note for iPhone users:</h4>
                  <ul>
                    <li>Make sure to allow camera access when prompted</li>
                    <li>If no camera appears, go to Settings &gt; Safari &gt; Camera and allow access</li>
                    <li>Safari is required - the scanner won't work in apps like Facebook or Instagram browsers</li>
                  </ul>
                </div>
              )}
            </div>
          </>
        ) : (
          <QRResult data={scanResult} onReset={handleReset} />
        )}
      </main>

      <footer>
        <p>Works on iPhone Safari and other mobile browsers</p>
      </footer>
    </div>
  )
}

export default App
