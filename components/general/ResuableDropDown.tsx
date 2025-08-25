"use client";

import * as React from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./Button";
import { ArrowDown } from "lucide-react";

interface ReusableDropdownProps<T = string> {
    items: T[];
    disabled?: boolean;
    placeholder?: string;
    onSelect: (item: T) => void;
}

export function ReusableDropdown<T extends string>({
    items,
    disabled = false,
    placeholder = "Select",
    onSelect,
}: ReusableDropdownProps<T>) {
    const [selected, setSelected] = React.useState<T | null>(null);
    const [open, setOpen] = React.useState(false);

    const handleSelect = (item: T) => {
        setSelected(item);
        onSelect(item);
        setOpen(false);
    };

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
                <div className="relative w-full flex justify-between items-center">
                    <Button
                        variant="outline"
                        className="flex-1"
                        disabled={disabled}
                        text={selected ?? placeholder}
                    />
                    <ArrowDown
                        size={16}
                        className={`ml-2 transition-transform duration-200 absolute right-4 ${open ? "rotate-180" : "rotate-0"}`}
                    />
                </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width]">
                {items.map((item) => (
                    <DropdownMenuItem key={item} onClick={() => handleSelect(item)}>
                        {item}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
