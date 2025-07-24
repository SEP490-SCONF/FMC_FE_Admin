import React, { useState, useMemo, useEffect } from "react";
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableCell,
} from "../ui/table";

interface Payment {
    payId: number;
    userId: number;
    conferenceId: number;
    regId: number | null;
    amount: number;
    currency: string;
    payStatus: "Pending" | "Cancel" | "Success";
    payOsOrderCode: string;
    payOsCheckoutUrl: string;
    paidAt: string | null;
    createdAt: string;
    paperId: number;
    purpose: string;
}

interface PaymentListProps {
    payments: Payment[];
}

const statusColor = (status: string) => {
    switch (status) {
        case "Pending":
            return "bg-yellow-100 text-yellow-800";
        case "Cancel":
            return "bg-red-100 text-red-700";
        case "Success":
            return "bg-green-100 text-green-700";
        default:
            return "";
    }
};

const PAGE_SIZE = 7;

const PaymentList: React.FC<PaymentListProps> = ({ payments }) => {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Cancel' | 'Success'>('All');
    const [currentPage, setCurrentPage] = useState(1);

    // Tìm kiếm + filter status
    const filteredPayments = useMemo(
        () =>
            payments.filter(
                (p) =>
                    (statusFilter === 'All' || p.payStatus === statusFilter) &&
                    (
                        p.payId.toString().includes(search) ||
                        p.userId.toString().includes(search) ||
                        (p.purpose ?? "").toLowerCase().includes(search.toLowerCase()) ||
                        (p.payStatus ?? "").toLowerCase().includes(search.toLowerCase()) ||
                        (p.currency ?? "").toLowerCase().includes(search.toLowerCase())
                    )
            ),
        [payments, search, statusFilter]
    );

    // Phân trang
    const totalPages = Math.ceil(filteredPayments.length / PAGE_SIZE);
    const pagedPayments = filteredPayments.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    );

    // Reset về trang đầu khi search
    useEffect(() => {
        setCurrentPage(1);
    }, [search]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-xl font-semibold mb-4">Payment List</h2>
            <div className="flex justify-between items-center mb-4 gap-4">
                <input
                    type="text"
                    placeholder="Search payments..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="border px-3 py-2 rounded w-64"
                />
                <select
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value as 'All' | 'Pending' | 'Cancel' | 'Success')}
                    className="border px-3 py-2 rounded"
                >
                    <option value="All">All</option>
                    <option value="Pending">Pending</option>
                    <option value="Cancel">Cancel</option>
                    <option value="Success">Success</option>
                </select>
            </div>
            <div className="bg-white rounded shadow overflow-x-auto">
                <Table className="min-w-full">
                    <TableHeader className="border-b border-gray-100">
                        <TableRow>
                            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start">ID</TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start">User</TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start">Amount</TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start">Currency</TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-center">Status</TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start">Purpose</TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start">Created At</TableCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y divide-gray-100">
                        {pagedPayments.map((p) => (
                            <TableRow key={p.payId}>
                                <TableCell className="px-5 py-4 text-start">{p.payId}</TableCell>
                                <TableCell className="px-5 py-4 text-start">{p.userId}</TableCell>
                                <TableCell className="px-5 py-4 text-start">{p.amount}</TableCell>
                                <TableCell className="px-5 py-4 text-start">{p.currency}</TableCell>
                                <TableCell className="px-5 py-4 text-center">
                                    <span
                                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusColor(
                                            p.payStatus
                                        )}`}
                                    >
                                        {p.payStatus}
                                    </span>
                                </TableCell>
                                <TableCell className="px-5 py-4 text-start">{p.purpose}</TableCell>
                                <TableCell className="px-5 py-4 text-start">{p.createdAt}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center mt-6 gap-2">
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i}
                            onClick={() => handlePageChange(i + 1)}
                            className={`px-3 py-1 rounded border ${currentPage === i + 1
                                ? "bg-blue-600 text-white"
                                : "bg-white text-blue-600"
                                }`}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PaymentList;