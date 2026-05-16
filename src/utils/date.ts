export function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function createOrderNumber(date = new Date()) {
  const stamp = date.toISOString().slice(0, 10).replaceAll("-", "");
  const suffix = Math.floor(1000 + Math.random() * 9000);
  return `ORD-${stamp}-${suffix}`;
}
