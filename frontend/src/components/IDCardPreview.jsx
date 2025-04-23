import React from "react";
import PermitCardNew from "./PermitCard";

const IDCardPreview = ({ vehicle, qrCode, onDone }) => {
  return (
    <div className="w-full max-w-sm mx-auto bg-white shadow-xl rounded-2xl border border-gray-200 p-4">
      <div className="flex items-center space-x-4">
        <PermitCardNew vehicle={vehicle} qrCode={qrCode} onDone={onDone} />
      </div>
    </div>
  );
};

export default IDCardPreview;
