'use client';

import React from 'react';

interface CopyPinButtonProps {
  pin: string;
}

const CopyPinButton: React.FC<CopyPinButtonProps> = ({ pin }) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(pin)
      .then(() => alert('PIN copied to clipboard!'))
      .catch((err) => console.error('Failed to copy: ', err));
  };

  return (
    <button onClick={copyToClipboard}>
      Copy PIN to Clipboard
    </button>
  );
};

export default CopyPinButton;