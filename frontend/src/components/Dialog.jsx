import React, { useEffect, useState } from "react";
import IDCardPreview from "./IDCardPreview"; // make sure this exists

const Dialog = ({ showDialog, closeDialog, vehicle }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let timer;
    if (showDialog) {
      timer = setTimeout(() => setVisible(true), 500);
    } else {
      setVisible(false);
    }
    return () => clearTimeout(timer);
  }, [showDialog]);

  if (!visible) return null;
  if (!vehicle) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={closeDialog}>
      <div className="relative" onClick={(e) => e.stopPropagation()}>
        <IDCardPreview
          vehicle={vehicle}
          qrCode={vehicle.qrCode}
          onDone={closeDialog}
          onClose={closeDialog}
        />
      </div>
    </div>
  );
};

export default Dialog;
