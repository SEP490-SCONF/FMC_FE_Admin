import React, { useState, useMemo } from "react";
import { assignUserConferenceRole } from "../../service/UserConferenceRole";

export interface Conference {
  conferenceId: number;
  title: string | null;
  description: string | null;
  startDate: string | null;
  endDate: string | null;
  location: string | null;
  bannerUrl: string | null;
  status: boolean | null;
}

interface ConferenceListProps {
  conferences: Conference[];
}

const PAGE_SIZE = 6;

const ConferenceList: React.FC<ConferenceListProps> = ({ conferences }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedConfId, setSelectedConfId] = useState<number | null>(null);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [specificTitle, setSpecificTitle] = useState("");
  const handleAddOrganizer = (conferenceId: number) => {
    setSelectedConfId(conferenceId);
    setShowPopup(true);
    setEmail("");
    setMessage("");
  };

  const handleClose = () => {
    setShowPopup(false);
    setSelectedConfId(null);
    setEmail("");
    setMessage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setMessage("Email is required");
      return;
    }
     if (!specificTitle) {
        setMessage("Please select a role.");
        return;
    }
    setLoading(true);
    try {
      const res = await assignUserConferenceRole({
        email,
        conferenceId: selectedConfId!,
        specificTitle,
      });
      if (
        res === "Người dùng đã được gán vai trò này trong hội thảo." ||
        res?.data === "Người dùng đã được gán vai trò này trong hội thảo."
      ) {
        setMessage(
          "This user has already been assigned this role in the conference."
        );
      } else {
        setMessage("Assign organizer successfully!");
      }
    } catch (err) {
      setMessage("Something wrong!");
    }
    setLoading(false);
  };

  // Tìm kiếm
  const filteredConferences = useMemo(
    () =>
      conferences.filter(
        (conf) =>
          (conf.title || "").toLowerCase().includes(search.toLowerCase()) ||
          (conf.description || "")
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          (conf.location || "").toLowerCase().includes(search.toLowerCase())
      ),
    [conferences, search]
  );

  // Phân trang
  const totalPages = Math.ceil(filteredConferences.length / PAGE_SIZE);
  const pagedConferences = filteredConferences.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Reset về trang đầu khi search
  React.useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  return (
    <>
      <div className="mb-4 flex justify-between items-center">
        <input
          type="text"
          placeholder="Tìm kiếm hội nghị..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded w-full max-w-xs"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {pagedConferences.map((conf) => (
          <div
            key={conf.conferenceId}
            className="bg-white rounded-xl shadow p-4 flex flex-col relative"
          >
            <img
              src={conf.bannerUrl || "/no-image.png"}
              alt={conf.title || "No title"}
              className="h-40 w-full object-cover rounded-lg mb-4"
            />
            <h2 className="text-lg font-bold mb-2">
              {conf.title || "No title"}
            </h2>
            <p className="text-gray-600 mb-2">
              {conf.description || "No description"}
            </p>
            <div className="text-sm text-gray-500 mb-1">
              <span className="font-semibold">Location:</span>{" "}
              {conf.location || "N/A"}
            </div>
            <div className="text-sm text-gray-500 mb-1">
              <span className="font-semibold">Time:</span>{" "}
              {conf.startDate
                ? new Date(conf.startDate).toLocaleString()
                : "N/A"}{" "}
              - {conf.endDate ? new Date(conf.endDate).toLocaleString() : "N/A"}
            </div>
            <div className="mt-auto flex justify-between items-end">
              <span
                className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                  conf.status
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {conf.status === null
                  ? "Unknown"
                  : conf.status
                  ? "Active"
                  : "Inactive"}
              </span>
              <button
                className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600"
                style={{ position: "absolute", right: 16, bottom: 16 }}
                onClick={() => handleAddOrganizer(conf.conferenceId)}
              >
                Add Organizer
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* Pagination */}
      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-sm text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400 disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h3 className="text-lg font-bold mb-4">Add Organizer</h3>
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="Enter organizer email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border rounded px-3 py-2 mb-3"
                required
              />
              <select
                value={specificTitle}
                onChange={(e) => setSpecificTitle(e.target.value)}
                className="w-full border rounded px-3 py-2 mb-3"
                required
              >
                <option value="">Select role</option>
                <option value="Conference Chair">Conference Chair</option>
                <option value="Co-Chair">Co-Chair</option>
              </select>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
                >
                  {loading ? "Sending..." : "Assign"}
                </button>
              </div>
            </form>
            {message && (
              <div className="mt-2 text-sm text-center text-green-600">
                {message}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ConferenceList;
