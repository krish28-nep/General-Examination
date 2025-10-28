"use client";

import { fetchMe } from "@/lib/api/user";
import { Role } from "@/types/user";
import { useQuery } from "@tanstack/react-query";

type User = {
    id: number
    firstName: string
    middleName: string | null
    lastName: string
    role: Role
}

const useAuth = () => {
    const {
        data: user,
        isLoading: isUserLoading,
        isError: isUserError,
    } = useQuery<User>({
        queryKey: ["users", "me"],
        queryFn: fetchMe,
    });

    return { user, isUserLoading, isUserError };
};

export { useAuth };
