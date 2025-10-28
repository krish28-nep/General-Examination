// auth login
"use client"
import { useToast } from '@/hooks/usetoast';
import axiosInstance from '@/lib/axios';
import { Eye, EyeClosed } from 'lucide-react';
import React, { useState } from 'react'
import { FieldValues, useForm } from 'react-hook-form';
import { Button } from '@/components/general/Button';

const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false)
    const {
        register,
        reset,
        setError,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({ mode: `onBlur` });
    const toast = useToast()

    const onSubmit = async (data: FieldValues) => {
        try {
            await axiosInstance.post("/auth/login", data, {
                withCredentials: true,
            });
            toast("Login Successful", "success");
            location.href = "/student/dashboard";
            reset()
        } catch (error: any) {
            const errMsg = error.response?.data || "Login failed";
            toast(errMsg, "error");
            setError("password", { message: errMsg });
        }
    };

    return (
        <div className="flex h-screen w-screen items-center justify-center ">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-6 px-6 py-8 w-full max-w-md text-base"
            >
                <div className='text-center'>
                    <h1 className="text-4xl font-bold">Welcome Back</h1>
                    <p className='text-base'>Sign in to your account to continue</p>
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="text-lg font-semibold">
                        Email
                    </label>
                    <input
                        {...register("email", {
                            required: "Email is required.",
                            pattern: {
                                value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                                message: "Invalid email address",
                            },
                        })}
                        type="text"
                        placeholder="Enter your Email"
                        className="border-b-2 focus:outline-none focus:border-b-2 px-2 py-2"
                    />
                    {errors.email && (
                        <span className="text-red-500 text-sm">
                            {String(errors?.email?.message)}
                        </span>
                    )}
                </div>
                <div className="flex flex-col relative gap-2">
                    <label htmlFor="password" className="text-lg font-semibold">
                        Password
                    </label>
                    <input
                        {...register("password", {
                            required: "Password is required.",
                        })}
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your Password"
                        className="border-b-2 focus:outline-none focus:border-b-2 px-2 py-2 pr-20 "
                    />
                    {errors.password && (
                        <span className="text-red-500 text-sm">
                            {String(errors?.password?.message)}
                        </span>
                    )}
                    <div
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute top-10 right-4 cursor-pointer"
                    >
                        {showPassword ? <Eye /> : <EyeClosed />}
                    </div>
                </div>
                <Button type='submit' variant='primary' disabled={isSubmitting} text='  Login' />
            </form>
        </div>
    );
}

export default LoginPage
