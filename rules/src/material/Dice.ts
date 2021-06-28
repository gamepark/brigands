export function rollDice(length: number): number[] {
  return Array.from({length}, () => 2 + Math.floor(Math.random() * 3))
}
