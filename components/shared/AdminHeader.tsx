"use client";

import { User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/hooks/usetoast";
import axiosInstance from "@/lib/axios";
import { useQueryClient } from "@tanstack/react-query";

const AdminHeader = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const queryClient = useQueryClient()
  const router = useRouter();
  const toast = useToast()

  const handleLogout = async () => {
    await axiosInstance.post('/auth/logout')
    toast("Logout Successfully", "success")
    queryClient.removeQueries({ queryKey: ["users", "me"] });
    router.push("/");
  };

  return (
    <header className="bg-neutral-light sticky top-0 flex h-20 w-full items-center justify-between px-4 shadow-md">
       <span className="font-bold text-xl">Online Examination Registration System</span>
      <div className="relative">
        <div
          className="rounded-full p-2 border cursor-pointer"
          onClick={() => setModalOpen(!modalOpen)}
        >
          <User className="h-6 w-6" />
        </div>

        {modalOpen && (
          <div className="absolute top-12 right-0 bg-neutral-light border rounded-lg shadow-md">
            <button
              onClick={handleLogout}
              className="block w-full px-4 py-2 text-left hover:bg-neutral rounded-lg"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export { AdminHeader };
