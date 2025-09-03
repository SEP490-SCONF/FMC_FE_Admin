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

    // 🆕 thay sortOrder + showUpcomingOnly bằng 1 filter duy nhất
    const [filterOption, setFilterOption] = useState<
        "default" | "newest" | "oldest" | "upcoming" | "ongoing"
    >("default");

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
                res === "The user has been assigned this role in the conference." ||
                res?.data === "The user has been assigned this role in the conference."
            ) {
                setMessage("This user has already been assigned this role in the conference.");
            } else {
                setMessage("Organizer assigned successfully!");
            }
        } catch (err) {
            setMessage("Something went wrong!");
        }
        setLoading(false);
    };

    // Search + filter + sort
    const filteredConferences = useMemo(() => {
        let list = conferences.filter(
            (conf) =>
                (conf.title || "").toLowerCase().includes(search.toLowerCase()) ||
                (conf.description || "").toLowerCase().includes(search.toLowerCase()) ||
                (conf.location || "").toLowerCase().includes(search.toLowerCase())
        );

        const now = new Date();

        switch (filterOption) {
            case "upcoming":
                list = list.filter((conf) => conf.startDate && new Date(conf.startDate) > now);
                break;
            case "ongoing":
                list = list.filter(
                    (conf) =>
                        conf.startDate &&
                        conf.endDate &&
                        new Date(conf.startDate) <= now &&
                        new Date(conf.endDate) >= now
                );
                break;
            case "newest":
                list = [...list].sort((a, b) => {
                    if (!a.startDate) return 1;   // a không có ngày → xuống cuối
                    if (!b.startDate) return -1;  // b không có ngày → xuống cuối
                    return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
                });
                break;

            case "oldest":
                list = [...list].sort((a, b) => {
                    if (!a.startDate) return 1;   // không có ngày → xuống cuối
                    if (!b.startDate) return -1;
                    return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
                });
                break;
            default:
                break;
        }

        return list;
    }, [conferences, search, filterOption]);

    // Pagination
    const totalPages = Math.ceil(filteredConferences.length / PAGE_SIZE);
    const pagedConferences = filteredConferences.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    );

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    // Reset page khi filter/search thay đổi
    React.useEffect(() => {
        setCurrentPage(1);
    }, [search, filterOption]);

    return (
        <>
            {/* Search + Filters */}
            <div className="mb-4 flex flex-wrap gap-3 items-center justify-between">
                <input
                    type="text"
                    placeholder="Search conferences..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border px-3 py-2 rounded w-full max-w-xs"
                />

                <select
                    value={filterOption}
                    onChange={(e) =>
                        setFilterOption(
                            e.target.value as
                            | "default"
                            | "newest"
                            | "oldest"
                            | "upcoming"
                            | "ongoing"
                        )
                    }
                    className="border px-3 py-2 rounded"
                >
                    <option value="default">Default</option>
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="ongoing">Ongoing</option>
                </select>
            </div>

            {/* Conference Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {pagedConferences.map((conf) => (
                    <div
                        key={conf.conferenceId}
                        className="bg-white rounded-xl shadow p-4 flex flex-col relative"
                    >
                        <img
                            src={
                                conf.bannerUrl && conf.bannerUrl.trim()
                                    ? conf.bannerUrl
                                    : "/FPT_logo_2010.svg.png"
                            }
                            alt={conf.title || "No title"}
                            className="h-40 w-full object-cover rounded-lg mb-4"
                        />
                        <h2 className="text-lg font-bold mb-2">{conf.title || "No title"}</h2>
                        <p className="text-gray-600 mb-2 overflow-y-auto" style={{ maxHeight: "100px" }}>{conf.description || "No description"}</p>
                        <div className="text-sm text-gray-500 mb-1">
                            <span className="font-semibold">Location:</span> {conf.location || "N/A"}
                        </div>
                        <div className="text-sm text-gray-500 mb-1">
                            <span className="font-semibold">Time:</span>{" "}
                            {conf.startDate ? new Date(conf.startDate).toLocaleDateString("vi-VN") : "N/A"} -{" "}
                            {conf.endDate ? new Date(conf.endDate).toLocaleDateString("vi-VN") : "N/A"}
                        </div>
                        <div className="mt-auto flex justify-between items-end">
                            <span
                                className={`inline-block px-2 py-1 rounded text-xs font-semibold ${conf.status ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
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

            {/* Popup giữ nguyên */}
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
                            <div className="mt-2 text-sm text-center text-green-600">{message}</div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default ConferenceList;
