const LatencyCSVButton = ({ latencyData }) => {
  if (!latencyData || latencyData.length === 0) return null;

  const downloadLatencyCSV = () => {
    let csv = "timestamp,latency_ms\n";

    latencyData.forEach(entry => {
      csv += `${entry.timestamp},${entry.latency}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "ble-latency.csv";
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={downloadLatencyCSV}
      className="px-4 py-2 bg-[#FFD8D8] text-black rounded-lg shadow hover:bg-[#E6C4C4] transition"
    >
      ⬇ Download Latency CSV
    </button>
  );
};

export default LatencyCSVButton;