"use client"

import React from "react"
import Image from "next/image"
import { Button } from "../general/Button"
import { ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import tuphoto from "@/public/tuphoto.jpg"
import { useAuth } from "@/hooks/useAuth"

const Banner = () => {
  const router = useRouter()
  const { user } = useAuth()

  return (
    <div className="grid md:grid-cols-2 gap-12 items-center">

      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground text-balance">
            Excellence in Education Management
          </h1>
          <p className="text-lg text-muted-foreground text-balance leading-relaxed">
            Streamlined examination and academic program management for modern educational institutions.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          {!user && <Button
            onClick={() => router.push("/student")}
            icon={<ArrowRight className="ml-2 h-4 w-4" />}
            className="w-full sm:w-auto"
            text="Student Login"
          />}
          <Button
            onClick={() => router.push('/programs')}
            variant="outline"
            className="w-full sm:w-auto bg-transparent"
            text="Learn More"
          />
        </div>
      </div>

      <div className="hidden md:flex items-center justify-center">
        <div className="relative w-full h-80 rounded-2xl overflow-hidden">
          <Image
            src={tuphoto}
            alt="Education Campus"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

    </div>
  )
}

export default Banner
