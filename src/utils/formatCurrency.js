// Currency conversion rate: 1 USD = 83 INR
export const USD_TO_INR_RATE = 83;

/**
 * Format USD amount to Indian Rupees (INR) string formatted with en-IN locale
 * e.g., 109.95 -> "₹9,126"
 */
export const formatINR = (usdAmount) => {
  const numericVal = Number(usdAmount);
  if (isNaN(numericVal)) return "₹0";
  
  const inrAmount = Math.round(numericVal * USD_TO_INR_RATE);

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(inrAmount);
};
