import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useEffect, useState } from "react";
import { PaymentService, Payment } from "../../service/PaymentService";

export default function MonthlyTarget() {
  const [currentMonthRevenue, setCurrentMonthRevenue] = useState(0);
  const [lastMonthRevenue, setLastMonthRevenue] = useState(0);
  const [percentChange, setPercentChange] = useState(0);

  useEffect(() => {
    async function fetchPayments() {
      const payments: Payment[] = await PaymentService.getAll();
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      let currentTotal = 0;
      let lastTotal = 0;

      payments.forEach((p) => {
        // Chỉ lấy payment đã hoàn thành và có paidAt
        if (p.payStatus === "Completed" && p.paidAt) {
          const date = new Date(p.paidAt);
          if (
            date.getFullYear() === currentYear &&
            date.getMonth() === currentMonth
          ) {
            currentTotal += p.amount;
          } else if (
            date.getFullYear() === currentYear &&
            date.getMonth() === currentMonth - 1
          ) {
            lastTotal += p.amount;
          } else if (
            currentMonth === 0 &&
            date.getFullYear() === currentYear - 1 &&
            date.getMonth() === 11
          ) {
            lastTotal += p.amount;
          }
        }
      });

      setCurrentMonthRevenue(currentTotal);
      setLastMonthRevenue(lastTotal);

      if (lastTotal > 0) {
        setPercentChange(
          Math.round(((currentTotal - lastTotal) / lastTotal) * 100)
        );
      } else {
        setPercentChange(0);
      }
    }
    fetchPayments();
  }, []);

  // Chart value: percent of last month
  const percent =
    lastMonthRevenue === 0
      ? currentMonthRevenue > 0
        ? 100
        : 0
      : ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100;

  // Giới hạn giá trị truyền vào chart từ 0 đến 100
  const chartValue = percent < 0 ? 0 : percent > 100 ? 100 : percent;
  const series = [parseFloat(chartValue.toFixed(2))];

  const options: ApexOptions = {
    colors: ["#465FFF"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "radialBar",
      height: 330,
      sparkline: { enabled: true },
    },
    plotOptions: {
      radialBar: {
        startAngle: -85,
        endAngle: 85,
        hollow: { size: "80%" },
        track: { background: "#E4E7EC", strokeWidth: "100%", margin: 5 },
        dataLabels: {
          name: { show: false },
          value: {
            fontSize: "36px",
            fontWeight: "600",
            offsetY: -40,
            color: "#1D2939",
            formatter: function (val) {
              return val + "%";
            },
          },
        },
      },
    },
    fill: { type: "solid", colors: ["#465FFF"] },
    stroke: { lineCap: "round" },
    labels: ["% of last month"],
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="px-5 pt-5 bg-white shadow-default rounded-2xl pb-11 dark:bg-gray-900 sm:px-6 sm:pt-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Monthly
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            Revenue compared to last month
          </p>
        </div>
        <div className="relative ">
          <div className="max-h-[330px]" id="chartDarkStyle">
            <Chart options={options} series={series} type="radialBar" height={330} />
          </div>
        </div>
        <p className="mx-auto mt-10 w-full max-w-[380px] text-center text-sm text-gray-500 sm:text-base">
          This month: {currentMonthRevenue.toLocaleString("en-US")} VND
          <br />
          Last month: {lastMonthRevenue.toLocaleString("en-US")} VND
        </p>
      </div>

      <div className="flex items-center justify-center gap-5 px-6 py-3.5 sm:gap-8 sm:py-5">
        <div>
          <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">
            Last Month Revenue
          </p>
          <p className="flex items-center justify-center gap-1 text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg">
            {lastMonthRevenue.toLocaleString("en-US")} VND
          </p>
        </div>

        <div className="w-px bg-gray-200 h-7 dark:bg-gray-800"></div>

        <div>
          <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">
            Revenue
          </p>
          <p className="flex items-center justify-center gap-1 text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg">
            {currentMonthRevenue.toLocaleString("en-US")} VND
          </p>
        </div>

        <div className="w-px bg-gray-200 h-7 dark:bg-gray-800"></div>

        <div>
          <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">
            % Compared to Last Month
          </p>
          <p className="flex items-center justify-center gap-1 text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg">
            {percentChange >= 0 ? "+" : ""}
            {percentChange}%
            {percentChange > 0 ? (
              <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
                <path fill="#039855" d="M8 3l5 5H3l5-5z" />
              </svg>
            ) : percentChange < 0 ? (
              <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
                <path fill="#D92D20" d="M8 13l-5-5h10l-5 5z" />
              </svg>
            ) : null}
          </p>
        </div>
      </div>
    </div>
  );
}
