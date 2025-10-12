"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addApplication } from "@/lib/api/application";
import { useToast } from "@/hooks/usetoast";
import { ApplicationCreateInput, applicationCreateSchema } from "@/schema/application.schema";

const Success = () => {
    const [isLoading, setIsLoading] = useState(true);
    const toast = useToast()
    const queryClient = useQueryClient()

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 2000);
        return () => clearTimeout(timer);
    }, []);

    const addApplicationMutation = useMutation({
        mutationFn: addApplication,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["applications"] })
            toast("Success to add Application", "success")

        },
        onError: () => {
            toast("Failed to add Application", "error")
        }
    })

    useEffect(() => {
        // Get data from localStorage
        const storedData = localStorage.getItem("applicationData");
        if (storedData) {
            try {
                const parsedData: ApplicationCreateInput = JSON.parse(storedData);

                const validatedData = applicationCreateSchema.parse(parsedData);

                addApplicationMutation.mutate(validatedData);

                localStorage.removeItem("applicationData");
            } catch (err) {
                console.error("Invalid application data", err);
                toast("Invalid application data", "error");
            }
        }
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
            {isLoading ? (
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-lg font-semibold text-gray-700">
                        Processing your payment...
                    </span>
                </div>
            ) : (
                <div className="flex flex-col items-center gap-6">
                    <CheckCircle size={80} className="text-green-500 animate-bounce" />
                    <h1 className="text-2xl font-bold text-gray-800">Payment Successful!</h1>
                    <p className="text-gray-600 text-center max-w-xs">
                        Your payment has been successfully processed. Click continue to
                        proceed with your examination application.
                    </p>
                    <button
                        onClick={() => {
                            window.location.href = "/student/applications";
                        }}
                        className="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition"
                    >
                        Continue
                    </button>
                </div>
            )}
        </div>
    );
};

export default Success;
