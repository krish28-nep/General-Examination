import { Degree } from "./program";

export enum SemesterName {
  First = "First",
  Second = "Second",
  Third = "Third",
  Fourth = "Fourth",
  Fifth = "Fifth",
  Sixth = "Sixth",
  Seventh = "Seventh",
  Eighth = "Eighth",
}

export enum CourseType {
  Compulsory = "Compulsory",
  Elective = "Elective",
}

export type Course = {
  id: number;
  name: string;
  code: string;
  type: CourseType;
  credit: number;
  semesterId: number;
  semester: {
    name: SemesterName;
    program: {
      name: string;
      degree: Degree;
    };
  };
};

export type Semester = {
  id: number;
  name: SemesterName;
  fee: number;
  programId: number;
  program: {
    name: string;
    degree: Degree;
  };
  courses: Course[];
};
