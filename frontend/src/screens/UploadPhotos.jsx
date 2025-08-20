import { useState, useContext } from "react";
import axios from "axios";
import DashboardLayout from "../layouts/DashboardLayout";
import { UserContext } from '../context/UserContext';

export default function UploadPhotos({ userId }) {
  const [files, setFiles] = useState([]);
  const [resultData, setResultData] = useState(null); 
  const [showSkeletal, setShowSkeletal] = useState(false); // toggle state
  const { token } = useContext(UserContext);

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
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`
        }
      });

      console.log("Server Response:", res.data);
      setResultData(res.data);

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

        {/* Show raw JSON */}
        {resultData && (
          <div style={{ background: "#f4f4f4", padding: "10px", marginTop: "20px" }}>
            <h3 className="text-black">Posture Baseline Data:</h3>
            <pre className="text-black">{JSON.stringify(resultData, null, 2)}</pre>
          </div>
        )}

        {/* Toggle button */}
        {resultData && (
          <div style={{ margin: "20px 0" }}>
            <button 
              onClick={() => setShowSkeletal(!showSkeletal)}
              style={{
                padding: "8px 16px",
                background: showSkeletal ? "#007bff" : "#28a745",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer"
              }}
            >
              {showSkeletal ? "Show Overlay Images" : "Show Skeletal Images"}
            </button>
          </div>
        )}

        {/* Show images depending on toggle */}
        <div>
          {resultData && (
            (showSkeletal ? resultData.skeletal_images : resultData.processed_images)?.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`Processed ${i}`}
                style={{ width: '300px', margin: '10px', borderRadius: "8px" }}
              />
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
