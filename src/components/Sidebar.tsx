"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/nav";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  }

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-zinc-200 bg-white">
      <div className="px-5 py-6">
        <p className="text-lg font-semibold text-zinc-900">매출 관리</p>
        <p className="text-xs text-zinc-500">leanbranding</p>
      </div>
      <nav className="flex flex-1 flex-col gap-1 px-3">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-lg px-3 py-2.5 text-sm transition-colors ${
                active
                  ? "bg-zinc-900 text-white font-medium"
                  : "text-zinc-700 hover:bg-zinc-100"
              }`}
            >
              <div>{item.label}</div>
              <div
                className={`text-xs ${active ? "text-zinc-300" : "text-zinc-400"}`}
              >
                {item.description}
              </div>
            </Link>
          );
        })}
      </nav>
      <button
        onClick={handleLogout}
        className="mx-3 mb-4 rounded-lg px-3 py-2 text-left text-sm text-zinc-500 hover:bg-zinc-100"
      >
        로그아웃
      </button>
    </aside>
  );
}
