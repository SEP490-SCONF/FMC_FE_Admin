import React, { useState, useEffect } from "react";
import { createConference, ConferencePayload } from "../../../service/ConferenceService";
import Input from "../input/InputField";
import Label from "../Label";
import MultiSelect from "../MultiSelect"; // Thêm dòng này

// Đổi topicOptions sang dạng MultiSelect dùng:
const topicOptions = [
    { value: "AI", text: "AI" },
    { value: "Cloud", text: "Cloud" },
    { value: "IoT", text: "IoT" },
    { value: "Security", text: "Security" },
    { value: "Web", text: "Web" },
];

interface ConferencePayloadExtended extends ConferencePayload {
    Topics?: string[];
}

const initialState: ConferencePayloadExtended = {
    Title: "",
    StartDate: "",
    EndDate: "",
    CreatedBy: 0,
    Topics: [],
};

const CreateConfInput: React.FC = () => {
    const [form, setForm] = useState<ConferencePayloadExtended>(initialState);
    const [loading, setLoading] = useState(false);

    // Lấy thông tin người dùng đăng nhập (ví dụ từ localStorage)
    useEffect(() => {
        const userStr = localStorage.getItem("user");
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                setForm((prev) => ({
                    ...prev,
                    CreatedBy: user?.id || user?.userId || 0,
                }));
            } catch { }
        }
    }, []);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Xử lý chọn nhiều topic
    const handleTopicsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selected = Array.from(e.target.selectedOptions, option => option.value);
        setForm((prev) => ({
            ...prev,
            Topics: selected,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Gửi lên server chỉ các trường bắt buộc và Topics nếu cần
            await createConference({
                Title: form.Title,
                StartDate: form.StartDate,
                EndDate: form.EndDate,
                CreatedBy: form.CreatedBy,
                // Nếu API backend hỗ trợ Topics thì thêm dòng này:
                // Topics: form.Topics,
            });
            alert("Tạo hội nghị thành công!");
            setForm({ ...initialState, CreatedBy: form.CreatedBy });
        } catch (err) {
            alert("Có lỗi xảy ra!");
        }
        setLoading(false);
    };

    const handleCancel = () => {
        setForm((prev) => ({
            ...initialState,
            CreatedBy: prev.CreatedBy,
        }));
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
                    <Input
                        type="datetime-local"
                        name="StartDate"
                        value={form.StartDate}
                        onChange={handleChange}
                    />
                </div>

                {/* End Date */}
                <div>
                    <Label htmlFor="EndDate">End Date</Label>
                    <Input
                        type="datetime-local"
                        name="EndDate"
                        value={form.EndDate}
                        onChange={handleChange}
                    />
                </div>

                {/* Created By (ẩn input, chỉ hiển thị thông tin) */}
                <div>
                    <Label htmlFor="CreatedBy">Created By</Label>
                    <Input
                        type="text"
                        name="CreatedBy"
                        value={form.CreatedBy || ""}
                        disabled
                    />
                </div>

                {/* Topics - Multiple Select */}
                <div>
                    <Label htmlFor="Topics">Topics</Label>
                    <MultiSelect
                        label=""
                        options={topicOptions}
                        defaultSelected={form.Topics}
                        onChange={(values) =>
                            setForm((prev) => ({
                                ...prev,
                                Topics: values,
                            }))
                        }
                    />
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
