/**
 * Format amount directly as Indian Rupees (INR) string with en-IN locale
 * e.g., 921 -> "₹921"
 */
export const formatINR = (amount) => {
  const numericVal = Number(amount);
  if (isNaN(numericVal)) return "₹0";

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(numericVal);
};
