import { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

interface QRScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onScanError?: (error: string) => void;
  width?: string;
  height?: string;
}

const QRScanner: React.FC<QRScannerProps> = ({
  onScanSuccess,
  onScanError,
  width = '100%',
  height = '300px',
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannerContainerId = 'qr-scanner-container';

  useEffect(() => {
    // Check if we're on iOS Safari
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    
    if (isIOS && isSafari) {
      console.log("Running on iOS Safari - special handling may be needed");
    }

    return () => {
      // Clean up on component unmount
      if (scannerRef.current && isScanning) {
        scannerRef.current.stop().catch(error => {
          console.error('Error stopping scanner:', error);
        });
      }
    };
  }, [isScanning]);

  const checkCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      // If we get here, permission is granted
      setPermissionGranted(true);
      // Stop the stream since we're just checking permissions
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch (error) {
      console.error('Camera permission error:', error);
      setPermissionGranted(false);
      if (onScanError) {
        onScanError('Camera permission denied. Please allow camera access.');
      }
      setCameraError('Camera permission denied. Please allow camera access.');
      return false;
    }
  };

  const startScanner = async () => {
    setCameraError(null);
    
    // First check if camera permission is granted
    const hasPermission = await checkCameraPermission();
    if (!hasPermission) {
      return;
    }

    try {
      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode(scannerContainerId);
      }

      setIsScanning(true);
      
      await scannerRef.current.start(
        { facingMode: 'environment' }, // Use the back camera
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        },
        (decodedText) => {
          console.log('QR code successfully scanned:', decodedText);
          
          // Validate the decoded text before passing it to the parent
          if (!decodedText || decodedText.trim() === '') {
            console.error('Empty QR code detected');
            if (onScanError) {
              onScanError('Empty QR code detected');
            }
            return;
          }
          
          // Pass the valid decoded text to the parent component
          onScanSuccess(decodedText);
          
          // Stop scanning after successful scan
          if (scannerRef.current) {
            console.log('Stopping scanner after successful scan');
            scannerRef.current.stop().catch(error => {
              console.error('Error stopping scanner after successful scan:', error);
            });
            setIsScanning(false);
          }
        },
        (errorMessage) => {
          console.log("QR Code scanning error:", errorMessage);
          // Don't report scanning errors to the user, only permission/setup errors
        }
      );
    } catch (error) {
      console.error('Error starting scanner:', error);
      setIsScanning(false);
      setCameraError(error instanceof Error ? error.message : String(error));
      if (onScanError) {
        onScanError(error instanceof Error ? error.message : String(error));
      }
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current && isScanning) {
      try {
        await scannerRef.current.stop();
        setIsScanning(false);
      } catch (error) {
        console.error('Error stopping scanner:', error);
      }
    }
  };

  return (
    <div className="qr-scanner">
      <div 
        id={scannerContainerId} 
        style={{ width, height, margin: '0 auto', position: 'relative' }}
      ></div>
      
      {cameraError && (
        <div className="camera-error">
          <p>{cameraError}</p>
          <p className="help-text">
            On iOS, you may need to enable camera access in Settings &gt; Safari &gt; Camera
          </p>
        </div>
      )}
      
      <div className="scanner-controls">
        {!isScanning ? (
          <button 
            className="scan-button"
            onClick={startScanner}
          >
            {permissionGranted ? 'Start Scanning' : 'Allow Camera & Start Scanning'}
          </button>
        ) : (
          <button 
            className="scan-button stop"
            onClick={stopScanner}
          >
            Stop Scanning
          </button>
        )}
      </div>
    </div>
  );
};

export default QRScanner; 