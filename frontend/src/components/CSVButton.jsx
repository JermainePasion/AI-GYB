
const CSVButton = ({ log }) => {
  if (!log) return null;

  const handleDownload = () => {
    const blob = new Blob([log.data], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = log.filename || "posture-log.csv";
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleDownload}
      className="px-4 py-2 bg-[#C4E1E6] text-black rounded-lg shadow hover:bg-[#EBFFD8] transition"
    >
      ⬇ Download CSV
    </button>
  );
};

export default CSVButton;
