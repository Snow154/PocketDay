export type Task = {
  id: number;
  title: string;
  detail: string;
  done: boolean;
  dueDate?: string;
  order: number;
};