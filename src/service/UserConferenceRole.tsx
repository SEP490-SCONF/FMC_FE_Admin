import { apiService } from "./ApiService";

export interface UserConferenceRolePayload {
    email: string;
    conferenceId: number;
    specificTitle?: string;
}

export const assignUserConferenceRole = async (payload: UserConferenceRolePayload) => {
    return apiService.post("/UserConferenceRoles/create-or-assign", payload);
};