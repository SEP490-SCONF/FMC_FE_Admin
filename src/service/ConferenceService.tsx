import { apiService } from "./ApiService";


export interface ConferencePayload {
    Title: string;
    Description?: string;
    StartDate: string;
    EndDate: string;
    Location?: string;
    CreatedBy: number;
    CallForPaper?: string;
    Status?: boolean;
    BannerImage?: File | null;
}

// function formatDateForDB(dateStr: string) {
//     if (!dateStr) return "";
//     // dateStr dạng: "2025-08-10T00:00"
//     const date = new Date(dateStr);
//     // yyyy-MM-dd HH:mm:ss.SSS
//     const pad = (n: number) => n.toString().padStart(2, "0");
//     const yyyy = date.getFullYear();
//     const MM = pad(date.getMonth() + 1);
//     const dd = pad(date.getDate());
//     const HH = pad(date.getHours());
//     const mm = pad(date.getMinutes());
//     const ss = pad(date.getSeconds());
//     const SSS = date.getMilliseconds().toString().padStart(3, "0");
//     return `${yyyy}-${MM}-${dd} ${HH}:${mm}:${ss}.${SSS}`;
// }

export const createConference = async (payload: ConferencePayload) => {
    const formData = new FormData();

    formData.append("Title", payload.Title);
    formData.append("StartDate", payload.StartDate); // Để nguyên dạng yyyy-MM-ddTHH:mm
    formData.append("EndDate", payload.EndDate);
    formData.append("CreatedBy", String(payload.CreatedBy));
    if (payload.Description) formData.append("Description", payload.Description);
    if (payload.Location) formData.append("Location", payload.Location);
    if (payload.CallForPaper) formData.append("CallForPaper", payload.CallForPaper);
    if (typeof payload.Status !== "undefined") formData.append("Status", String(payload.Status));
    if (payload.BannerImage) formData.append("BannerImage", payload.BannerImage);

    // Debug: log dữ liệu gửi lên
    for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
    }

    return apiService.post("/Conferences", formData);
};

// Lấy danh sách tất cả hội nghị
export const getAllConferences = async () => {
    return apiService.get("/Conferences");
};

// Lấy chi tiết hội nghị theo id
export const getConferenceById = async (id: number) => {
    return apiService.get(`/Conferences/${id}`);
};