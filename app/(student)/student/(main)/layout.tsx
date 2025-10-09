"use client";

import { AdminHeader } from "@/components/shared/AdminHeader";
import SideStudentBar from "@/components/shared/SideStudentBar";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex">
            <SideStudentBar />
            <div className="flex flex-1 flex-col">
                <AdminHeader />
                <div className="px-8 py-8">{children}</div>
            </div>
        </div>
    );
};

export default AdminLayout;
