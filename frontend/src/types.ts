export const JobPriority = {
  Low: "Low",
  Medium: "Medium",
  High: "High",
} as const;

export const JobCategory = {
  Repair: "Repair",
  Maintenance: "Maintenance",
  Inspection: "Inspection",
} as const;

export type JobPriority = (typeof JobPriority)[keyof typeof JobPriority];
export type JobCategory = (typeof JobCategory)[keyof typeof JobCategory];

export interface Job {
  id: number;
  title: string;
  clientName: string;
  status: string;
  priority: JobPriority;
  category: JobCategory;
  createdAt?: string;
  updatedAt?: string;
}