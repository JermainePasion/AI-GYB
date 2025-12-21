import { useContext } from "react";
import { UserContext } from "../context/UserContext";

const CSVButton = ({ log }) => {
  const { user } = useContext(UserContext);

  if (!log) return null;

  const handleDownload = () => {
    const blob = new Blob([log.data], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    const username = user?.username || "user";
    a.download = `${username}-logs-${new Date(log.createdAt).toISOString()}.csv`;

    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleDownload}
      className="px-4 py-2 bg-[#EBFFD8] text-black rounded-lg shadow hover:bg-[#C4E1E6] transition"
    >
      ⬇ Download Data
    </button>
  );
};

export default CSVButton;
