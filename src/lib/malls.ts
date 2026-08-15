export type MallId = "leanbranding";

export interface Mall {
  id: MallId;
  name: string;
}

export const MALLS: Mall[] = [{ id: "leanbranding", name: "leanbranding" }];

export function mallName(id: MallId): string {
  return MALLS.find((m) => m.id === id)?.name ?? id;
}
