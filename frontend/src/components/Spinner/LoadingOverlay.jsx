const LoadingOverlay = ({ visible, text = "Uploading data..." }) => {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4 bg-white px-8 py-6 rounded-xl shadow-xl">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-red-500 rounded-full animate-spin" />
        <p className="text-gray-700 font-medium">{text}</p>
      </div>
    </div>
  );
};

export default LoadingOverlay;
