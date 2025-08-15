import React, { useEffect, useState } from "react";
import { getAllTopics, createTopic } from "../../service/Topic";

interface Topic {
    topicId: number;
    topicName: string;
}

const PAGE_SIZE = 5;

const TopicList: React.FC = () => {
    const [topics, setTopics] = useState<Topic[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    // Popup state
    const [showAddPopup, setShowAddPopup] = useState(false);
    const [newTopicName, setNewTopicName] = useState("");
    const [popup, setPopup] = useState<{ show: boolean; message: string; type: "success" | "error" }>({
        show: false,
        message: "",
        type: "success",
    });

    useEffect(() => {
        fetchTopics();
    }, []);

    const fetchTopics = async () => {
        setLoading(true);
        try {
            const data = await getAllTopics();
            setTopics(data);
        } catch (error) {
            setPopup({ show: true, message: "Error while loading topic list!", type: "error" });
        }
        setLoading(false);
    };

    // Filter by search term
    const filteredTopics = topics.filter((topic) =>
        topic.topicName.toLowerCase().includes(search.toLowerCase())
    );

    // Pagination
    const totalPages = Math.ceil(filteredTopics.length / PAGE_SIZE);
    const pagedTopics = filteredTopics.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    );

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setCurrentPage(1); // Reset to first page when searching
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    // Auto-close popup
    useEffect(() => {
        if (popup.show) {
            const timer = setTimeout(() => setPopup((p) => ({ ...p, show: false })), 2000);
            return () => clearTimeout(timer);
        }
    }, [popup.show]);

    // Add topic
    const handleAddTopic = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTopicName.trim()) {
            setPopup({ show: true, message: "Please enter a topic name!", type: "error" });
            return;
        }
        try {
            await createTopic({ topicName: newTopicName.trim() });
            setPopup({ show: true, message: "Topic added successfully!", type: "success" });
            setShowAddPopup(false);
            setNewTopicName("");
            fetchTopics();
        } catch {
            setPopup({ show: true, message: "Failed to create new topic!", type: "error" });
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white rounded shadow p-6 mt-8 relative">
            {/* Popup notification */}
            {popup.show && (
                <div
                    className={`fixed top-24 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded shadow-lg text-white transition-all
                        ${popup.type === "success" ? "bg-green-500" : "bg-red-500"}`}
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
                                    onClick={() => { setShowAddPopup(false); setNewTopicName(""); }}
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
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search topics..."
                    value={search}
                    onChange={handleSearchChange}
                    className="border px-3 py-2 rounded w-full"
                />
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
                            </tr>
                        </thead>
                        <tbody>
                            {pagedTopics.length === 0 ? (
                                <tr>
                                    <td colSpan={2} className="py-2 text-gray-500 text-center">
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
                                    className={`px-3 py-1 rounded border ${currentPage === i + 1
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
