import { User } from "lucide-react"

const AdminHeader = () => {
    return (
        <header className="bg-neutral-light sticky top-0 flex h-20 w-full items-center justify-between px-4 shadow-md">
            <input placeholder="Search..." className="input-field " />
            <div className="rounded-full p-2 border">
                <User className="h-6 w-6" />
            </div>
        </header>
    )
}

export { AdminHeader }