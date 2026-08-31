export function welcomeEmail(name) {
  return `
    <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
      <h1>Welcome to NOVA, ${name}!</h1>
      <p>Thanks for creating an account. We're glad you're here.</p>
      <p>Start browsing our latest collection whenever you're ready.</p>
    </div>
  `;
}

export function orderPlacedEmail(order) {
  const itemsHtml = order.items
    .map(
      (item) =>
        `<li>${item.name} (${item.size}) × ${item.quantity} — $${(item.price * item.quantity).toFixed(2)}</li>`,
    )
    .join("");

  return `
    <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
      <h1>Order Confirmed</h1>
      <p>Thanks, ${order.shippingAddress.fullName}! Your order has been placed.</p>
      <p><strong>Order ID:</strong> ${order._id}</p>
      <ul>${itemsHtml}</ul>
      <p><strong>Total:</strong> $${order.totalAmount.toFixed(2)}</p>
    </div>
  `;
}

export function orderStatusEmail(order) {
  return `
    <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
      <h1>Order Update</h1>
      <p>Your order <strong>${order._id}</strong> status has changed to:</p>
      <p style="font-size: 18px; text-transform: capitalize;"><strong>${order.status}</strong></p>
    </div>
  `;
}

export function lowStockEmail(alerts) {
  const rows = alerts
    .map((a) => `<li>${a.name} (size ${a.size}) — ${a.stock} left</li>`)
    .join("");

  return `
    <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
      <h1>Low Stock Alert</h1>
      <p>The following items are running low:</p>
      <ul>${rows}</ul>
    </div>
  `;
}
