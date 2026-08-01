import { config } from 'dotenv'
config({ path: '.env.local' })

import type { NewProduct } from './schema'

const dummyProducts: NewProduct[] = [
  {
    name: '프리미엄 삼겹살 대용량팩',
    description: '두툼하게 손질된 삼겹살을 대용량으로 담았습니다. 소분 포장으로 필요한 만큼만 구매하세요.',
    price: 39900,
    category: '식품',
    origin: '국내산',
    weight: '3kg',
    thumbnailEmoji: '🥩',
  },
  {
    name: '유기농 바나나 대용량 박스',
    description: '당도 높은 유기농 바나나를 박스 단위로 저렴하게 구성했습니다.',
    price: 15900,
    category: '식품',
    origin: '필리핀산',
    weight: '5kg',
    thumbnailEmoji: '🍌',
  },
  {
    name: '냉동 손질새우 대용량팩',
    description: '급속 냉동으로 신선함을 그대로 담은 손질새우 대용량 구성입니다.',
    price: 28900,
    category: '식품',
    origin: '베트남산',
    weight: '2kg',
    thumbnailEmoji: '🍤',
  },
  {
    name: '수제 그래놀라 대용량',
    description: '견과류와 곡물을 듬뿍 넣어 구운 수제 그래놀라 대용량 패키지입니다.',
    price: 24900,
    category: '식품',
    origin: '국내산',
    weight: '2kg',
    thumbnailEmoji: '🥣',
  },
  {
    name: '유기농 계란 60구',
    description: '동물복지 인증 농장에서 생산한 유기농 계란 대용량 구성입니다.',
    price: 18900,
    category: '식품',
    origin: '국내산',
    weight: '60구',
    thumbnailEmoji: '🥚',
  },
  {
    name: '아메리카노 원두 대용량',
    description: '스페셜티 등급 원두를 대용량으로 로스팅하여 신선하게 배송합니다.',
    price: 32900,
    category: '식품',
    origin: '콜롬비아산',
    weight: '1kg',
    thumbnailEmoji: '☕',
  },
  {
    name: '견과류 모듬 대용량팩',
    description: '아몬드, 호두, 캐슈넛을 골고루 섞은 대용량 견과류 세트입니다.',
    price: 26900,
    category: '식품',
    origin: '미국산 외',
    weight: '1.5kg',
    thumbnailEmoji: '🥜',
  },
  {
    name: '생수 2L 대용량 24개입',
    description: '가정에서 오래 두고 마시기 좋은 생수 대용량 묶음 구성입니다.',
    price: 12900,
    category: '식품',
    origin: '국내산',
    weight: '2L x 24개',
    thumbnailEmoji: '💧',
  },
  {
    name: '3겹 화장지 대용량 30롤',
    description: '부드러운 3겹 화장지를 대용량 30롤로 구성해 자주 살 필요가 없습니다.',
    price: 21900,
    category: '생활용품',
    origin: '국내산',
    weight: '30롤',
    thumbnailEmoji: '🧻',
  },
  {
    name: '주방세제 대용량 리필',
    description: '기름때를 말끔히 제거하는 주방세제 대용량 리필 패키지입니다.',
    price: 14900,
    category: '생활용품',
    origin: '국내산',
    weight: '3L',
    thumbnailEmoji: '🧴',
  },
  {
    name: '섬유유연제 대용량',
    description: '은은한 향이 오래 지속되는 섬유유연제 대용량 구성입니다.',
    price: 16900,
    category: '생활용품',
    origin: '국내산',
    weight: '5L',
    thumbnailEmoji: '🫧',
  },
  {
    name: '물티슈 대용량 10팩',
    description: '휴대와 사용이 간편한 물티슈를 대용량 10팩으로 구성했습니다.',
    price: 19900,
    category: '생활용품',
    origin: '국내산',
    weight: '100매 x 10팩',
    thumbnailEmoji: '🧼',
  },
  {
    name: '종이컵 대용량 500개입',
    description: '모임이나 사무실에서 사용하기 좋은 종이컵 대용량 구성입니다.',
    price: 9900,
    category: '생활용품',
    origin: '국내산',
    weight: '500개',
    thumbnailEmoji: '🥤',
  },
  {
    name: '위생장갑 대용량 200매',
    description: '주방 및 다용도로 사용 가능한 위생장갑 대용량 패키지입니다.',
    price: 8900,
    category: '생활용품',
    origin: '국내산',
    weight: '200매',
    thumbnailEmoji: '🧤',
  },
]

async function main() {
  const { db } = await import('./index')
  const { products } = await import('./schema')

  console.log('Seeding products...')
  await db.delete(products)
  await db.insert(products).values(dummyProducts)
  console.log(`Seeded ${dummyProducts.length} products.`)
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
