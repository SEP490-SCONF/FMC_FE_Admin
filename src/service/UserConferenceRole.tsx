import { apiService } from "./ApiService";

export interface UserConferenceRolePayload {
    email: string;
    conferenceId: number;
}

export const assignUserConferenceRole = async (payload: UserConferenceRolePayload) => {
    return apiService.post("/UserConferenceRoles", payload);
};