"use client";

import {
  BookOpen,
  Calendar,
  CreditCard,
  FileText,
  GraduationCap,
  LayoutDashboard,
  Trophy,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type SideBarItem = {
  name: string;
  route: string;
  icon: React.ReactNode;
};

const sideBarItems: SideBarItem[] = [
  {
    name: "DashBoard",
    route: "/admin/dashboard",
    icon: <LayoutDashboard size={16} />,
  },
  { name: "Student", route: "/admin/students", icon: <Users size={16} /> },
  {
    name: "Program",
    route: "/admin/programs",
    icon: <GraduationCap size={16} />,
  },
  { name: "Semester", route: "/admin/semesters", icon: <Calendar size={16} /> },
  { name: "Course", route: "/admin/courses", icon: <BookOpen size={16} /> },
  {
    name: "Application",
    route: "/admin/applications",
    icon: <FileText size={16} />,
  },
  { name: "Result", route: "/admin/results", icon: <Trophy size={16} /> },
  { name: "Payment", route: "/admin/payments", icon: <CreditCard size={16} /> },
];

const SideAdminBar = () => {
  const pathname = usePathname();

  return (
    <div className="bg-neutral-light shadow-neutral sticky top-0 z-10 h-screen w-64 space-y-4 p-4 shadow-md">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/dashboard"
          className="text-primary h-16 text-2xl font-bold"
        >
          <h1 className="text-4xl">OMEX</h1>
        </Link>
      </div>
      <ul className="space-y-2">
        {sideBarItems.map((item, index) => {
          const isActive = pathname.includes(item.route);
          return (
            <li key={index}>
              <Link
                href={item.route}
                className={`flex items-center gap-2 rounded-md p-4 font-medium transition-colors duration-300 ${
                  isActive
                    ? "bg-primary-light border-primary border-1"
                    : "hover:bg-secondary-light"
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default SideAdminBar;
