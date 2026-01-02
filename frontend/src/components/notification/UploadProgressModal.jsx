export default function UploadProgressModal() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl p-6 w-[300px] shadow-xl flex flex-col items-center">
        <h2 className="text-lg font-semibold mb-4 text-center">
          Uploading session data
        </h2>
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-sm text-gray-600 text-center">
          Please wait...
        </p>
      </div>
    </div>
  );
}
