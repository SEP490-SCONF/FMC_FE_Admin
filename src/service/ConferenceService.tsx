import { apiService } from "./ApiService";


export interface ConferencePayload {
    Title: string;
    StartDate: string;
    EndDate: string;
    CreatedBy: number;
}

export const createConference = async (payload: ConferencePayload) => {
    const formData = new FormData();

    formData.append("Title", payload.Title);
    formData.append("StartDate", payload.StartDate);
    formData.append("EndDate", payload.EndDate);
    formData.append("CreatedBy", String(payload.CreatedBy));

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