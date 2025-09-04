"use client";

import { AdminHeader } from "@/components/shared/AdminHeader";
import SideAdminBar from "@/components/shared/SideAdminBar";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex">
      <SideAdminBar />
      <div className="flex flex-1 flex-col">
        <AdminHeader />
        <div className="px-8 py-8">{children}</div>
      </div>
    </div>
  );
};

export default AdminLayout;
