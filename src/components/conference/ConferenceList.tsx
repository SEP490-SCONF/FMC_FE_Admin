import React, { useState } from "react";
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

const ConferenceList: React.FC<ConferenceListProps> = ({ conferences }) => {
    const [showPopup, setShowPopup] = useState(false);
    const [selectedConfId, setSelectedConfId] = useState<number | null>(null);
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

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
        setLoading(true);
        try {
            await assignUserConferenceRole({
                email,
                conferenceId: selectedConfId!,
            });
            setMessage("Gán organizer thành công!");
        } catch (err) {
            setMessage("Có lỗi xảy ra!");
        }
        setLoading(false);
    };

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {conferences.map((conf) => (
                    <div
                        key={conf.conferenceId}
                        className="bg-white rounded-xl shadow p-4 flex flex-col relative"
                    >
                        <img
                            src={conf.bannerUrl || "/no-image.png"}
                            alt={conf.title || "No title"}
                            className="h-40 w-full object-cover rounded-lg mb-4"
                        />
                        <h2 className="text-lg font-bold mb-2">{conf.title || "No title"}</h2>
                        <p className="text-gray-600 mb-2">{conf.description || "No description"}</p>
                        <div className="text-sm text-gray-500 mb-1">
                            <span className="font-semibold">Location:</span> {conf.location || "N/A"}
                        </div>
                        <div className="text-sm text-gray-500 mb-1">
                            <span className="font-semibold">Time:</span>{" "}
                            {(conf.startDate ? new Date(conf.startDate).toLocaleString() : "N/A")} -{" "}
                            {(conf.endDate ? new Date(conf.endDate).toLocaleString() : "N/A")}
                        </div>
                        <div className="mt-auto flex justify-between items-end">
                            <span
                                className={`inline-block px-2 py-1 rounded text-xs font-semibold ${conf.status ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                    }`}
                            >
                                {conf.status === null ? "Unknown" : conf.status ? "Active" : "Inactive"}
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

            {/* Popup */}
            {showPopup && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded shadow-lg w-96">
                        <h3 className="text-lg font-bold mb-4">Thêm Organizer</h3>
                        <form onSubmit={handleSubmit}>
                            <input
                                type="email"
                                placeholder="Nhập email organizer"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full border rounded px-3 py-2 mb-3"
                                required
                            />
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400"
                                >
                                    Đóng
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
                                >
                                    {loading ? "Đang gửi..." : "Gán"}
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