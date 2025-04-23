import React, { useEffect, useState } from "react";
import IDCardPreview from "./IDCardPreview"; // make sure this exists

const Dialog = ({ showDialog, closeDialog, vichicle }) => {
  const [visible, setVisible] = useState(false);

  // Handle 0.5s delay
  useEffect(() => {
    let timer;
    if (showDialog) {
      timer = setTimeout(() => setVisible(true), 500); // delay
    } else {
      setVisible(false);
    }
    return () => clearTimeout(timer);
  }, [showDialog]);

  // Hide if not visible
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-transparent bg-opacity-50 flex items-center justify-center py-[7%] px-[20%]">
      <div className="bg-white rounded-xl p-6 shadow-lg w-full h-full relative">
        <button
          onClick={closeDialog}
          className="absolute top-2 right-2 text-gray-600 hover:text-red-500 text-xl"
        >
          ✕
        </button>

        {/* ID Card Preview Here */}
        <IDCardPreview vehicle={vichicle} qrCode={vichicle.qrCode} onDone={closeDialog} />
      </div>
    </div>
  );
};

export default Dialog;
