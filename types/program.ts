import { Semester } from "./semester";

export type Program = {
  id: number;
  name: string;
  degree: Degree;
  fee: number;
  semesters: Semester[];
};

export enum Degree {
  Bachelor = "Bachelor",
  Master = "Master",
  PhD = "PhD",
}
