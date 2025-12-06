interface Range {
  min: number;
  max: number;
}

function part1(goodIdRanges: Range[], availableIds: number[]): void {
  const freshIds = new Set<number>();

  let rangeIndex = 0;

  for (const id of availableIds) {
    while (
      rangeIndex < goodIdRanges.length &&
      id > goodIdRanges[rangeIndex].max
    ) {
      rangeIndex++;
    }

    if (rangeIndex >= goodIdRanges.length) {
      break;
    }

    const currentRange = goodIdRanges[rangeIndex];

    if (id >= currentRange.min && id <= currentRange.max) {
      freshIds.add(id);
    }
  }

  console.log(`Part 1: ${freshIds.size}`);
}

function part2(goodIdRanges: Range[]): void {
  // Merge overlapping ranges first
  const goodIdCount = goodIdRanges.map((r) => r.max - r.min + 1).reduce(
    (a, b) => a + b,
    0,
  );
  // TODO: Not done yet
  console.log(`Part 2: ${goodIdCount}`);
}

export function solve(input: string): void {
  const [goodIdRangeLines, availableIdLines] = input.split("\n\n").map((part) =>
    part.split("\n")
  );
  const goodIdRanges: Range[] = goodIdRangeLines.map((line) => line.split("-"))
    .map(([min, max]) => ({
      min: Number(min),
      max: Number(max),
    })).sort((a, b) => a.min - b.min);
  const availableIds: number[] = availableIdLines.map((line) => Number(line))
    .sort((a, b) => a - b);

  part1(goodIdRanges, availableIds);
  part2(goodIdRanges);
}
