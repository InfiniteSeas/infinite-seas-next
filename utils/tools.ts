export function formatSui(amount: string): number {
  // Check if the input is a valid number string
  if (!/^\d+$/.test(amount)) {
    throw new Error("Invalid input: must be a number or numeric string");
  }

  // Convert to a number after dividing by 10^9
  const formattedAmount = parseFloat(amount) / Math.pow(10, 9);

  return Number(formattedAmount.toFixed(2));
}

export function calculateTimeRemainingInSec(start: string, duration: string): number {
  let startTimestamp = Number(start);
  const durationInNumber = Number(duration);

  const currentTimestamp = Date.now();

  // Ensure startTimestamp is in milliseconds
  if (startTimestamp < 1e12) startTimestamp *= 1000;

  // Calculate the end timestamp
  const endTimestamp = startTimestamp + durationInNumber * 1000;

  // Calculate the remaining time in seconds
  const remainingTimeInMillis = endTimestamp - currentTimestamp;
  const remainingTimeInSec = Math.floor(remainingTimeInMillis / 1000);

  // Return the remaining time in seconds, or 0 if the result is negative
  return remainingTimeInSec > 0 ? remainingTimeInSec : 0;
}
