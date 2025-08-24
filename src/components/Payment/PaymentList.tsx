import React, { useState, useMemo, useEffect } from "react";
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableCell,
} from "../ui/table";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

interface Payment {
    payId: number;
    userId: number;
    userName: string;
    conferenceId: number;
    regId: number | null;
    amount: number;
    currency: string;
    payStatus: "Pending" | "Cancelled" | "Completed";
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
        case "Cancelled":
            return "bg-red-100 text-red-700";
        case "Completed":
            return "bg-green-100 text-green-700";
        default:
            return "";
    }
};

const PAGE_SIZE = 7;

const PaymentList: React.FC<PaymentListProps> = ({ payments }) => {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] =
        useState<'All' | 'Pending' | 'Cancelled' | 'Completed'>('All');

    // sort Date + Amount
    const [sortDate, setSortDate] = useState<'Default' | 'Newest' | 'Oldest'>('Default');
    const [sortAmount, setSortAmount] = useState<'Default' | 'Asc' | 'Desc'>('Default');

    // purpose filter
    const [purposeFilter, setPurposeFilter] =
        useState<'All' | 'Publish' | 'Fee' | 'Review' | 'Other'>('All');

    const [currentPage, setCurrentPage] = useState(1);

    // filter + sort
    const filteredPayments = useMemo(() => {
        let result = payments.filter(
            (p) =>
                (statusFilter === 'All' || p.payStatus === statusFilter) &&
                (
                    p.payId.toString().includes(search) ||
                    p.userId.toString().includes(search) ||
                    (p.purpose ?? "").toLowerCase().includes(search.toLowerCase()) ||
                    (p.payStatus ?? "").toLowerCase().includes(search.toLowerCase()) ||
                    (p.currency ?? "").toLowerCase().includes(search.toLowerCase())
                )
        );

        // Purpose filter
        if (purposeFilter !== 'All') {
            result = result.filter((p) => {
                const txt = (p.purpose ?? "").toLowerCase();
                if (purposeFilter === 'Publish') return txt.includes('publish');
                if (purposeFilter === 'Fee') return txt.includes('fee');
                if (purposeFilter === 'Review') return txt.includes('review');
                if (purposeFilter === 'Other') return !txt.includes('publish') && !txt.includes('fee') && !txt.includes('review');
                return true;
            });
        }

        // Sort theo Date
        if (sortDate !== 'Default') {
            result = [...result].sort((a, b) =>
                sortDate === 'Newest'
                    ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                    : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            );
        }

        // Sort theo Amount
        if (sortAmount !== 'Default') {
            result = [...result].sort((a, b) =>
                sortAmount === 'Asc'
                    ? a.amount - b.amount
                    : b.amount - a.amount
            );
        }

        return result;
    }, [payments, search, statusFilter, purposeFilter, sortDate, sortAmount]);

    // Phân trang
    const totalPages = Math.ceil(filteredPayments.length / PAGE_SIZE);
    const pagedPayments = filteredPayments.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    );

    // Reset trang khi filter/sort đổi
    useEffect(() => {
        setCurrentPage(1);
    }, [search, statusFilter, purposeFilter, sortDate, sortAmount]);

    const handlePageChange = (page: number) => setCurrentPage(page);

    // === Export Excel ===
    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(filteredPayments.map(p => ({
            ID: p.payId,
            User: p.userName,
            Amount: p.amount,
            Currency: p.currency,
            Status: p.payStatus,
            Purpose: p.purpose,
            "Created At": p.createdAt ? new Date(p.createdAt).toLocaleDateString("vi-VN") : ""
        })));

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Payments");

        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(data, "payments.xlsx");
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-xl font-semibold mb-4">Payment List</h2>
            <div className="flex flex-wrap gap-4 items-center mb-4">
                <input
                    type="text"
                    placeholder="Search payments..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="border px-3 py-2 rounded w-64"
                />
                <select
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value as 'All' | 'Pending' | 'Cancelled' | 'Completed')}
                    className="border px-3 py-2 rounded"
                >
                    <option value="All">All</option>
                    <option value="Pending">Pending</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="Completed">Completed</option>
                </select>

                {/* Purpose Filter */}
                <select
                    value={purposeFilter}
                    onChange={e => setPurposeFilter(e.target.value as 'All' | 'Publish' | 'Fee' | 'Review' | 'Other')}
                    className="border px-3 py-2 rounded"
                >
                    <option value="All">All Purpose</option>
                    <option value="Publish">Publish</option>
                    <option value="Fee">Fee</option>
                    <option value="Review">Review</option>
                    <option value="Other">Other</option>
                </select>

                {/* Sort theo Date */}
                <select
                    value={sortDate}
                    onChange={e => setSortDate(e.target.value as 'Default' | 'Newest' | 'Oldest')}
                    className="border px-3 py-2 rounded"
                >
                    <option value="Default">Sort by Date</option>
                    <option value="Newest">Newest First</option>
                    <option value="Oldest">Oldest First</option>
                </select>

                {/* Sort theo Amount */}
                <select
                    value={sortAmount}
                    onChange={e => setSortAmount(e.target.value as 'Default' | 'Asc' | 'Desc')}
                    className="border px-3 py-2 rounded"
                >
                    <option value="Default">Sort by Amount</option>
                    <option value="Asc">Amount Low → High</option>
                    <option value="Desc">Amount High → Low</option>
                </select>

                {/* Nút Export Excel */}
                <button
                    onClick={exportToExcel}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-green-700"
                >
                    Export Excel
                </button>
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
                                <TableCell className="px-5 py-4 text-start">{p.userName}</TableCell>
                                <TableCell className="px-5 py-4 text-start">{p.amount}</TableCell>
                                <TableCell className="px-5 py-4 text-start">{p.currency}</TableCell>
                                <TableCell className="px-5 py-4 text-center">
                                    <span
                                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusColor(p.payStatus)}`}
                                    >
                                        {p.payStatus}
                                    </span>
                                </TableCell>
                                <TableCell className="px-5 py-4 text-start">{p.purpose}</TableCell>
                                <TableCell className="px-5 py-4 text-start">
                                    {p.createdAt ? new Date(p.createdAt).toLocaleDateString("vi-VN") : ""}
                                </TableCell>
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
                            className={`px-3 py-1 rounded border ${currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-white text-blue-600"}`}
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
