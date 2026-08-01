import { eq } from 'drizzle-orm'
import Link from 'next/link'
import { db } from '@/lib/db'
import { products } from '@/lib/db/schema'
import { CATEGORIES, type Category } from '@/lib/categories'
import { ProductCard } from '@/components/ProductCard'

type SearchParams = Promise<{ category?: string }>

export default async function ProductListPage({ searchParams }: { searchParams: SearchParams }) {
  const { category } = await searchParams
  const isValidCategory = CATEGORIES.includes(category as Category)
  const selectedCategory = isValidCategory ? (category as Category) : undefined

  const productList = selectedCategory
    ? await db.select().from(products).where(eq(products.category, selectedCategory))
    : await db.select().from(products)

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <section className="mb-8 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-400 p-8 text-white shadow-md">
        <h1 className="text-2xl font-extrabold sm:text-3xl">대용량, 이제 필요한 만큼만!</h1>
        <p className="mt-2 text-orange-50">
          창고형 마트의 대용량 상품을 온라인으로 편하게 만나보세요. 회원가입 없이도 바로 둘러볼 수 있어요.
        </p>
      </section>

      <div className="mb-6 flex flex-wrap gap-2">
        <CategoryTab label="전체" href="/" active={!selectedCategory} />
        {CATEGORIES.map((cat) => (
          <CategoryTab key={cat} label={cat} href={`/?category=${encodeURIComponent(cat)}`} active={selectedCategory === cat} />
        ))}
      </div>

      {productList.length === 0 ? (
        <p className="py-16 text-center text-gray-400">해당 카테고리에 등록된 상품이 없습니다.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {productList.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}

function CategoryTab({ label, href, active }: { label: string; href: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={`rounded-full px-4 py-2 text-sm font-bold transition ${
        active ? 'bg-orange-500 text-white shadow' : 'bg-white text-gray-600 hover:bg-orange-100'
      }`}
    >
      {label}
    </Link>
  )
}
