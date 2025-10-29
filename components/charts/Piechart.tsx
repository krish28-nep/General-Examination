"use client";

import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { useQuery } from "@tanstack/react-query";
import { fetchApplicationByStatus } from "@/lib/api/dashboard";
import { Spinner } from "../Spinner";

ChartJS.register(ArcElement, Tooltip, Legend);

const Piechart = () => {
  const { data: applicationStatus, isLoading } = useQuery<Record<string, number>[]>({
    queryFn: fetchApplicationByStatus,
    queryKey: ["applicationStatus"],
  });

  const labels = applicationStatus?.map(item => Object.keys(item)[0]) ?? [];
  const counts = applicationStatus?.map(item => Object.values(item)[0]) ?? [];

  const applicationStatusData = {
    labels,
    datasets: [
      {
        label: "Applications",
        data: counts,
        backgroundColor: [
          "rgba(251, 191, 36, 0.5)", // Softer Yellow
          "rgba(34, 197, 94, 0.5)",  // Softer Green
          "rgba(239, 68, 68, 0.5)",  // Softer Red
          "rgba(99, 102, 241, 0.5)", // Softer Indigo
        ],
        borderColor: [
          "rgba(251, 191, 36, 0.8)",
          "rgba(34, 197, 94, 0.8)",
          "rgba(239, 68, 68, 0.8)",
          "rgba(99, 102, 241, 0.8)",
        ],
        hoverBackgroundColor: [
          "rgba(251, 191, 36, 0.7)",
          "rgba(34, 197, 94, 0.7)",
          "rgba(239, 68, 68, 0.7)",
          "rgba(99, 102, 241, 0.7)",
        ],
        borderWidth: 2,
      },
    ],
  };

  const doughnutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right" as const,
        labels: {
          color: "rgba(100, 100, 100, 0.9)",
          padding: 16,
          font: { size: 13 },
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "rgba(99, 102, 241, 0.5)",
        borderWidth: 1,
      },
    },
    cutout: "65%",
  };

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
          Application Status Distribution
        </h3>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Breakdown of application statuses
        </p>
      </div>
      <div className="h-[350px]">
        {isLoading ? <Spinner /> : <Doughnut data={applicationStatusData} options={doughnutChartOptions} />}
      </div>
    </div>
  );
};

export default Piechart;
