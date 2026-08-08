const POSITIVE = new Set(["결제완료", "배송완료", "전달완료", "정산완료", "완료", "확인"]);
const NEGATIVE = new Set(["취소", "미전달", "정산대기", "미확인"]);

export default function StatusPill({ status }: { status: string }) {
  let color = "bg-zinc-100 text-zinc-600";
  if (POSITIVE.has(status)) color = "bg-emerald-50 text-emerald-700";
  else if (NEGATIVE.has(status)) color = "bg-amber-50 text-amber-700";

  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ${color}`}
    >
      {status}
    </span>
  );
}
