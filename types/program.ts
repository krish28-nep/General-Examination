export type Program = {
    id: number;
    name: string;
    degree: Degree;
    fee: number;
};

export enum Degree {
    Bachelor = "Bachelor",
    Master = "Master",
    PhD = "PhD",
}
