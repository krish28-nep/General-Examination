"use client";

import { Award, BookOpen, Users } from "lucide-react";
import React from "react";

const features = [
    {
        id: 1,
        icon: Users,
        title: "Student Management",
        description:
            "Maintain comprehensive student records, track academic performance, and manage enrollment workflows effectively.",
    },
    {
        id: 2,
        icon: Award,
        title: "Examination System",
        description:
            "Streamlined exam scheduling, secure result processing, and insightful performance reporting.",
    },
    {
        id: 3,
        icon: BookOpen,
        title: "Course Management",
        description:
            "Manage course offerings, semester structures, and credit allocations with centralized control.",
    },
];

const FeatureSection = () => {
    return (
        <div className="flex flex-col gap-8">
            <div className="text-center space-y-3">
                <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
                    Feature Overview
                </h2>
                <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
                    A forward-thinking academic management environment engineered for operational clarity and educational excellence.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {features.map(({ id, icon: Icon, title, description }) => (
                    <div
                        key={id}
                        className="border rounded-lg p-6 bg-card hover:shadow-lg transition-shadow group cursor-default"
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <Icon className="h-8 w-8 text-primary transition-transform group-hover:scale-105" />
                            <h3 className="font-medium text-lg">{title}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            {description}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FeatureSection;
