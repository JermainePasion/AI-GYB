import React, { useState, useContext } from "react";
import { BluetoothContext } from "../context/BluetoothContext";

export default function UploadDataButton({ userToken }) {
  const [status, setStatus] = useState("");
  const {
    requestCsvFromEsp32,
    sendDeleteCommand,
    pauseLogging,
    resumeLogging,
    connected,
    connectBLE,
  } = useContext(BluetoothContext);

  const handleUpload = async () => {
    try {
      if (!connected) {
        setStatus("⏳ Connecting to device...");
        await connectBLE();
      }

      // --- Pause logging before CSV pull ---
      await pauseLogging();

      setStatus("📡 Requesting CSV from ESP32...");
      const csvText = await requestCsvFromEsp32();
      console.log("✅ Full CSV received:", csvText);

      if (!csvText || csvText.trim().length === 0) {
        setStatus("⚠️ No CSV data on device");
        await resumeLogging(); // safety resume
        return;
      }

      // --- Upload to backend ---
      setStatus("⏳ Uploading CSV to server...");
      const formData = new FormData();
      formData.append(
        "file",
        new Blob([csvText], { type: "text/csv" }),
        "posture_log.csv"
      );

      await fetch("http://localhost:3000/api/users/upload-log", {
        method: "POST",
        headers: { Authorization: `Bearer ${userToken}` },
        body: formData,
      });

      setStatus("✅ Upload complete. Deleting CSV...");

      // --- Delete CSV on device ---
      await sendDeleteCommand();
      setStatus("🗑 CSV deleted from ESP32");

      // --- Resume logging after deletion ---
      await resumeLogging();
    } catch (err) {
      console.error("❌ Upload error:", err);
      setStatus("❌ Upload failed");
      // make sure logging is resumed even on error
      try { await resumeLogging(); } catch {}
    }
  };

  return (
    <div>
      <button
        onClick={handleUpload}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Upload Data
      </button>
      <p>{status}</p>
    </div>
  );
}
