"use client";
import React from "react";

export const Spinner = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="w-10 h-10 border-4 border-t-teal-500 border-gray-200 rounded-full animate-spin"></div>
    </div>
  );
};
