"use client";

import {
  BookOpenCheck,
  Calendar,
  CreditCard,
  LayoutDashboard,
  Trophy,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import logo from '@/public/omexLogo.png'


type SideBarItem = {
  name: string;
  route: string;
  icon: React.ReactNode;
};

const sideBarItems: SideBarItem[] = [
  {
    name: "DashBoard",
    route: "/student/dashboard",
    icon: <LayoutDashboard size={16} />,
  },
  { name: "My Profile", route: "/student/profile", icon: <Users size={16} /> },
  {
    name: "Register Exam",
    route: "/student/exam",
    icon: <BookOpenCheck size={16} />,
  },
  {
    name: "My Applications",
    route: "/student/applications",
    icon: <Calendar size={16} />,
  },
  { name: "Result", route: "/student/results", icon: <Trophy size={16} /> },
  {
    name: "Payment",
    route: "/student/payments",
    icon: <CreditCard size={16} />,
  },
];

const SideStudentBar = () => {
  const pathname = usePathname();

  return (
    <div className="bg-neutral-light shadow-neutral sticky top-0 z-10 h-screen w-64 space-y-4 p-4 shadow-md">
      <div className="h-18 overflow-clip">
        <Image
          src={logo}
          height={200}
          width={400}
          alt="THE OMEX LOGO"
          className="h-full w-auto object-contain "
        />
      </div>
      <ul className="space-y-2">
        {sideBarItems.map((item, index) => {
          const isActive = pathname.includes(item.route);
          return (
            <li key={index}>
              <Link
                href={item.route}
                className={`flex items-center gap-2 rounded-md p-4 font-medium transition-colors duration-300 ${isActive
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

export default SideStudentBar;
