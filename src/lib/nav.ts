export interface NavItem {
  href: string;
  label: string;
  description: string;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/sales", label: "매출확인", description: "몰별 주문/매출 현황" },
  {
    href: "/purchase-orders",
    label: "업체발주서전달",
    description: "매출 기반 업체 발주서 전달 현황",
  },
  { href: "/settlement", label: "정산", description: "몰별 정산 현황" },
  {
    href: "/bank-transfer",
    label: "무통장입금 확인",
    description: "무통장입금 고객 리스트",
  },
  { href: "/returns", label: "반품 확인", description: "반품 고객 리스트" },
];
