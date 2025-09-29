import React, { useState } from "react";

export default function UploadDataButton({ userToken }) {
  const [status, setStatus] = useState("");

  const handleUpload = async () => {
    try {
      setStatus("⏳ Connecting...");
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ name: "AI-GYB" }],
        optionalServices: ["4fafc201-1fb5-459e-8fcc-c5c9c331914b"],
      });

      const server = await device.gatt.connect();
      const service = await server.getPrimaryService(
        "4fafc201-1fb5-459e-8fcc-c5c9c331914b"
      );
      const characteristic = await service.getCharacteristic(
        "beb5483e-36e1-4688-b7f5-ea07361b26a8"
      );

      // Buffer for CSV lines
      let csvLines = [];

      const handleNotification = (event) => {
        const value = new TextDecoder().decode(event.target.value);
        console.log("📥 Received:", value);

        if (value === "NO_CSV") {
          setStatus("⚠️ No CSV file on device");
          characteristic.removeEventListener("characteristicvaluechanged", handleNotification);
          return;
        }

        if (value === "CSV_DELETED") {
          setStatus("✅ CSV deleted from device");
          return;
        }

        if (value === "CSV_END") {
          // Join all buffered lines into one CSV string
          const csvText = csvLines.join("\n");
          console.log("✅ Full CSV received:", csvText);

          // Upload to backend
          uploadCSV(csvText);

          // Clean up listener
          characteristic.removeEventListener("characteristicvaluechanged", handleNotification);
          return;
        }

        // Otherwise, store CSV line
        csvLines.push(value);
      };

      characteristic.addEventListener(
        "characteristicvaluechanged",
        handleNotification
      );
      await characteristic.startNotifications();

      // Request CSV from ESP32
      await characteristic.writeValue(new TextEncoder().encode("GET_CSV"));
      setStatus("📡 Receiving CSV...");

    } catch (err) {
      console.error("❌ Upload error:", err);
      setStatus("❌ Upload failed");
    }
  };

  const uploadCSV = async (csvText) => {
    try {
      setStatus("⏳ Uploading to server...");
      const formData = new FormData();
      formData.append("file", new Blob([csvText], { type: "text/csv" }), "posture_log.csv");

      await fetch("http://localhost:3000/api/users/upload-log", {
        method: "POST",
        headers: { Authorization: `Bearer ${userToken}` },
        body: formData,
      });

      setStatus("✅ Upload complete. Deleting CSV...");

      // Tell ESP32 to delete CSV after upload
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ name: "AI-GYB" }],
        optionalServices: ["4fafc201-1fb5-459e-8fcc-c5c9c331914b"],
      });
      const server = await device.gatt.connect();
      const service = await server.getPrimaryService("4fafc201-1fb5-459e-8fcc-c5c9c331914b");
      const characteristic = await service.getCharacteristic("beb5483e-36e1-4688-b7f5-ea07361b26a8");
      await characteristic.writeValue(new TextEncoder().encode("DELETE_CSV"));
    } catch (err) {
      console.error("❌ Server upload error:", err);
      setStatus("❌ Upload failed at server");
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
