import React, { useState, useEffect, useRef, ChangeEvent } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

interface QRScannerProps {
  onScan?: (decodedText: string, decodedResult: unknown) => void;
  onError?: (error: string) => void;
  onClose?: () => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onScan, onError, onClose }) => {
  const [scanning, setScanning] = useState<boolean>(false);
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);
  const [availableCameras, setAvailableCameras] = useState<Array<{ id: string; label: string }>>([]);
  const [selectedCamera, setSelectedCamera] = useState<string>('');
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [isIOS, setIsIOS] = useState<boolean>(false);
  const [isProcessingImage, setIsProcessingImage] = useState<boolean>(false);
  
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scannerContainerId = 'qr-scanner-container';
  
  // Check if device is iOS
  useEffect(() => {
    const iosDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iosDevice);
  }, []);
  
  // Initialize scanner on component mount
  useEffect(() => {
    scannerRef.current = new Html5Qrcode(scannerContainerId);
    
    // Check for camera permissions and available devices
    Html5Qrcode.getCameras()
      .then(devices => {
        if (devices && devices.length > 0) {
          setAvailableCameras(devices);
          setSelectedCamera(devices[0].id);
          setPermissionGranted(true);
        } else {
          setPermissionGranted(false);
          if (onError) onError('No camera devices found');
        }
      })
      .catch(err => {
        console.error('Error getting cameras', err);
        setPermissionGranted(false);
        if (onError) onError('Camera permission denied or no cameras available');
      });
      
    // Cleanup on unmount
    return () => {
      if (scannerRef.current && scanning) {
        scannerRef.current.stop()
          .catch(err => console.error('Error stopping scanner', err));
      }
    };
  }, []);
  
  const startScanner = async () => {
    if (!scannerRef.current || !selectedCamera) return;
    
    try {
      setScanning(true);
      setScanResult(null);
      
      const qrCodeSuccessCallback = (decodedText: string, decodedResult: unknown) => {
        setScanResult(decodedText);
        if (onScan) onScan(decodedText, decodedResult);
      };
      
      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0
      };
      
      await scannerRef.current.start(
        selectedCamera,
        config,
        qrCodeSuccessCallback,
        (errorMessage: string) => {
          // This is a non-fatal error, so we just log it
          console.warn(errorMessage);
        }
      );
    } catch (err) {
      console.error('Error starting scanner', err);
      setScanning(false);
      if (onError) onError('Failed to start the QR scanner');
    }
  };
  
  const stopScanner = async () => {
    if (!scannerRef.current || !scanning) return;
    
    try {
      await scannerRef.current.stop();
      setScanning(false);
    } catch (err) {
      console.error('Error stopping scanner', err);
    }
  };
  
  const handleCameraChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (scanning) {
      stopScanner().then(() => {
        setSelectedCamera(e.target.value);
      });
    } else {
      setSelectedCamera(e.target.value);
    }
  };
  
  const handleClose = () => {
    stopScanner().then(() => {
      if (onClose) onClose();
    });
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    if (!file) return;
    
    setIsProcessingImage(true);
    setScanResult(null);
    
    if (scannerRef.current) {
      scannerRef.current.scanFile(file, true)
        .then(decodedText => {
          setScanResult(decodedText);
          if (onScan) onScan(decodedText, { result: decodedText });
        })
        .catch(err => {
          console.error('Error scanning file', err);
          if (onError) onError('Could not decode QR code from image');
        })
        .finally(() => {
          setIsProcessingImage(false);
          // Reset file input
          if (fileInputRef.current) fileInputRef.current.value = '';
        });
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  return (
    <div className="qr-scanner">
      <h2>Scan QR Code</h2>
      
      {permissionGranted === false && !isIOS && (
        <div className="error-message">
          <p>Camera access denied or no cameras available.</p>
          <p>Please grant camera permissions and refresh the page.</p>
        </div>
      )}
      
      {isIOS && (
        <div className="ios-instructions">
          <p>For best results on iOS devices:</p>
          <ol>
            <li>You can upload a photo of a QR code</li>
            <li>Or try using your device's native camera app to scan QR codes directly</li>
          </ol>
        </div>
      )}
      
      <div className="scanner-options">
        {/* File upload option - works well for iOS */}
        <div className="file-upload-container">
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleFileUpload} 
            ref={fileInputRef}
            style={{ display: 'none' }}
          />
          <button 
            onClick={triggerFileInput} 
            className="scanner-button upload-button"
            disabled={isProcessingImage}
          >
            {isProcessingImage ? 'Processing...' : 'Upload QR Code Image'}
          </button>
        </div>
        
        {/* Camera scanning option - may not work well on iOS */}
        {permissionGranted && (
          <>
            <div className="camera-controls">
              {availableCameras.length > 1 && (
                <div className="camera-selector">
                  <label htmlFor="camera-select">Select Camera:</label>
                  <select 
                    id="camera-select" 
                    value={selectedCamera} 
                    onChange={handleCameraChange}
                    disabled={scanning}
                    className="camera-select"
                  >
                    {availableCameras.map(camera => (
                      <option key={camera.id} value={camera.id}>
                        {camera.label || `Camera ${camera.id}`}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              
              <div className="scanner-buttons">
                {!scanning ? (
                  <button 
                    onClick={startScanner} 
                    className="scanner-button start-button"
                    disabled={!selectedCamera}
                  >
                    Start Camera Scanning
                  </button>
                ) : (
                  <button 
                    onClick={stopScanner} 
                    className="scanner-button stop-button"
                  >
                    Stop Scanning
                  </button>
                )}
                
                <button 
                  onClick={handleClose} 
                  className="scanner-button close-button"
                >
                  Close Scanner
                </button>
              </div>
            </div>
            
            <div id={scannerContainerId} className="scanner-container"></div>
          </>
        )}
      </div>
      
      {scanResult && (
        <div className="scan-result">
          <h3>Scan Result:</h3>
          <div className="result-content">
            <p>{scanResult}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default QRScanner; 