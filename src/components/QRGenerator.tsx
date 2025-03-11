import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';

interface QRGeneratorProps {
  onGenerated?: (url: string) => void;
}

interface QROptions {
  width: number;
  margin: number;
  color: {
    dark: string;
    light: string;
  };
}

type QRTemplate = 'text' | 'url' | 'wifi' | 'contact';

const QRGenerator: React.FC<QRGeneratorProps> = ({ onGenerated }) => {
  const [text, setText] = useState<string>('');
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [darkColor, setDarkColor] = useState<string>('#000000');
  const [lightColor, setLightColor] = useState<string>('#ffffff');
  const [qrSize, setQrSize] = useState<number>(300);
  const [template, setTemplate] = useState<QRTemplate>('text');
  
  // Template specific states
  const [wifiName, setWifiName] = useState<string>('');
  const [wifiPassword, setWifiPassword] = useState<string>('');
  const [wifiEncryption, setWifiEncryption] = useState<string>('WPA');
  const [contactName, setContactName] = useState<string>('');
  const [contactEmail, setContactEmail] = useState<string>('');
  const [contactPhone, setContactPhone] = useState<string>('');
  
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Generate formatted text based on template
  useEffect(() => {
    let formattedText = '';
    
    switch (template) {
      case 'text':
        formattedText = text;
        break;
      case 'url':
        // Add https:// if not present and not empty
        if (text && !text.match(/^https?:\/\//i) && text.trim() !== '') {
          formattedText = `https://${text}`;
        } else {
          formattedText = text;
        }
        break;
      case 'wifi':
        if (wifiName) {
          formattedText = `WIFI:S:${wifiName};T:${wifiEncryption};P:${wifiPassword};;`;
        }
        break;
      case 'contact':
        if (contactName || contactEmail || contactPhone) {
          formattedText = 'BEGIN:VCARD\nVERSION:3.0\n';
          if (contactName) formattedText += `FN:${contactName}\n`;
          if (contactEmail) formattedText += `EMAIL:${contactEmail}\n`;
          if (contactPhone) formattedText += `TEL:${contactPhone}\n`;
          formattedText += 'END:VCARD';
        }
        break;
    }
    
    setText(formattedText);
  }, [template, wifiName, wifiPassword, wifiEncryption, contactName, contactEmail, contactPhone]);

  // Generate QR code when text or options change
  useEffect(() => {
    if (text.trim() === '') {
      setQrUrl(null);
      return;
    }

    const generateQR = async () => {
      try {
        setError(null);
        
        const options: QROptions = {
          width: qrSize,
          margin: 2,
          color: {
            dark: darkColor,
            light: lightColor,
          },
        };
        
        // Generate QR code as data URL
        const dataUrl = await QRCode.toDataURL(text, options);
        
        setQrUrl(dataUrl);
        
        // Draw QR code on canvas for better quality
        if (canvasRef.current) {
          await QRCode.toCanvas(canvasRef.current, text, options);
        }
        
        if (onGenerated) {
          onGenerated(dataUrl);
        }
      } catch (err) {
        console.error('Error generating QR code:', err);
        setError('Failed to generate QR code. Please try a different input.');
        setQrUrl(null);
      }
    };

    // Debounce the QR code generation
    const timer = setTimeout(() => {
      generateQR();
    }, 500);

    return () => clearTimeout(timer);
  }, [text, darkColor, lightColor, qrSize, onGenerated]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleDarkColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDarkColor(e.target.value);
  };

  const handleLightColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLightColor(e.target.value);
  };

  const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQrSize(Number(e.target.value));
  };

  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTemplate(e.target.value as QRTemplate);
  };

  const handleDownload = () => {
    if (!qrUrl) return;
    
    const link = document.createElement('a');
    link.href = qrUrl;
    link.download = `qrcode-${template}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="qr-generator">
      <h2>Generate QR Code</h2>
      
      <div className="template-selector">
        <label htmlFor="template-select">Choose QR Code Type:</label>
        <select 
          id="template-select" 
          value={template} 
          onChange={handleTemplateChange}
          className="template-select"
        >
          <option value="text">Plain Text</option>
          <option value="url">Website URL</option>
          <option value="wifi">WiFi Network</option>
          <option value="contact">Contact Information</option>
        </select>
      </div>
      
      {template === 'text' && (
        <div className="input-group">
          <label htmlFor="qr-text">Enter text:</label>
          <textarea
            id="qr-text"
            value={text}
            onChange={handleTextChange}
            placeholder="Enter any text to generate QR code"
            rows={3}
            className="qr-input"
          />
        </div>
      )}
      
      {template === 'url' && (
        <div className="input-group">
          <label htmlFor="qr-url">Enter website URL:</label>
          <input
            type="text"
            id="qr-url"
            value={text.replace(/^https?:\/\//i, '')}
            onChange={(e) => setText(e.target.value)}
            placeholder="example.com"
            className="qr-input"
          />
          <small className="input-hint">https:// will be added automatically if needed</small>
        </div>
      )}
      
      {template === 'wifi' && (
        <div className="template-inputs">
          <div className="input-group">
            <label htmlFor="wifi-name">Network Name (SSID):</label>
            <input
              type="text"
              id="wifi-name"
              value={wifiName}
              onChange={(e) => setWifiName(e.target.value)}
              placeholder="Your WiFi Network Name"
              className="qr-input"
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="wifi-password">Password:</label>
            <input
              type="text"
              id="wifi-password"
              value={wifiPassword}
              onChange={(e) => setWifiPassword(e.target.value)}
              placeholder="WiFi Password"
              className="qr-input"
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="wifi-encryption">Encryption Type:</label>
            <select
              id="wifi-encryption"
              value={wifiEncryption}
              onChange={(e) => setWifiEncryption(e.target.value)}
              className="qr-input"
            >
              <option value="WPA">WPA/WPA2</option>
              <option value="WEP">WEP</option>
              <option value="nopass">No Password</option>
            </select>
          </div>
        </div>
      )}
      
      {template === 'contact' && (
        <div className="template-inputs">
          <div className="input-group">
            <label htmlFor="contact-name">Name:</label>
            <input
              type="text"
              id="contact-name"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              placeholder="Full Name"
              className="qr-input"
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="contact-email">Email:</label>
            <input
              type="email"
              id="contact-email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder="email@example.com"
              className="qr-input"
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="contact-phone">Phone:</label>
            <input
              type="tel"
              id="contact-phone"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              placeholder="+1234567890"
              className="qr-input"
            />
          </div>
        </div>
      )}
      
      <div className="options-container">
        <div className="option-group">
          <label htmlFor="dark-color">QR Code Color:</label>
          <input
            type="color"
            id="dark-color"
            value={darkColor}
            onChange={handleDarkColorChange}
            className="color-picker"
          />
        </div>
        
        <div className="option-group">
          <label htmlFor="light-color">Background Color:</label>
          <input
            type="color"
            id="light-color"
            value={lightColor}
            onChange={handleLightColorChange}
            className="color-picker"
          />
        </div>
        
        <div className="option-group">
          <label htmlFor="qr-size">Size: {qrSize}px</label>
          <input
            type="range"
            id="qr-size"
            min="150"
            max="400"
            step="10"
            value={qrSize}
            onChange={handleSizeChange}
            className="size-slider"
          />
        </div>
      </div>
      
      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}
      
      <div className="qr-output">
        {qrUrl ? (
          <div className="qr-code-container">
            <canvas ref={canvasRef} width={qrSize} height={qrSize} className="qr-canvas"></canvas>
            <div className="qr-actions">
              <button className="download-button" onClick={handleDownload}>
                Download QR Code
              </button>
            </div>
          </div>
        ) : (
          <div className="qr-placeholder" style={{ width: `${qrSize}px`, height: `${qrSize}px` }}>
            <p>QR code will appear here</p>
          </div>
        )}
      </div>
      
      {text && qrUrl && (
        <div className="qr-data">
          <p>Content: <span className="qr-content">{text}</span></p>
        </div>
      )}
    </div>
  );
};

export default QRGenerator; 