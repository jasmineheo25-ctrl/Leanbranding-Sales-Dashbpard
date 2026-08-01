export const CATEGORIES = ['식품', '생활용품'] as const
export type Category = (typeof CATEGORIES)[number]

export const CATEGORY_STYLES: Record<Category, string> = {
  식품: 'bg-orange-100 text-orange-700',
  생활용품: 'bg-teal-100 text-teal-700',
}
