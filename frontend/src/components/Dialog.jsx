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
    <div className="fixed inset-0 z-50 bg-black/40 bg-opacity-80 flex items-center justify-center">
      <div className="">
        {/* ID Card Preview Here */}

        <IDCardPreview
          vehicle={vichicle}
          qrCode={vichicle.qrCode}
          onDone={closeDialog}
          onClose={closeDialog}
        />
      </div>
    </div>
  );
};

export default Dialog;
