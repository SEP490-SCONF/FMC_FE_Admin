import React, { useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import PaymentList from "../../components/Payment/PaymentList";
import { PaymentService, Payment } from "../../service/PaymentService";

export default function MoneyTables() {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        PaymentService.getAll()
            .then((data) => setPayments(data))
            .finally(() => setLoading(false));
    }, []);

    return (
        <>
            <PageMeta
                title="Admin - Basic Tables"
                description="Dashboard page for TailAdmin"
            />
            <PageBreadcrumb pageTitle="" />
            <div className="space-y-6">
                <ComponentCard title="Payment">
                    {loading ? (
                        <div>Loading...</div>
                    ) : (
                        <PaymentList payments={payments.map(payment => ({
                            ...payment,
                            payStatus: payment.payStatus as "Pending" | "Cancel" | "Success"
                        }))} />
                    )}
                </ComponentCard>
            </div>
        </>
    );
}
