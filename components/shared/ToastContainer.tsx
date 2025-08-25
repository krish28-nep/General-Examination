"use client";

import { useToastContext } from "@/context/ToastContext";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, CheckCircle, X, XCircle } from "lucide-react";
import React from "react";

type ToastType = "success" | "error" | "warning";

type ToastStyle = {
  color: string;
  icon: React.ReactNode;
};

const ToastContainer = () => {
  const { toasts, removeToast } = useToastContext();

  const toastStyles: Record<ToastType, ToastStyle> = {
    success: {
      color: "bg-success hover:bg-success-dark",
      icon: <CheckCircle size={20} />,
    },
    error: {
      color: "bg-danger hover:bg-danger-dark",
      icon: <XCircle size={20} />,
    },
    warning: {
      color: "bg-warning hover:bg-warning-dark",
      icon: <AlertTriangle size={20} />,
    },
  };

  return (
    <div className="fixed top-0 right-0 z-50 m-4 flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, translateX: 20 }}
            animate={{ opacity: 1, translateX: 0 }}
            exit={{ opacity: 0, translateX: 20 }}
            transition={{ duration: 0.3 }}
            className={`shadow-neutral text-neutral-darker flex items-center gap-4 rounded-md p-4 font-medium shadow-md transition-colors duration-300 select-none ${toastStyles[toast.type].color}`}
          >
            {toastStyles[toast.type].icon}
            <p className="max-w-96">{toast.message}</p>
            <X
              onClick={() => removeToast(toast.id)}
              className="ml-auto cursor-pointer"
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export { ToastContainer };
