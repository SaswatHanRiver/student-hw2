// WM three-digit comma rule: 1234 -> "1,234"
const NUMBER_FORMATTER = new Intl.NumberFormat("en-US");

export function formatNumber(value: number): string {
  return NUMBER_FORMATTER.format(value);
}
