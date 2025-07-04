import React, { useState } from "react";
import { createConference, ConferencePayload } from "../../../service/ConferenceService";
import Input from "../input/InputField";
import Label from "../Label";

interface ConferencePayloadExtended extends ConferencePayload { }

const initialState: ConferencePayloadExtended = {
    Title: "",
    StartDate: "",
    EndDate: "",
    CreatedBy: 7, // Gán cứng là 7
    Status: true,
};

const CreateConfInput: React.FC = () => {
    const [form, setForm] = useState<ConferencePayloadExtended>(initialState);
    const [loading, setLoading] = useState(false);

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
                Title: form.Title,
                StartDate: form.StartDate,
                EndDate: form.EndDate,
                CreatedBy: 7, // Gán cứng khi submit
                Status: form.Status,
            });
            alert("Tạo hội nghị thành công!");
            setForm({ ...initialState });
        } catch (err) {
            alert("Có lỗi xảy ra!");
        }
        setLoading(false);
    };

    const handleCancel = () => {
        setForm({ ...initialState });
    };

    return (
        <div className="bg-white rounded-xl shadow p-8 max-w-2xl mx-auto">
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

                {/* Created By (ẩn input, chỉ hiển thị thông tin) */}
                <div>
                    <Label htmlFor="CreatedBy">Created By</Label>
                    <Input
                        type="text"
                        name="CreatedBy"
                        value={"7"}
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
                        {loading ? "Đang gửi..." : "Tạo hội nghị"}
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
