"use client";

import { ChevronDown, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/hooks/usetoast";
import axiosInstance from "@/lib/axios";
import Image from "next/image";
import logo from "@/public/omexLogo.png";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Program } from "@/types/program";
import { fetchPrograms } from "@/lib/api/program";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "../general/Button";

const ClientHeader = () => {
    const queryClient = useQueryClient()
    const [modalOpen, setModalOpen] = useState(false)
    const { user } = useAuth()
    const [programOpen, setProgramOpen] = useState(false);
    const toast = useToast();
    const router = useRouter();

    const { data: programsData = [] } = useQuery<Program[]>({
        queryKey: ["programs"],
        queryFn: fetchPrograms,
    });

    const handleLogout = async () => {
        await axiosInstance.post("/auth/logout");
        toast("Logout Successfully", "success");
        queryClient.removeQueries({ queryKey: ["users", "me"] });
        router.push("/");
    };

    return (
        <header className="bg-primary-light sticky top-0 flex h-20 w-full items-center px-4 shadow-md z-50">
            <div className="flex justify-between content-wrapper items-center">

                <div className="h-16 flex items-center">
                    <Image
                        src={logo}
                        alt="OMEX Logo"
                        height={160}
                        width={320}
                        className="h-full w-auto object-contain"
                    />
                </div>

                <nav className="flex items-center gap-4 text-base font-semibold">
                    <span onClick={() => router.push('/')} className="cursor-pointer hover:text-primary-dark transition-all p-4">
                        Home
                    </span>

                    <div
                        className="relative cursor-pointer"
                        onMouseEnter={() => setProgramOpen(true)}
                        onMouseLeave={() => setProgramOpen(false)}
                    >
                        <span className="flex items-center gap-1 hover:text-primary-dark transition-all p-4">
                            Programs <ChevronDown size={16} />
                        </span>

                        {programOpen && (
                            <div
                                className="absolute top-full left-0 pt-2 flex flex-col 
                                     bg-neutral-light border border-neutral-dark rounded-md shadow-lg
                                        min-w-[200px] py-2 z-40 transition-all"
                            >

                                {programsData.length > 0 ? (
                                    programsData.map((program) => (
                                        <div
                                            key={program.id}
                                            onClick={() => { router.push(`/programs/${program.id}`); setProgramOpen(false) }}
                                            className="px-4 py-2 hover:bg-neutral cursor-pointer transition-all"
                                        >
                                            {program.name}
                                        </div>
                                    ))
                                ) : (
                                    <div className="px-4 py-2 text-sm text-neutral-dark">
                                        No Programs Available
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </nav>

                {user ? <div className="relative">
                    <button
                        className="rounded-full p-2 border border-neutral-dark hover:bg-neutral transition-all"
                        onClick={() => setModalOpen(!modalOpen)}
                    >
                        <User className="h-6 w-6" />
                    </button>

                    {modalOpen && (
                        <div className="absolute top-12 right-0 bg-neutral-light border border-neutral-dark rounded-lg shadow-md py-1 min-w-[150px]">
                            <button
                                onClick={handleLogout}
                                className="block w-full px-4 py-2 text-left hover:bg-neutral transition-all"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div> : <Button onClick={() => router.push('/student')} text="Login" />}

            </div>
        </header>
    );
};

export { ClientHeader };
