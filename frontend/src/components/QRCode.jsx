import React, { useEffect, useState } from 'react';

const QRCode = ({ 
    value = '', 
    
  size = 200, 
  isDummy = false 
}) => {
  const [qrBase64, setQrBase64] = useState(null);

  useEffect(() => {
    if (isDummy) return;
  }, [value, size, isDummy]);

  if (isDummy) {
    return (
      <div 
        className="bg-gray-200 flex items-center justify-center" 
        style={{ 
          width: `${size}px`, 
          height: `${size}px` 
        }}
      >
        <span className="text-gray-500">Dummy QR</span>
      </div>
    );
  }

  return value ? (
    <img
      src={value}
      alt="QR Code"
      style={{ width: `${size}px`, height: `${size}px` }}
    />
  ) : null;
};

export default QRCode;
