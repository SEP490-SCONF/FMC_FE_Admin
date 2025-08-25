import React, { useEffect, useState } from "react";
import { getAllTopics, createTopic, updateTopic } from "../../service/Topic";

interface Topic {
  topicId: number;
  topicName: string;
  status: boolean; // thêm status
}

const PAGE_SIZE = 5;

const TopicList: React.FC = () => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Popup state
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [newTopicName, setNewTopicName] = useState("");
  const [popup, setPopup] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  }>({
    show: false,
    message: "",
    type: "success",
  });
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [editTopic, setEditTopic] = useState<Topic | null>(null);
  const [editTopicName, setEditTopicName] = useState("");
  const [editTopicStatus, setEditTopicStatus] = useState<boolean>(true);

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    setLoading(true);
    try {
      const data = await getAllTopics();
      setTopics(data);
    } catch (error) {
      setPopup({
        show: true,
        message: "Error while loading topic list!",
        type: "error",
      });
    }
    setLoading(false);
  };
  const handleEditClick = (topic: Topic) => {
    setEditTopic(topic);
    setEditTopicName(topic.topicName);
    setEditTopicStatus(topic.status); // Thêm dòng này
    setShowEditPopup(true);
  };
  const handleUpdateTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTopicName.trim() || !editTopic) {
      setPopup({ show: true, message: "Please enter a topic name!", type: "error" });
      return;
    }
    try {
      await updateTopic(editTopic.topicId, {
        topicName: editTopicName.trim(),
        status: editTopicStatus, // Truyền status
      });
      setPopup({ show: true, message: "Topic updated successfully!", type: "success" });
      setShowEditPopup(false);
      setEditTopic(null);
      fetchTopics();
    } catch {
      setPopup({ show: true, message: "Failed to update topic!", type: "error" });
    }
  };
  // Filter by search term + status
  const filteredTopics = topics.filter((topic) => {
    const matchSearch = topic.topicName
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && topic.status) ||
      (statusFilter === "inactive" && !topic.status);
    return matchSearch && matchStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredTopics.length / PAGE_SIZE);
  const pagedTopics = filteredTopics.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Auto-close popup
  useEffect(() => {
    if (popup.show) {
      const timer = setTimeout(
        () => setPopup((p) => ({ ...p, show: false })),
        2000
      );
      return () => clearTimeout(timer);
    }
  }, [popup.show]);

  // Add topic
  const handleAddTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopicName.trim()) {
      setPopup({
        show: true,
        message: "Please enter a topic name!",
        type: "error",
      });
      return;
    }
    try {
      await createTopic({ topicName: newTopicName.trim() });
      setPopup({
        show: true,
        message: "Topic added successfully!",
        type: "success",
      });
      setShowAddPopup(false);
      setNewTopicName("");
      fetchTopics();
    } catch {
      setPopup({
        show: true,
        message: "Failed to create new topic!",
        type: "error",
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded shadow p-6 mt-8 relative">
      {/* Popup notification */}
      {popup.show && (
        <div
          className={`fixed top-24 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded shadow-lg text-white transition-all
                        ${
                          popup.type === "success"
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
        >
          {popup.message}
        </div>
      )}

      {/* Add Topic Popup */}
      {showAddPopup && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Add New Topic</h3>
            <form onSubmit={handleAddTopic}>
              <input
                type="text"
                value={newTopicName}
                onChange={(e) => setNewTopicName(e.target.value)}
                placeholder="Enter topic name"
                className="border px-3 py-2 rounded w-full mb-4"
                autoFocus
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddPopup(false);
                    setNewTopicName("");
                  }}
                  className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Topic Popup */}
      {showEditPopup && editTopic && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Edit Topic</h3>
            <form onSubmit={handleUpdateTopic}>
              <input
                type="text"
                value={editTopicName}
                onChange={(e) => setEditTopicName(e.target.value)}
                placeholder="Enter topic name"
                className="border px-3 py-2 rounded w-full mb-4"
                autoFocus
              />
              <div className="mb-4">
                <label className="mr-2 font-medium">Status:</label>
                <select
                  value={editTopicStatus ? "active" : "inactive"}
                  onChange={e => setEditTopicStatus(e.target.value === "active")}
                  className="border px-3 py-2 rounded"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => { setShowEditPopup(false); setEditTopic(null); }}
                  className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Topic List</h2>
        <button
          onClick={() => setShowAddPopup(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          + Add Topic
        </button>
      </div>

      {/* Search + Filter */}
      <div className="flex gap-3 mb-4 items-center">
        {/* Search */}
        <label htmlFor="search" className="sr-only">
          Search conferences
        </label>
        <input
          id="search"
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1); // reset page khi search
          }}
          className="border px-3 py-2 rounded w-64"
        />

        {/* Status Filter */}
        <label htmlFor="statusFilter" className="sr-only">
          Filter by status
        </label>
        <select
          id="statusFilter"
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value as "all" | "active" | "inactive");
            setCurrentPage(1); // reset page khi đổi filter
          }}
          className="border px-3 py-2 rounded"
        >
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-2 border">No.</th>
                <th className="py-2 px-2 border">Topic</th>
                <th className="py-2 px-2 border">Status</th>
                <th className="py-2 px-2 border">Action</th> {/* Thêm cột Action */}
              </tr>
            </thead>
            <tbody>
              {pagedTopics.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-2 text-gray-500 text-center">
                    No topics found.
                  </td>
                </tr>
              ) : (
                pagedTopics.map((topic, idx) => (
                  <tr key={topic.topicId}>
                    <td className="py-2 px-2 border text-center">
                      {(currentPage - 1) * PAGE_SIZE + idx + 1}
                    </td>
                    <td className="py-2 px-2 border">{topic.topicName}</td>
                    <td className="py-2 px-2 border text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold
              ${topic.status ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}
                      >
                        {topic.status ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="py-2 px-2 border text-center">
                      <button
                        className="px-3 py-1 rounded bg-yellow-400 text-white hover:bg-yellow-500"
                        onClick={() => handleEditClick(topic)}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-4 gap-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i + 1)}
                  className={`px-3 py-1 rounded border ${
                    currentPage === i + 1
                      ? "bg-blue-600 text-white"
                      : "bg-white text-blue-600"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TopicList;
