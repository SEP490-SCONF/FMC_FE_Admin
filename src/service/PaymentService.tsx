import { apiService } from "./ApiService";

export interface Payment {
    payId: number;
    userId: number;
    conferenceId: number;
    regId: number | null;
    amount: number;
    currency: string;
    payStatus: string;
    payOsOrderCode: string;
    payOsCheckoutUrl: string;
    paidAt: string | null;
    createdAt: string;
    paperId: number;
    purpose: string;
}

export const PaymentService = {
    getAll: async (): Promise<Payment[]> => {
        return await apiService.get("/Payment");
    },
};