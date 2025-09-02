export enum Role {
  Admin = "Admin",
  Student = "Student",
}

export enum Gender {
  Male = "Male",
  Female = "Female",
}

export enum MaritalStatus {
  Unmarried = "Unmarried",
  Married = "Married",
}

export type User = {
  id: number;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  photoUrl?: string;
  role: Role;
  studentProfile?: StudentProfile;
};

export type StudentProfile = {
  id: number;
  signature: string;
  fatherName: string;
  motherName: string;
  gender: Gender;
  maritalStatus: MaritalStatus;
  dateOfBirth: Date;
  collegeName: string;
  collegeAddress: string;
  programId: number;
  semesterId: number;
};
