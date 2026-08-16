"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import * as XLSX from "xlsx";

export interface SupplierInfo {
  supplierId: string;
  supplierName: string;
  email: string;
  commissionRate: number;
}

const HEADERS = ["공급사ID", "공급사명", "이메일", "수수료율(%)"];

function handleDownload(suppliers: SupplierInfo[]) {
  const sheetData: (string | number)[][] = [
    HEADERS,
    ...suppliers.map((s) => [s.supplierId, s.supplierName, s.email, s.commissionRate]),
  ];
  const sheet = XLSX.utils.aoa_to_sheet(sheetData);
  sheet["!cols"] = [{ wch: 14 }, { wch: 20 }, { wch: 28 }, { wch: 10 }];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, sheet, "공급사 기본정보");
  XLSX.writeFile(workbook, "공급사_기본정보.xlsx");
}

export default function SupplierInfoBanner({ suppliers }: { suppliers: SupplierInfo[] }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setUploading(true);
    setError(null);
    setMessage(null);

    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const parsed: Record<string, unknown>[] = XLSX.utils.sheet_to_json(sheet);

      const rows = parsed
        .map((r) => ({
          supplier_id: String(r["공급사ID"] ?? "").trim(),
          supplier_name: String(r["공급사명"] ?? "").trim(),
          email: String(r["이메일"] ?? "").trim(),
          commission_rate: Number(r["수수료율(%)"]) || 0,
        }))
        .filter((r) => r.supplier_id);

      if (rows.length === 0) {
        throw new Error("업로드할 유효한 행이 없어요. 다운로드한 양식을 그대로 사용해주세요.");
      }

      const res = await fetch("/api/suppliers/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rows }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `업로드 실패 (${res.status})`);
      }

      const body = await res.json();
      setMessage(`${body.count}개 공급사 정보를 저장했어요.`);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "알 수 없는 오류");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-medium text-zinc-900">공급사 기본정보</p>
          <p className="text-xs text-zinc-500">
            엑셀로 여러 공급사의 이메일·수수료율을 한 번에 관리해요. 다운로드한 양식에 이메일·수수료율만 채워서
            다시 업로드하면 저장돼요.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleDownload(suppliers)}
            className="rounded-md border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
          >
            엑셀 다운로드
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-700 disabled:opacity-40"
          >
            {uploading ? "업로드 중..." : "엑셀 업로드"}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileSelected}
            className="hidden"
          />
        </div>
      </div>
      {message && <p className="mt-2 text-xs text-emerald-600">{message}</p>}
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  );
}
