import React from "react";
import PermitCardNew from "./PermitCard";

const IDCardPreview = ({ vehicle, qrCode, onDone, onClose }) => {
  return (
    <div className="w-full max-w-sm mx-auto bg-white shadow-xl rounded-2xl border border-gray-200 p-4 relative">
      <button
        onClick={onClose}
        className="absolute top-0 right-0 text-gray-600 hover:text-red-500 text-xl bg-gray-400 rounded-full w-8 h-8 flex items-center justify-center"
      >
        ✕
      </button>
      <div className="flex items-center space-x-4">
        <PermitCardNew vehicle={vehicle} qrCode={qrCode} onDone={onDone} />
      </div>
    </div>
  );
};

export default IDCardPreview;
