export function formatPrice(value) {
  if (value == null || value === "") return "";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}
