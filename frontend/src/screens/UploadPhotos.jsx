import { useState, useContext } from "react";
import axios from "axios";
import DashboardLayout from "../layouts/DashboardLayout";
import { UserContext } from "../context/UserContext";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


export default function UploadPhotos({ userId }) {
  const [files, setFiles] = useState([]);
  const [resultData, setResultData] = useState(null);
  const [showSkeletal, setShowSkeletal] = useState(false);
  const [loading, setLoading] = useState(false);
  const { token } = useContext(UserContext);

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
      setLoading(true);
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
      setResultData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  

  return (
    <DashboardLayout>
      <div className="px-4 sm:px-6 lg:px-8">
        {/* Upload Photos Section */}
        {!resultData && (
          <div className="border-2 border-gray-400 rounded-lg p-6 text-xl sm:text-2xl font-bold mt-8 sm:mt-12 max-w-4xl mx-auto text-center">
            Upload Photos
            <form
              onSubmit={handleSubmit}
              className="flex flex-col items-center justify-center w-full"
            >
              {/* Dropzone */}
              <label
                htmlFor="dropzone-file"
                className="flex flex-col items-center justify-center mt-6 w-full sm:w-3/4 lg:w-2/3 min-h-[250px] sm:min-h-[300px] border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 relative"
              >
                {files.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-6">
                    <svg
                      className="w-10 h-10 mb-4 text-gray-500 dark:text-gray-400"
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
                      JPG, PNG (max. 800×400px)
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 w-full">
                    {files.map((file, i) => (
                      <div key={i} className="relative group">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`preview-${i}`}
                          className="w-28 sm:w-32 h-28 sm:h-32 object-cover rounded-lg border"
                        />
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

              {/* Upload button */}
              <button
                type="submit"
                disabled={loading}
                className={`mt-4 px-4 py-2 rounded-lg text-white w-full sm:w-auto ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#8DBCC7]  hover:bg-[#638f99] transition"
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
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

        {/* Results Section */}
        {resultData && (
          <div className="flex flex-col md:flex-row gap-6 mt-10 w-full">
            {/* Posture Baseline */}
            <div className="w-full md:w-1/3 bg-white shadow-lg rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg sm:text-xl font-bold mb-4 border-b pb-2 text-gray-700">
                Posture Baseline
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-gray-50 p-3 rounded-lg shadow-sm">
                  <p className="text-gray-500">Flex Min</p>
                  <p className="text-blue-600 font-semibold">
                    {parseInt(resultData.thresholds.flex_min, 10)}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg shadow-sm">
                  <p className="text-gray-500">Flex Max</p>
                  <p className="text-blue-600 font-semibold">
                    {parseInt(resultData.thresholds.flex_max, 10)}
                  </p>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg shadow-sm">
                  <p className="text-gray-500">GyroY Min</p>
                  <p className="text-green-600 font-semibold">
                    {parseInt(resultData.thresholds.gyroY_min, 10)}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg shadow-sm">
                  <p className="text-gray-500">GyroY Max</p>
                  <p className="text-green-600 font-semibold">
                    {parseInt(resultData.thresholds.gyroY_max, 10)}
                  </p>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg shadow-sm">
                  <p className="text-gray-500">GyroZ Min</p>
                  <p className="text-purple-600 font-semibold">
                    {parseInt(resultData.thresholds.gyroZ_min, 10)}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg shadow-sm">
                  <p className="text-gray-500">GyroZ Max</p>
                  <p className="text-purple-600 font-semibold">
                    {parseInt(resultData.thresholds.gyroZ_max, 10)}
                  </p>
                </div>
              </div>
            </div>

            {/* Processed / Skeletal Images Carousel */}
            <div className="w-full md:w-2/3 flex justify-center">
              <div className="w-full sm:w-[500px]"> 
                <Slider
                  dots
                  infinite
                  speed={500}
                  slidesToShow={1}
                  slidesToScroll={1}
                  centerMode
                  centerPadding="80px"
                  arrows
                  adaptiveHeight
                >
                  {(showSkeletal
                    ? resultData.skeletal_images
                    : resultData.processed_images
                  )?.map((img, i) => (
                    <div key={i} className="flex justify-center items-center">
                      <img
                        src={`data:image/jpeg;base64,${img}`}
                        alt={`Processed ${i}`}
                        className="carousel-image"
                      />
                    </div>
                  ))}
                </Slider>
              </div>
            </div>



          </div>
        )}

        {/* Action buttons */}
        {resultData && (
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => setShowSkeletal(!showSkeletal)}
              className={`px-4 py-2 rounded-lg text-white w-full sm:w-auto ${
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
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 w-full sm:w-auto"
            >
              Upload Again
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}