export function generateInstanceId(): string {
  return Math.random()
    .toString(36)
    .slice(2, 2 + Math.max(1, Math.min(3, 10)));
}
