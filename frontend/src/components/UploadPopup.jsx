import React from "react";

function UploadPopup({ visible }) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white text-black px-6 py-4 rounded-xl shadow-lg animate-fadeIn">
        <h3 className="text-lg font-semibold mb-2">Upload Complete!</h3>
        <p>Your CSV data has been uploaded successfully.</p>
      </div>
    </div>
  );
}

export default UploadPopup;
