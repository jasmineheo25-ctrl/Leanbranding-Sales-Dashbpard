import Link from 'next/link'

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="bg-orange-500 text-white shadow-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-2 text-xl font-extrabold tracking-tight">
            <span className="text-2xl">🛒</span>
            대용량 마켓
          </Link>
          <nav className="text-sm font-semibold text-orange-50">
            <Link href="/" className="hover:text-white">
              상품 둘러보기
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1 bg-orange-50/40">{children}</main>
      <footer className="border-t border-orange-100 bg-white py-6 text-center text-xs text-gray-400">
        학습용 데모 프로젝트 · 실제 결제/배송은 테스트 모드로만 운영됩니다.
      </footer>
    </>
  )
}
