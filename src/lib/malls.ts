export type MallId = "srook" | "essential";

export interface Mall {
  id: MallId;
  name: string;
}

export const MALLS: Mall[] = [
  { id: "srook", name: "스룩" },
  { id: "essential", name: "에센셜" },
];

export function mallName(id: MallId): string {
  return MALLS.find((m) => m.id === id)?.name ?? id;
}
