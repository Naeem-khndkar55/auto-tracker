import React, { useRef } from "react";
import QRCode from "../components/QRCode";
//import "./css/PermitCard.css";
import { IoCloudDownloadOutline } from "react-icons/io5";
import { toCanvas } from "html-to-image"; // Import html-to-image library

const PermitCardNew = ({ vehicle, qrCode, onDone }) => {
  const cardRef = useRef(null);

  const handleDownload = async () => {
    if (!cardRef.current) return;

    try {
      const dpi = 300;
      const widthInInches = 2.1;
      const heightInInches = 3.4;

      const targetWidth = Math.floor(widthInInches * dpi);
      const targetHeight = Math.floor(heightInInches * dpi);

      const scale = dpi / 96;
      const bulueSectionP = document.querySelector(".permit-container");

      if (bulueSectionP) {
        bulueSectionP.setAttribute("style", "border: none !important");
      }

      // const originalCanvas = await html2canvas(cardRef.current, {
      //   scale,
      //   useCORS: true,
      //   scrollX: 0,
      //   scrollY: 0,
      //   windowWidth: document.documentElement.offsetWidth,
      //   windowHeight: document.documentElement.offsetHeight,
      // });
      const originalCanvas = await toCanvas(cardRef.current);

      const finalCanvas = document.createElement("canvas");
      finalCanvas.width = targetWidth;
      finalCanvas.height = targetHeight;
      const ctx = finalCanvas.getContext("2d");
      if (!ctx) throw new Error("Could not get canvas context");

      ctx.drawImage(
        originalCanvas,
        0,
        0,
        originalCanvas.width,
        originalCanvas.height,
        0,
        0,
        targetWidth,
        targetHeight
      );

      const image = finalCanvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      //link.href = dataUrl;
      link.download = `${vehicle.vehicleNumber}.png`;
      link.click();
      onDone();
    } catch (error) {
      console.error("Error generating image:", error);
    }
  };

  return (
    <div className="permit-container">
      <div ref={cardRef}>
        <div className="permit-card">
          <div className="permit-header">
            <h2>মিশুক মালিক সমিতি</h2>
            <p>কুমিল্লা-৩৫০০</p>
            <div className="qr-wrapper">
              <QRCode isDummy={false} size={240} value={qrCode} />
            </div>
          </div>

          <div className="blue-section">
            <p>যানের পরিচিত নাম্বার</p>
            <h3>{vehicle.vehicleNumber}</h3>
            <span>গাড়ির ধরনঃ ৩ সিট মিশুক</span>
          </div>

          <div className="route-section">
            <div className="route-label">
              <span>রুটঃ</span>
            </div>
            {/* <p className="route-text">কুমিল্লা সিটি কর্পোরেশন।</p> */}
            <p className="route-text">{vehicle.permittedRoute}</p>
          </div>

          <div className="note-section">
            <p>কার্ডটি হস্তান্তর যোগ্য নহে</p>
          </div>
        </div>
      </div>

      <button
        onClick={handleDownload}
        className="save-button cursor-pointer hover:text-gray-200"
      >
        <IoCloudDownloadOutline className="mr-2 h-4 w-4" />
        Save Permit Cardspan
      </button>
    </div>
  );
};

export default PermitCardNew;
