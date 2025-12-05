interface Range {
  start: number;
  end: number;
}

function parseRanges(input: string): Range[] {
  return input.split(",").map((rangeStr) => rangeStr.split("-")).map((
    [start, end],
  ) => ({
    start: Number(start),
    end: Number(end),
  }));
}

function part1IsBadId(id: string): boolean {
  const mid = id.length / 2;
  const front = id.substring(0, mid);
  const back = id.substring(mid);

  return front === back;
}

function part2IsBadId(id: string): boolean {
  for (let length = 1; length <= id.length / 2; length++) {
    if (id.length % length !== 0) {
      continue;
    }
    const pattern = id.substring(0, length);
    let allMatches = true;

    for (
      let segStart = length;
      segStart < id.length - length + 1;
      segStart += length
    ) {
      const segment = id.substring(segStart, segStart + length);

      if (segment !== pattern) {
        allMatches = false;
        break;
      }
    }

    if (allMatches) {
      return true;
    }
  }

  return false;
}

export function solve(input: string) {
  const ranges: Range[] = parseRanges(input);
  const part1BadIds = Array<number>();
  const part2BadIds = Array<number>();

  for (const { start, end } of ranges) {
    for (let i = start; i <= end; i++) {
      const strVal = i.toString();

      if (part1IsBadId(strVal)) {
        part1BadIds.push(i);
      }

      if (part2IsBadId(strVal)) {
        part2BadIds.push(i);
      }
    }
  }

  const part1Sum = part1BadIds.reduce((acc, val) => acc + val, 0);
  console.log(`Part 1: ${part1Sum}`);
  const part2Sum = part2BadIds.reduce((acc, val) => acc + val, 0);
  console.log(`Part 2: ${part2Sum}`);
}
