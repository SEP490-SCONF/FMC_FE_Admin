import { apiService } from "./ApiService";

export interface TopicPayload {
    topicName: string;
}
export interface UpdateTopicPayload {
    topicName?: string;
    status?: boolean;
}

export const createTopic = async (payload: TopicPayload) => {
    return apiService.post("/Topics", payload);
};

export const getAllTopics = async () => {
    return apiService.get("/Topics");
};


export const updateTopic = async (id: number, payload: UpdateTopicPayload) => {
    return apiService.put(`/Topics/${id}`, payload);
};