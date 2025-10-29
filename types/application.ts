import { SemesterName } from "./semester";
import { StudentProfile } from "./user";

export enum ExamType {
  Regular = "Regular",
  Back = "Back",
}

export enum ApplicationStatus {
  Pending = "Pending",
  Success = "Success",
  Rejected = "Rejected",
}

export type Application = {
  id: number;
  user: {
    firstName: string;
    middleName?: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    photoUrl: string
    studentProfile?: StudentProfile
  };
  semester: {
    name: SemesterName;
  };
  program: {
    name: string;
  };
  examType: ExamType;
  status: ApplicationStatus;
  createdAt: Date;
};
