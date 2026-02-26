import { Brand, Stage } from "@/data/mockData";
import { calculateDelay } from "./dateUtils";

export function computeOverallStatus(stages: Stage[]): string {
  if (stages.some(s => s.status === "Delayed")) return "Delayed";
  if (stages.every(s => s.status === "Completed")) return "Completed";
  if (stages.some(s => s.status === "In Progress" || s.status === "Completed")) return "In Progress";
  return "Pending";
}

export function computeProgress(stages: Stage[]): number {
  const completed = stages.filter(s => s.status === "Completed").length;
  return Math.round((completed / stages.length) * 100);
}

export function recalcBrand(brand: Brand): Brand {
  const stages = brand.stages.map(s => ({
    ...s,
    delay: calculateDelay(s.plannedEnd, s.actualEnd),
  }));
  return {
    ...brand,
    stages,
    overallStatus: computeOverallStatus(stages),
  };
}
