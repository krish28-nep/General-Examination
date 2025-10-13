"use client";

import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const Barchart = () => {
  const studentsByProgramData = {
    labels: ["BSc CSIT", "BBA", "BIM", "BBM", "BSW", "BHM"],
    datasets: [
      {
        label: "Students",
        data: [120, 95, 78, 88, 56, 64],
        backgroundColor: [
          "rgba(99, 102, 241, 0.8)", // Indigo
          "rgba(34, 197, 94, 0.8)", // Green
          "rgba(239, 68, 68, 0.8)", // Red
          "rgba(234, 179, 8, 0.8)", // Yellow
          "rgba(59, 130, 246, 0.8)", // Blue
          "rgba(168, 85, 247, 0.8)", // Purple
        ],
        borderColor: [
          "rgba(99, 102, 241, 1)",
          "rgba(34, 197, 94, 1)",
          "rgba(239, 68, 68, 1)",
          "rgba(234, 179, 8, 1)",
          "rgba(59, 130, 246, 1)",
          "rgba(168, 85, 247, 1)",
        ],
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: false },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "rgba(99, 102, 241, 0.5)",
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "rgba(100, 100, 100, 0.8)" },
        border: { display: false },
      },
      y: {
        grid: { color: "rgba(0, 0, 0, 0.05)" },
        ticks: { color: "rgba(100, 100, 100, 0.8)" },
        border: { display: false },
      },
    },
  };

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
          Students by Program
        </h3>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Total number of students enrolled in each program
        </p>
      </div>
      <div className="h-[350px]">
        <Bar data={studentsByProgramData} options={barChartOptions} />
      </div>
    </div>
  );
};

export default Barchart;
