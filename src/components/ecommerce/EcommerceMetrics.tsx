import {
  ArrowDownIcon,
  ArrowUpIcon,
  BoxIconLine,
  GroupIcon,
} from "../../icons";
import Badge from "../ui/badge/Badge";
import { useEffect, useState } from "react";
import UserService, { User } from "../../service/UserService";
import { PaymentService, Payment } from "../../service/PaymentService";

export default function EcommerceMetrics() {
  const [userCount, setUserCount] = useState(0);
  const [newUserCount, setNewUserCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [completedPercent, setCompletedPercent] = useState(0);

  useEffect(() => {
    async function fetchData() {
      // Users
      const users: User[] = await UserService.getAll();
      setUserCount(users.length);

      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      const newUsers = users.filter(u => {
        const date = new Date(u.createdAt);
        return date.getFullYear() === currentYear && date.getMonth() === currentMonth;
      });
      setNewUserCount(newUsers.length);

      // Payments
      const payments: Payment[] = await PaymentService.getAll();

      // Completed payments this month and last month
      let completedThisMonth = 0;
      let completedPrevMonth = 0;
      payments.forEach(p => {
        if (p.payStatus === "Completed" && p.paidAt) {
          const date = new Date(p.paidAt);
          if (date.getFullYear() === currentYear && date.getMonth() === currentMonth) {
            completedThisMonth++;
          } else if (
            date.getFullYear() === currentYear &&
            date.getMonth() === currentMonth - 1
          ) {
            completedPrevMonth++;
          } else if (
            currentMonth === 0 &&
            date.getFullYear() === currentYear - 1 &&
            date.getMonth() === 11
          ) {
            completedPrevMonth++;
          }
        }
      });
      setCompletedCount(completedThisMonth);

      // Percent change
      if (completedPrevMonth > 0) {
        setCompletedPercent(
          Math.round(((completedThisMonth - completedPrevMonth) / completedPrevMonth) * 100)
        );
      } else {
        setCompletedPercent(completedThisMonth > 0 ? 100 : 0);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {/* Customers */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Customers
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {userCount.toLocaleString()}
            </h4>
          </div>
          <Badge color="success">
            <ArrowUpIcon />
            {newUserCount}
          </Badge>
        </div>
      </div>
      {/* Orders */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Orders (Completed)
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {completedCount.toLocaleString()}
            </h4>
          </div>
          <Badge color={completedPercent >= 0 ? "success" : "error"}>
            {completedPercent >= 0 ? <ArrowUpIcon /> : <ArrowDownIcon />}
            {completedPercent}%
          </Badge>
        </div>
      </div>
    </div>
  );
}
