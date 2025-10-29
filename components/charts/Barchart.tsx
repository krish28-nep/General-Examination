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
import { useQuery } from "@tanstack/react-query";
import { fetchStudentsByProgram } from "@/lib/api/dashboard";
import { Spinner } from "../Spinner";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Barchart = () => {
  const { data: studentsByProgram, isLoading } = useQuery<Record<string, number>[]>({
    queryFn: fetchStudentsByProgram,
    queryKey: ["studentsByProgram"],
  });

  const labels = studentsByProgram?.map(item => Object.keys(item)[0]) ?? [];
  const counts = studentsByProgram?.map(item => Object.values(item)[0]) ?? [];

  const backgroundColors = [
    "rgba(99, 102, 241, 0.5)",  // Softer Indigo
    "rgba(34, 197, 94, 0.5)",   // Softer Green
    "rgba(239, 68, 68, 0.5)",   // Softer Red
    "rgba(234, 179, 8, 0.5)",   // Softer Yellow
    "rgba(59, 130, 246, 0.5)",  // Softer Blue
    "rgba(168, 85, 247, 0.5)",  // Softer Purple
  ];

  const hoverColors = [
    "rgba(99, 102, 241, 0.7)",
    "rgba(34, 197, 94, 0.7)",
    "rgba(239, 68, 68, 0.7)",
    "rgba(234, 179, 8, 0.7)",
    "rgba(59, 130, 246, 0.7)",
    "rgba(168, 85, 247, 0.7)",
  ];

  const studentsByProgramData = {
    labels,
    datasets: [
      {
        label: "Students",
        data: counts,
        backgroundColor: backgroundColors,
        borderColor: hoverColors,
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
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
      },
    },
    scales: {
      x: { ticks: { color: "rgba(100, 100, 100, 0.8)" } },
      y: { ticks: { color: "rgba(100, 100, 100, 0.8)" } },
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
        {isLoading ? <Spinner /> : <Bar data={studentsByProgramData} options={barChartOptions} />}
      </div>
    </div>
  );
};

export default Barchart;
