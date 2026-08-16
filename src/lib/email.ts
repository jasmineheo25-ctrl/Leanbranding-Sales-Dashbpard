import { Resend } from "resend";

interface PurchaseOrderEmailItem {
  productName: string;
  optionValue: string;
  quantity: number;
  orderId: string;
  receiverName: string;
  receiverPhone: string;
  receiverAddress: string;
  shippingMessage: string;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const cell = "padding:6px 12px;border:1px solid #e4e4e7;";

export async function sendPurchaseOrderEmail(
  toEmail: string,
  supplierName: string,
  items: PurchaseOrderEmailItem[],
) {
  const resend = new Resend(process.env.RESEND_API_KEY);

  const rows = items
    .map(
      (i) => `<tr>
        <td style="${cell}">${escapeHtml(i.orderId)}</td>
        <td style="${cell}">${escapeHtml(i.productName)}${i.optionValue ? `<br><span style="color:#71717a;font-size:12px;">${escapeHtml(i.optionValue)}</span>` : ""}</td>
        <td style="${cell}text-align:right;">${i.quantity}</td>
        <td style="${cell}">${escapeHtml(i.receiverName)}</td>
        <td style="${cell}">${escapeHtml(i.receiverPhone)}</td>
        <td style="${cell}">${escapeHtml(i.receiverAddress)}${i.shippingMessage ? `<br><span style="color:#71717a;font-size:12px;">메모: ${escapeHtml(i.shippingMessage)}</span>` : ""}</td>
      </tr>`,
    )
    .join("");

  const html = `
    <div style="font-family:sans-serif;">
      <p>${escapeHtml(supplierName)} 담당자님,</p>
      <p>아래 상품 발주 및 배송 부탁드립니다.</p>
      <table style="border-collapse:collapse;font-size:14px;">
        <thead>
          <tr>
            <th style="${cell}">주문번호</th>
            <th style="${cell}">상품명 / 옵션</th>
            <th style="${cell}">수량</th>
            <th style="${cell}">수령자</th>
            <th style="${cell}">연락처</th>
            <th style="${cell}">배송지</th>
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
