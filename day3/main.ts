const joltageCache = new Map<string, number>();

function maxJoltage(bank: string): number {
  if (bank.length <= 2) {
    return Number.parseInt(bank);
  }

  const cacheHit = joltageCache.get(bank);
  if (cacheHit !== undefined) {
    return cacheHit;
  }

  const first = bank.charAt(0);
  let current = Number.parseInt(bank.substring(0, 2));

  for (const nextChar of bank.substring(2)) {
    const candidate = Number.parseInt(first + nextChar);

    if (candidate > current) {
      current = candidate;
    }
  }

  const candidate = maxJoltage(bank.substring(1));
  if (candidate > current) {
    current = candidate;
  }

  joltageCache.set(bank, current);
  return current;
}

function part1(banks: string[]) {
  const joltages = banks.map((bank) => maxJoltage(bank));
  const sum = joltages.reduce((a, b) => a + b, 0);
  console.log(`Part 1: ${sum}`);
}

const joltageLengthCache = new Map<string, Map<number, number>>();

function maxJoltageOfLength(bank: string, length: number): number {
  if (length === 1) {
    return Math.max(...bank.split("").map(Number));
  }

  let lengthCache = joltageLengthCache.get(bank);

  if (lengthCache === undefined) {
    lengthCache = new Map<number, number>();
    joltageLengthCache.set(bank, lengthCache);
  }

  const cacheHit = lengthCache.get(length);
  if (cacheHit !== undefined) {
    return cacheHit;
  }

  const nDigitsToCheck = bank.length - length + 1;
  let currentMax = 0;

  for (let i = 0; i < nDigitsToCheck; i++) {
    const firstDigit = bank.charAt(i);

    if (firstDigit < currentMax.toString().charAt(0)) {
      continue;
    }

    const candidate = Number(
      firstDigit + maxJoltageOfLength(bank.substring(i + 1), length - 1),
    );

    if (candidate > currentMax) {
      currentMax = candidate;
    }
  }

  lengthCache.set(length, currentMax);

  return currentMax;
}

function part2(banks: string[]) {
  const joltage = banks.map((bank) => maxJoltageOfLength(bank, 12));
  const sum = joltage.reduce((a, b) => a + b, 0);
  console.log(`Part 2: ${sum}`);
}

export function solve(input: string) {
  const banks = input.trim().split("\n");
  part1(banks);
  part2(banks);
}
