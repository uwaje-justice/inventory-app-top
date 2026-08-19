export function formatPrice(value) {
  if (value == null || value === "") return "";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}

export function formatNumber(value) {
  if (value == null) return "0";
  return new Intl.NumberFormat("en-US").format(value);
}
