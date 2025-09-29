export function formatARS(n) {
  try {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(n);
  } catch {
    return `$${Number(n).toFixed(2)}`;
  }
}

export function buildCartMessage({
  items,
  subtotal,
  shipping,
  tax = 0,
  total,
}) {
  const lines = [];
  lines.push("*Pedido Palo Glow*");
  lines.push("");
  lines.push("*Productos:*");
  items.forEach((it, i) => {
    lines.push(
      `${i + 1}. ${it.name}  x${it.quantity} — ${formatARS(it.price)} c/u`
    );
  });
  lines.push("");
  lines.push(`Subtotal: ${formatARS(subtotal)}`);
  if (shipping != null)
    lines.push(`Envío: ${shipping === 0 ? "A consultar" : formatARS(shipping)}`);
  if (tax) lines.push(`Impuestos: ${formatARS(tax)}`);
  lines.push(`*Total: ${formatARS(total)}*`);
  lines.push("");
  lines.push(
    `ID: ${new Date()
      .toISOString()
      .replace(/[-:TZ.]/g, "")
      .slice(0, 14)}-${Math.random().toString(36).slice(2, 6)}`
  );
  lines.push(`URL: ${window.location.origin}`);
  return lines.join("\n");
}

export function buildWhatsAppUrl(
  text,
  phone = import.meta.env.VITE_WHATSAPP_NUMBER
) {
  const base = `https://wa.me/${phone}`;
  const q = `?text=${encodeURIComponent(text)}`;
  return base + q;
}
