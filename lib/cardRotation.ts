/** A stable slight rotation for a card, from a hash of its id: between -1.2 and 1.2 degrees. */
export function cardRotation(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  const unit = (hash % 1000) / 999; // 0..1
  return Math.round((unit * 2.4 - 1.2) * 100) / 100;
}
