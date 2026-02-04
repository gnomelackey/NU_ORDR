export type MatrixDieStatus = "active" | "locked" | "success";

export type MatrixDie = {
  id: string;
  value: number;
  status: MatrixDieStatus;
};
