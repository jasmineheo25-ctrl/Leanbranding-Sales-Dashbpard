import { eq } from 'drizzle-orm'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { products } from '@/lib/db/schema'
import { CATEGORY_STYLES, type Category } from '@/lib/categories'
import { formatPrice } from '@/lib/format'

type Params = Promise<{ id: string }>

export default async function ProductDetailPage({ params }: { params: Params }) {
  const { id } = await params
  const productId = Number(id)

  if (!Number.isInteger(productId)) {
    notFound()
  }

  const [product] = await db.select().from(products).where(eq(products.id, productId))

  if (!product) {
    notFound()
  }

  const categoryStyle = CATEGORY_STYLES[product.category as Category] ?? 'bg-gray-100 text-gray-700'

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Link href="/" className="mb-6 inline-block text-sm font-semibold text-orange-600 hover:underline">
        ← 목록으로
      </Link>

      <div className="grid gap-8 sm:grid-cols-2">
        <div className="flex aspect-square items-center justify-center rounded-2xl bg-gradient-to-br from-orange-100 via-amber-50 to-yellow-100 text-9xl">
          {product.thumbnailEmoji}
        </div>

        <div className="flex flex-col gap-3">
          <span className={`w-fit rounded-full px-2.5 py-0.5 text-xs font-bold ${categoryStyle}`}>
            {product.category}
          </span>
          <h1 className="text-2xl font-extrabold text-gray-900">{product.name}</h1>
          <p className="text-3xl font-extrabold text-orange-600">{formatPrice(product.price)}</p>

          <dl className="mt-2 divide-y divide-orange-100 rounded-xl border border-orange-100 bg-white text-sm">
            <div className="flex justify-between px-4 py-2.5">
              <dt className="text-gray-500">원산지</dt>
              <dd className="font-semibold text-gray-800">{product.origin ?? '정보 없음'}</dd>
            </div>
            <div className="flex justify-between px-4 py-2.5">
              <dt className="text-gray-500">중량</dt>
              <dd className="font-semibold text-gray-800">{product.weight ?? '정보 없음'}</dd>
            </div>
          </dl>

          <p className="mt-2 whitespace-pre-line leading-relaxed text-gray-700">{product.description}</p>
        </div>
      </div>
    </div>
  )
}
