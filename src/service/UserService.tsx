import { apiService } from "./ApiService";

export interface User {
    userId: number;
    email: string;
    name: string;
    avatarUrl: string;
    roleName: string;
    createdAt: string;
    status: boolean;
}

export interface UpdateUserPayload {
    Name?: string;
    AvatarUrl?: string;
    RoleId?: number;
    Status?: boolean;
}

const UserService = {
    // Lấy danh sách tất cả user
    getAll: async (): Promise<User[]> => {
        return await apiService.get("/CRUDUser");
    },

    // Lấy thông tin user theo id
    getById: async (id: number): Promise<User> => {
        return await apiService.get(`/CRUDUser/${id}`);
    },

    // Tìm user theo email
    findByEmail: async (email: string): Promise<User> => {
        return await apiService.post("/CRUDUser/email", { email });
    },

    // Cập nhật user theo id (dùng multipart/form-data nếu có file)
    update: async (id: number, data: UpdateUserPayload | FormData): Promise<User> => {
        return await apiService.put(`/CRUDUser/${id}`, data);
    },
};

export default UserService;