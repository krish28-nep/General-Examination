import ToastProvider from "@/context/ToastContext";
import React from "react";

const ContextProvider = ({ children }: { children: React.ReactNode }) => {
  return <ToastProvider>{children}</ToastProvider>;
};

export { ContextProvider };
