import React, { useState, useEffect } from 'react';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '../ui/table/index';
import UserService, { User } from '../../service/UserService'; // Đảm bảo đường dẫn đúng

const UserListing: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
    const [newUserEmail, setNewUserEmail] = useState<string>('');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [editName, setEditName] = useState('');
    const [editRoleId, setEditRoleId] = useState<number>(2);
    const [editStatus, setEditStatus] = useState<boolean>(true);

    // Fetch users từ UserService
    const fetchUsers = async () => {
        try {
            const data = await UserService.getAll();
            console.log("Dữ liệu trả về từ API:", data); // In ra dữ liệu nhận được
            setUsers(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching users:', error);
            setUsers([]); // Đảm bảo luôn là array khi lỗi
        }
    };

    // Gọi hàm fetchUsers khi component được mount
    useEffect(() => {
        fetchUsers();
    }, []);

    const handleAddUser = async () => {
        if (newUserEmail) {
            try {
                // Gọi API chỉ với email
                const addedUser = await UserService.findByEmail(newUserEmail);
                setUsers([...users, addedUser]);
                setIsPopupOpen(false);
                setNewUserEmail('');
            } catch (error) {
                console.error('Error adding user:', error);
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
            // Nếu muốn update AvatarUrl thì thêm dòng dưới (nếu có input cho avatar)
            // formData.append("AvatarUrl", avatarUrl);

            await UserService.update(selectedUser.userId, formData);
            fetchUsers();
            setSelectedUser(null);
        } catch (error) {
            console.error("Update failed", error);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-xl font-semibold mb-4">User List</h2>

            <button
                onClick={() => setIsPopupOpen(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded"
            >
                Add User
            </button>

            <div className="mt-6">
                {/* Sử dụng Table component để hiển thị danh sách người dùng */}
                <Table className="min-w-full">
                    <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                        <TableRow>
                            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                User
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
                        {users.map((user) => (
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
                                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${user.status
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-700"
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

            {/* Popup Add User */}
            {isPopupOpen && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded shadow-lg w-96">
                        <h3 className="text-xl font-semibold mb-4">Add New User</h3>

                        {/* Chỉ còn input email */}
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
                            <label className="block text-sm font-medium">Name</label>
                            <input
                                type="text"
                                value={editName}
                                onChange={e => setEditName(e.target.value)}
                                className="mt-1 px-3 py-2 border border-gray-300 rounded w-full"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium">Role</label>
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
                                onClick={handleUpdateUser} // Đảm bảo gọi hàm update user
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
