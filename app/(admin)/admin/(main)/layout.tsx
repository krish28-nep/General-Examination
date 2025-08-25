"use client";
const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex">
      <div className="flex flex-1 flex-col">
        <div className="px-8 py-8">{children}</div>
      </div>
    </div>
  );
};

export default AdminLayout;
