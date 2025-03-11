import React from 'react';

interface QRResultProps {
  data: string | null;
  onReset: () => void;
}

const QRResult: React.FC<QRResultProps> = ({ data, onReset }) => {
  if (!data) return null;

  // Check if the data is a URL
  const isUrl = /^(https?:\/\/)/i.test(data);

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