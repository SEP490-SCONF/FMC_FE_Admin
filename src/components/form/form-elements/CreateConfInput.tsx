import React, { useState, useEffect } from "react";
import { createConference, ConferencePayload } from "../../../service/ConferenceService";
import Input from "../input/InputField";
import Label from "../Label";
import { useUser } from "../../../context/UserContext";

interface ConferencePayloadExtended extends ConferencePayload { }

const initialState: Omit<ConferencePayloadExtended, "CreatedBy"> = {
    Title: "",
    StartDate: "",
    EndDate: "",
    Status: true,
};

const CreateConfInput: React.FC = () => {
    const { user } = useUser();
    const [form, setForm] = useState<ConferencePayloadExtended>({
        ...initialState,
        CreatedBy: 0,
    });
    const [loading, setLoading] = useState(false);
    const [popup, setPopup] = useState<{ show: boolean; message: string; type: "success" | "error" }>({
        show: false,
        message: "",
        type: "success",
    });

    // Update CreatedBy when the user changes
    useEffect(() => {
        if (user?.userId) {
            setForm((prev) => ({
                ...prev,
                CreatedBy: user.userId,
            }));
        }
    }, [user]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: name === "Status" ? value === "true" : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await createConference({
                ...form,
                CreatedBy: user?.userId ?? 0,
            });

            setPopup({ show: true, message: "Conference created successfully!", type: "success" });
            setForm({ ...initialState, CreatedBy: user?.userId ?? 0 });
        } catch (err) {
            setPopup({ show: true, message: "Unable to create conference!", type: "error" });
        }
        setLoading(false);
    };

    const handleCancel = () => {
        setForm({ ...initialState, CreatedBy: user?.userId ?? 0 });
    };

    // Auto-hide popup after 2 seconds
    useEffect(() => {
        if (popup.show) {
            const timer = setTimeout(() => {
                setPopup((prev) => ({ ...prev, show: false }));
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [popup.show]);

    return (
        <div className="bg-white rounded-xl shadow p-8 max-w-2xl mx-auto relative">
            {popup.show && (
                <div
                    className={`fixed top-24 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded shadow-lg text-white transition-all
            ${popup.type === "success" ? "bg-green-500" : "bg-red-500"}`}
                >
                    {popup.message}
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Title */}
                <div>
                    <Label htmlFor="Title">Title</Label>
                    <Input name="Title" value={form.Title} onChange={handleChange} />
                </div>

                {/* Start Date */}
                <div>
                    <Label htmlFor="StartDate">Start Date</Label>
                    <input
                        type="datetime-local"
                        name="StartDate"
                        value={form.StartDate}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                        required
                    />
                </div>

                {/* End Date */}
                <div>
                    <Label htmlFor="EndDate">End Date</Label>
                    <input
                        type="datetime-local"
                        name="EndDate"
                        value={form.EndDate}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                        required
                    />
                </div>

                {/* Created By (hidden input, only displays information) */}
                <div>
                    <Label htmlFor="CreatedBy">Created By</Label>
                    <Input
                        type="text"
                        name="CreatedBy"
                        value={user?.userId ?? ""}
                        disabled
                    />
                </div>

                {/* Status */}
                <div>
                    <Label htmlFor="Status">Status</Label>
                    <select
                        name="Status"
                        value={form.Status ? "true" : "false"}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                    >
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                    </select>
                </div>

                <div className="flex gap-4 mt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-2"
                    >
                        {loading ? "Submitting..." : "Create Conference"}
                    </button>
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="bg-red-500 hover:bg-red-600 text-white rounded px-4 py-2"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateConfInput;
