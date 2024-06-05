export function formatSui(amount: string): number {
  // Check if the input is a valid number string
  if (!/^\d+$/.test(amount)) {
    throw new Error("Invalid input: must be a number or numeric string");
  }

  // Convert to a number after dividing by 10^9
  const formattedAmount = parseFloat(amount) / Math.pow(10, 9);

  return Number(formattedAmount.toFixed(2));
}
