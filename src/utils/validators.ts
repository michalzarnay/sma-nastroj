// Validate that percentage fields sum to 100
export function validatePercentageSum(values: number[], tolerance: number = 0.5): boolean {
  const sum = values.reduce((a, b) => a + b, 0);
  return sum === 0 || Math.abs(sum - 100) <= tolerance;
}

// Validate year input
export function validateYear(year: number): boolean {
  return year === 0 || (year >= 1900 && year <= new Date().getFullYear() + 1);
}

// Validate non-negative number
export function validateNonNegative(value: number): boolean {
  return value >= 0;
}

// Validate percentage (0-100)
export function validatePercentage(value: number): boolean {
  return value >= 0 && value <= 100;
}

// Validate area (reasonable building area)
export function validateArea(value: number, maxReasonable: number = 100000): boolean {
  return value >= 0 && value <= maxReasonable;
}
