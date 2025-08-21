import { useState, useContext } from "react";
import axios from "axios";
import DashboardLayout from "../layouts/DashboardLayout";
import { UserContext } from "../context/UserContext";

export default function UploadPhotos({ userId }) {
  const [files, setFiles] = useState([]);
  const [resultData, setResultData] = useState(null);
  const [showSkeletal, setShowSkeletal] = useState(false);
  const [loading, setLoading] = useState(false); // ✅ Loading state
  const { token } = useContext(UserContext);

  // ✅ Handle file upload (append instead of overwrite, avoid duplicates)
  const handleFileChange = (e) => {
    const selectedFiles = [...e.target.files];
    setFiles((prevFiles) => {
      const existingNames = prevFiles.map((f) => f.name);
      const filteredNew = selectedFiles.filter(
        (f) => !existingNames.includes(f.name)
      );
      return [...prevFiles, ...filteredNew];
    });
  };

  // ✅ Delete image
  const handleDelete = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

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
      setLoading(true); // ✅ Show spinner
      const res = await axios.post(
        "http://localhost:3000/api/upload-photos",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Server Response:", res.data);
      setResultData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false); // ✅ Hide spinner
    }
  };

  return (
    <DashboardLayout>
      <div>
        {/* Only show Upload Photos container if no results yet */}
        {!resultData && (
          <div className="border-2 border-gray-400 rounded-lg p-4 text-2xl font-bold mt-15 ml-100 mr-100 h-120 justify-center items-center text-center">
            Upload Photos
            <form
              onSubmit={handleSubmit}
              className="flex flex-col items-center justify-center w-full"
            >
              {/* Dropzone */}
              <label
                htmlFor="dropzone-file"
                className="flex flex-col items-center justify-center mt-10 w-150 min-h-[310px] border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 relative"
              >
                {files.length === 0 ? (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg
                      className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 16"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                      />
                    </svg>
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      SVG, PNG, JPG or GIF (MAX. 800x400px)
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-4 p-4 w-full">
                    {files.map((file, i) => (
                      <div key={i} className="relative group">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`preview-${i}`}
                          className="w-32 h-32 object-cover rounded-lg border"
                        />
                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            handleDelete(i);
                          }}
                          className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded opacity-80 hover:opacity-100"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <input
                  id="dropzone-file"
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>

              {/* Upload button with loading */}
              <button
                type="submit"
                disabled={loading}
                className={`mt-4 px-4 py-2 rounded-lg text-white ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {loading ? (
                  <div className="flex items-center">
                    <svg
                      className="animate-spin h-5 w-5 mr-2 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      ></path>
                    </svg>
                    Uploading...
                  </div>
                ) : (
                  "Upload"
                )}
              </button>
            </form>
          </div>
        )}



                {/* Show results */}
                {resultData && (
                  <div className="flex flex-col md:flex-row gap-6 mt-40 w-full">
                    {/* Posture Baseline Thresholds */}
                    <div className="w-full ml-20 md:w-1/3 bg-white shadow-lg rounded-xl p-6 border border-gray-200">
                      <h3 className="text-xl font-bold mb-4 border-b pb-2 text-gray-700">
                        Posture Baseline Thresholds
                      </h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        {/* Flex */}
                        <div className="bg-gray-50 p-3 rounded-lg shadow-sm">
                          <p className="text-gray-500">Flex Min</p>
                          <p className="text-blue-600 font-semibold">
                            {parseInt(resultData.flex_min, 10)}
                          </p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg shadow-sm">
                          <p className="text-gray-500">Flex Max</p>
                          <p className="text-blue-600 font-semibold">
                            {parseInt(resultData.flex_max, 10)}
                          </p>
                        </div>

                        {/* GyroY */}
                        <div className="bg-gray-50 p-3 rounded-lg shadow-sm">
                          <p className="text-gray-500">GyroY Min</p>
                          <p className="text-green-600 font-semibold">
                            {parseInt(resultData.gyroY_min, 10)}
                          </p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg shadow-sm">
                          <p className="text-gray-500">GyroY Max</p>
                          <p className="text-green-600 font-semibold">
                            {parseInt(resultData.gyroY_max, 10)}
                          </p>
                        </div>

                        {/* GyroZ */}
                        <div className="bg-gray-50 p-3 rounded-lg shadow-sm">
                          <p className="text-gray-500">GyroZ Min</p>
                          <p className="text-purple-600 font-semibold">
                            {parseInt(resultData.gyroZ_min, 10)}
                          </p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg shadow-sm">
                          <p className="text-gray-500">GyroZ Max</p>
                          <p className="text-purple-600 font-semibold">
                            {parseInt(resultData.gyroZ_max, 10)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Skeletal / Processed Images */}
                    <div className="w-full md:w-2/3 flex flex-wrap justify-center gap-4">
                      {(showSkeletal ? resultData.skeletal_images : resultData.processed_images)?.map((img, i) => (
                        <img
                          key={i}
                          src={img}
                          alt={`Processed ${i}`}
                          className="w-72 h-auto rounded-lg shadow-md"
                        />
                      ))}
                    </div>
                  </div>
                )}




        {/* Toggle & Upload Again buttons side by side */}
        {resultData && (
          <div className="mt-6 ml-20 flex gap-4">
            <button
              onClick={() => setShowSkeletal(!showSkeletal)}
              className={`px-4 py-2 rounded-lg text-white ${
                showSkeletal ? "bg-blue-600" : "bg-green-600"
              }`}
            >
              {showSkeletal ? "Show Overlay Images" : "Show Skeletal Images"}
            </button>

            <button
              onClick={() => {
                setFiles([]);
                setResultData(null);
              }}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800"
            >
              Upload Again
            </button>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
