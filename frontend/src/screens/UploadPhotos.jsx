import { useState } from "react";
import axios from "axios";
import DashboardLayout from "../layouts/DashboardLayout";

export default function UploadPhotos({ userId }) {
  const [files, setFiles] = useState([]);
  const [processedImages, setProcessedImages] = useState([]);
  const [resultData, setResultData] = useState(null); // store all backend results

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length < 2 || files.length > 5) {
      alert("Please select between 2 to 5 images.");
      return;
    }

    const formData = new FormData();
    for (let file of files) {
      formData.append("photos", file);
    }
    formData.append("userId", userId);

    try {
      const res = await axios.post("http://localhost:3000/api/upload-photos", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      console.log("Server Response:", res.data);

      // Store everything in state
      setResultData(res.data);
      setProcessedImages(res.data.processed_images || []);

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DashboardLayout>
      <div>
        <form onSubmit={handleSubmit}>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setFiles([...e.target.files])}
          />
          <button type="submit">Upload</button>
        </form>

        {/* Show raw JSON from backend */}
        {resultData && (
          <div style={{ background: "#f4f4f4", padding: "10px", marginTop: "20px" }}>
            <h3 className="text-black">Posture Baseline Data:</h3>
            <pre className="text-black">{JSON.stringify(resultData, null, 2)}</pre>
          </div>
        )}

        {/* Show processed skeleton images */}
        <div>
          {processedImages.map((img, i) => (
            <img key={i} src={img} alt={`Processed ${i}`} style={{ width: '300px', margin: '10px', color: 'blue'}} />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
