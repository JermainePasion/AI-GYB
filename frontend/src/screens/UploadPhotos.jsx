import { useState } from "react";
import axios from "axios";

export default function UploadPhotos({ userId }) {
  const [files, setFiles] = useState([]);
  const [processedImages, setProcessedImages] = useState([]); // <-- Added state for processed images
  const [tiltAngle, setTiltAngle] = useState(null); // optional: store threshold

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

      // Save returned data to state
      setProcessedImages(res.data.processed_images || []);
      setTiltAngle(res.data.tilt_angle || null);

    } catch (err) {
      console.error(err);
    }
  };

  return (
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

      {tiltAngle && <p>Detected Tilt Angle: {tiltAngle.toFixed(2)}°</p>}

      <div>
        {processedImages.map((img, i) => (
          <img key={i} src={img} alt={`Processed ${i}`} style={{ width: '300px', margin: '10px' }} />
        ))}
      </div>
    </div>
  );
}
