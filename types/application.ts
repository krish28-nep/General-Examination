import { SemesterName } from "./semester"

export enum ExamType {
    Regular = "Regular",
    Back = "Back"
}

export enum ApplicationStatus {
    Pending = "Pending",
    Success = "Success",
    Rejected = "Rejected"
}

export type Application = {
    id: number
    user: {
        firstName: string
        middleName?: string
        lastName: string
        email: string
    }
    semester: {
        name: SemesterName
    }
    examType: ExamType
    status: ApplicationStatus
    createdAt: Date
}