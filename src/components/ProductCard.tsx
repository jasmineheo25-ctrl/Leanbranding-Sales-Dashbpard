import { formatPrice } from '@/lib/format'
import { CATEGORY_STYLES, type Category } from '@/lib/categories'
import type { Product } from '@/lib/db/schema'

export function ProductCard({ product }: { product: Product }) {
  const categoryStyle = CATEGORY_STYLES[product.category as Category] ?? 'bg-gray-100 text-gray-700'

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="flex aspect-square items-center justify-center bg-gradient-to-br from-orange-100 via-amber-50 to-yellow-100 text-6xl">
        <span className="transition group-hover:scale-110">{product.thumbnailEmoji}</span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <span className={`w-fit rounded-full px-2.5 py-0.5 text-xs font-bold ${categoryStyle}`}>
          {product.category}
        </span>
        <h3 className="line-clamp-2 font-bold text-gray-900">{product.name}</h3>
        {product.weight && <p className="text-xs text-gray-500">{product.weight}</p>}
        <p className="mt-auto text-lg font-extrabold text-orange-600">{formatPrice(product.price)}</p>
      </div>
    </div>
  )
}
