import { pgTable, serial, text, varchar, integer, timestamp } from 'drizzle-orm/pg-core'

export const productCategoryValues = ['식품', '생활용품'] as const
export type ProductCategory = (typeof productCategoryValues)[number]

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  price: integer('price').notNull(),
  category: varchar('category', { length: 32 }).notNull(),
  origin: text('origin'),
  weight: varchar('weight', { length: 64 }),
  thumbnailEmoji: varchar('thumbnail_emoji', { length: 8 }).notNull().default('📦'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export type Product = typeof products.$inferSelect
export type NewProduct = typeof products.$inferInsert
