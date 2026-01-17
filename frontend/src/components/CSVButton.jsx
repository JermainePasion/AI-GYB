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
    const date = new Date(log.createdAt);

    const formattedDate =
      `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}` +
      `_${String(date.getHours()).padStart(2, "0")}-${String(date.getMinutes()).padStart(2, "0")}-${String(date.getSeconds()).padStart(2, "0")}`;

    a.download = `${username}-${formattedDate}.csv`;

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
