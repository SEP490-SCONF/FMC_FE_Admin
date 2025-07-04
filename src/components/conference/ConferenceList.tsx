import React from "react";

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
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {conferences.map((conf) => (
                <div
                    key={conf.conferenceId}
                    className="bg-white rounded-xl shadow p-4 flex flex-col"
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
                    <div className="mt-auto">
                        <span
                            className={`inline-block px-2 py-1 rounded text-xs font-semibold ${conf.status ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                }`}
                        >
                            {conf.status === null ? "Unknown" : conf.status ? "Active" : "Inactive"}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ConferenceList;