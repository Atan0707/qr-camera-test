import React from 'react';

interface QRResultProps {
  data: string | null;
  onReset: () => void;
}

const QRResult: React.FC<QRResultProps> = ({ data, onReset }) => {
  // Add console log for debugging
  console.log('QRResult rendered with data:', data);
  
  // Enhanced null check to handle empty strings and undefined
  if (!data || data.trim() === '') {
    console.log('QRResult: No valid data to display');
    return (
      <div className="qr-result error">
        <h2>Scan Error</h2>
        <p>No valid data was detected in the QR code.</p>
        <button className="reset-button" onClick={onReset}>
          Try Again
        </button>
      </div>
    );
  }

  // Check if the data is a URL
  const isUrl = /^(https?:\/\/)/i.test(data);
  console.log('QRResult: Is URL?', isUrl);

  return (
    <div className="qr-result">
      <h2>Scan Result</h2>
      <div className="result-content">
        {isUrl ? (
          <div className="url-result">
            <p>Detected URL:</p>
            <a href={data} target="_blank" rel="noopener noreferrer" className="result-link">
              {data}
            </a>
            <div className="action-buttons">
              <button 
                className="open-button" 
                onClick={() => window.open(data, '_blank', 'noopener,noreferrer')}
              >
                Open URL
              </button>
            </div>
          </div>
        ) : (
          <div className="text-result">
            <p>Detected Text:</p>
            <div className="result-text">{data}</div>
          </div>
        )}
      </div>
      <button className="reset-button" onClick={onReset}>
        Scan Another Code
      </button>
    </div>
  );
};

export default QRResult; 