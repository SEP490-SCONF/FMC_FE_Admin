import { apiService } from "./ApiService";

export interface TopicPayload {
    topicName: string;
}

export const createTopic = async (payload: TopicPayload) => {
    return apiService.post("/Topics", payload);
};

export const getAllTopics = async () => {
    return apiService.get("/Topics");
};