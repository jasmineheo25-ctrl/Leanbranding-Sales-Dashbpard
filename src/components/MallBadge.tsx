import type { MallId } from "@/lib/malls";
import { mallName } from "@/lib/malls";

const COLORS: Record<MallId, string> = {
  leanbranding: "bg-rose-50 text-rose-700",
};

export default function MallBadge({ mall }: { mall: MallId }) {
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ${COLORS[mall]}`}
    >
      {mallName(mall)}
    </span>
  );
}
