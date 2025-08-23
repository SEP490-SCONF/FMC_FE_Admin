import React, { useState, useEffect, useMemo } from 'react';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '../ui/table/index';
import UserService, { User } from '../../service/UserService';

const PAGE_SIZE = 7;

const UserListing: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
    const [newUserEmail, setNewUserEmail] = useState<string>('');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [editName, setEditName] = useState('');
    const [editRoleId, setEditRoleId] = useState<number>(2);
    const [editStatus, setEditStatus] = useState<boolean>(true);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    // ✅ THÊM MỚI: filter status & role
    const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Inactive'>('All');
    const [roleFilter, setRoleFilter] = useState<'All' | 'Admin' | 'Member'>('All');

    // Fetch users từ UserService
    const fetchUsers = async () => {
        try {
            const data = await UserService.getAll();
            setUsers(Array.isArray(data) ? data : []);
        } catch (error) {
            setUsers([]);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleAddUser = async () => {
        if (newUserEmail) {
            try {
                const addedUser = await UserService.findByEmail(newUserEmail);
                setUsers([...users, addedUser]);
                setIsPopupOpen(false);
                setNewUserEmail('');
            } catch (error) {
                // handle error
            }
        }
    };

    const openEditPopup = (user: User) => {
        setSelectedUser(user);
        setEditName(user.name);
        setEditRoleId(user.roleName === "Admin" ? 1 : 2);
        setEditStatus(user.status);
    };

    const handleUpdateUser = async () => {
        if (!selectedUser) return;
        try {
            const formData = new FormData();
            formData.append("Name", editName);
            formData.append("RoleId", editRoleId.toString());
            formData.append("Status", editStatus ? "true" : "false");
            await UserService.update(selectedUser.userId, formData);
            fetchUsers();
            setSelectedUser(null);
        } catch (error) {
            // handle error
        }
    };

    // Tìm kiếm + filter (THÊM status & role)
    const filteredUsers = useMemo(() => {
        return users.filter((user) => {
            const matchesSearch =
                (user.name ?? "").toLowerCase().includes(search.toLowerCase()) ||
                (user.email ?? "").toLowerCase().includes(search.toLowerCase()) ||
                (user.roleName ?? "").toLowerCase().includes(search.toLowerCase());

            const matchesStatus =
                statusFilter === 'All' ||
                (statusFilter === 'Active' && user.status) ||
                (statusFilter === 'Inactive' && !user.status);

            const matchesRole =
                roleFilter === 'All' ||
                (user.roleName ?? '').toLowerCase() === roleFilter.toLowerCase();

            return matchesSearch && matchesStatus && matchesRole;
        });
    }, [users, search, statusFilter, roleFilter]);

    // Phân trang
    const totalPages = Math.ceil(filteredUsers.length / PAGE_SIZE);
    const pagedUsers = filteredUsers.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    );

    // Reset về trang đầu khi search/filter đổi
    useEffect(() => {
        setCurrentPage(1);
    }, [search, statusFilter, roleFilter]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-xl font-semibold mb-4">User List</h2>

            {/* KHỐI CONTROL: giữ nút Add User, thêm 2 filter vào cùng cụm với search */}
            <div className="flex justify-between items-center mb-4">
                <button
                    onClick={() => setIsPopupOpen(true)}
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                    Add User
                </button>

                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        placeholder="Tìm kiếm người dùng..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="border px-3 py-2 rounded w-64"
                    />

                    {/* ✅ Filter Status */}
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as 'All' | 'Active' | 'Inactive')}
                        className="border px-3 py-2 rounded"
                    >
                        <option value="All">All Status</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>

                    {/* ✅ Filter Role */}
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value as 'All' | 'Admin' | 'Member')}
                        className="border px-3 py-2 rounded"
                    >
                        <option value="All">All Roles</option>
                        <option value="Admin">Admin</option>
                        <option value="Member">Member</option>
                    </select>
                </div>
            </div>

            {/* BẢNG: giữ NGUYÊN cấu trúc */}
            <div className="mt-6">
                <Table className="min-w-full">
                    <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                        <TableRow>
                            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                User Name
                            </TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                Email
                            </TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                Role Name
                            </TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                Created At
                            </TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                Status
                            </TableCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                        {pagedUsers.map((user) => (
                            <TableRow key={user.userId} onClick={() => openEditPopup(user)} className="cursor-pointer">
                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 overflow-hidden rounded-full">
                                            <img
                                                width={40}
                                                height={40}
                                                src={user.avatarUrl}
                                                alt={user.name}
                                            />
                                        </div>
                                        <div>
                                            <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                                {user.name}
                                            </span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    {user.email}
                                </TableCell>
                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    {user.roleName}
                                </TableCell>
                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    {user.createdAt}
                                </TableCell>
                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    <span
                                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${user.status ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                            }`}
                                    >
                                        {user.status ? "Active" : "Inactive"}
                                    </span>
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

            {/* Popup Add User */}
            {isPopupOpen && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded shadow-lg w-96">
                        <h3 className="text-xl font-semibold mb-4">Add New User</h3>
                        <div className="mb-4">
                            <label className="block text-sm font-medium">Email</label>
                            <input
                                type="email"
                                value={newUserEmail}
                                onChange={(e) => setNewUserEmail(e.target.value)}
                                className="mt-1 px-3 py-2 border border-gray-300 rounded w-full"
                                placeholder="Enter email"
                            />
                        </div>
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={() => setIsPopupOpen(false)}
                                className="px-4 py-2 bg-gray-300 text-black rounded"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddUser}
                                className="px-4 py-2 bg-blue-500 text-white rounded"
                            >
                                Add
                            </button>
                        </div>
                        <button
                            onClick={() => setIsPopupOpen(false)}
                            className="absolute top-2 right-2 text-xl text-gray-600"
                        >
                            ×
                        </button>
                    </div>
                </div>
            )}

            {/* Popup Edit User */}
            {selectedUser && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded shadow-lg w-96">
                        <h3 className="text-xl font-semibold mb-4">Edit User</h3>
                        <div className="mb-4">
                            <label className="block text-sm font-medium">User Name</label>
                            <input
                                type="text"
                                value={editName}
                                onChange={e => setEditName(e.target.value)}
                                className="mt-1 px-3 py-2 border border-gray-300 rounded w-full"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium">Role Name</label>
                            <select
                                value={editRoleId}
                                onChange={e => setEditRoleId(Number(e.target.value))}
                                className="mt-1 px-3 py-2 border border-gray-300 rounded w-full"
                            >
                                <option value={1}>Admin</option>
                                <option value={2}>Member</option>
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium">Status</label>
                            <select
                                value={editStatus ? "true" : "false"}
                                onChange={e => setEditStatus(e.target.value === "true")}
                                className="mt-1 px-3 py-2 border border-gray-300 rounded w-full"
                            >
                                <option value="true">Active</option>
                                <option value="false">Inactive</option>
                            </select>
                        </div>
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={() => setSelectedUser(null)}
                                className="px-4 py-2 bg-gray-300 text-black rounded"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdateUser}
                                className="px-4 py-2 bg-blue-500 text-white rounded"
                            >
                                Save
                            </button>
                        </div>
                        <button
                            onClick={() => setSelectedUser(null)}
                            className="absolute top-2 right-2 text-xl text-gray-600"
                        >
                            ×
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserListing;
