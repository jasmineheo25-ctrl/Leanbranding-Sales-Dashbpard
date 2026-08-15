import { Resend } from "resend";

interface PurchaseOrderEmailItem {
  productName: string;
  quantity: number;
  orderId: string;
}

export async function sendPurchaseOrderEmail(
  toEmail: string,
  supplierName: string,
  items: PurchaseOrderEmailItem[],
) {
  const resend = new Resend(process.env.RESEND_API_KEY);

  const rows = items
    .map(
      (i) =>
        `<tr><td style="padding:6px 12px;border:1px solid #e4e4e7;">${i.orderId}</td><td style="padding:6px 12px;border:1px solid #e4e4e7;">${i.productName}</td><td style="padding:6px 12px;border:1px solid #e4e4e7;text-align:right;">${i.quantity}</td></tr>`,
    )
    .join("");

  const html = `
    <div style="font-family:sans-serif;">
      <p>${supplierName} 담당자님,</p>
      <p>아래 상품 발주 부탁드립니다.</p>
      <table style="border-collapse:collapse;">
        <thead>
          <tr>
            <th style="padding:6px 12px;border:1px solid #e4e4e7;">주문번호</th>
            <th style="padding:6px 12px;border:1px solid #e4e4e7;">상품명</th>
            <th style="padding:6px 12px;border:1px solid #e4e4e7;">수량</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
      <p>감사합니다.</p>
    </div>
  `;

  const { error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: toEmail,
    subject: `[발주서] ${supplierName} - ${items.length}건`,
    html,
  });

  if (error) throw new Error(`이메일 발송 실패: ${error.message}`);
}
