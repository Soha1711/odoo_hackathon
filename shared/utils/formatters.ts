export function formatScore(score: number): string {
  return score.toFixed(1);
}

export function formatCarbon(emissions: number): string {
  return `${emissions.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 2 })} kg CO2e`;
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(0)}%`;
}

export function formatDateString(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' });
}
