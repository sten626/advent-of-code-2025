interface Point {
  x: number;
  y: number;
}

function decreaseAdjacencyCount(
  adjacencyCounts: Map<number, Map<number, number>>,
  x: number,
  xLength: number,
  y: number,
  yLength: number,
) {
  for (let dy = -1; dy <= 1; dy++) {
    const newY = y + dy;

    if (newY < 0 || newY >= yLength) {
      continue;
    }

    for (let dx = -1; dx <= 1; dx++) {
      const newX = x + dx;

      if (newX < 0 || newX >= xLength) {
        continue;
      }

      if (newX === x && newY === y) {
        continue;
      }

      const yMap = adjacencyCounts.get(newX) ??
        new Map<number, number>();
      adjacencyCounts.set(newX, yMap);
      const currentCount = yMap.get(newY);

      if (currentCount !== undefined) {
        yMap.set(newY, currentCount - 1);
      }
    }
  }
}

function increaseAdjacencyCount(
  adjacencyCounts: Map<number, Map<number, number>>,
  x: number,
  xLength: number,
  y: number,
  yLength: number,
) {
  for (let dy = -1; dy <= 1; dy++) {
    const newY = y + dy;

    if (newY < 0 || newY >= yLength) {
      continue;
    }

    for (let dx = -1; dx <= 1; dx++) {
      const newX = x + dx;

      if (newX < 0 || newX >= xLength) {
        continue;
      }

      if (newX === x && newY === y) {
        continue;
      }

      const yMap = adjacencyCounts.get(newX) ??
        new Map<number, number>();
      adjacencyCounts.set(newX, yMap);
      const currentCount = yMap.get(newY) ?? 0;
      yMap.set(newY, currentCount + 1);
    }
  }
}

function part1(map: string[]) {
  const toiletPaper = new Set<Point>();
  const adjacencyCounts = new Map<number, Map<number, number>>();

  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x] !== "@") {
        continue;
      }

      toiletPaper.add({ x, y });
      increaseAdjacencyCount(adjacencyCounts, x, map[y].length, y, map.length);
    }
  }

  const accessibleToiletPaper = new Set<Point>();

  for (const toiletPaperPoint of toiletPaper) {
    const yMap = adjacencyCounts.get(toiletPaperPoint.x);
    if (yMap === undefined) {
      continue;
    }

    const count = yMap.get(toiletPaperPoint.y) ?? 0;
    if (count < 4) {
      accessibleToiletPaper.add(toiletPaperPoint);
    }
  }

  console.log(`Part 1: ${accessibleToiletPaper.size}`);
}

function part2(map: string[]) {
  let toiletPaper = new Set<Point>();
  const adjacencyCounts = new Map<number, Map<number, number>>();

  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x] !== "@") {
        continue;
      }

      const point: Point = { x, y };
      toiletPaper.add(point);
      increaseAdjacencyCount(adjacencyCounts, x, map[y].length, y, map.length);
    }
  }

  const accessibleToiletPaper = new Set<Point>();

  while (toiletPaper.size > 0) {
    let removedSome = false;

    for (const toiletPaperPoint of toiletPaper) {
      const yMap = adjacencyCounts.get(toiletPaperPoint.x);
      if (yMap === undefined) {
        continue;
      }

      const count = yMap.get(toiletPaperPoint.y) ?? 0;
      if (count < 4) {
        accessibleToiletPaper.add(toiletPaperPoint);
        decreaseAdjacencyCount(
          adjacencyCounts,
          toiletPaperPoint.x,
          map[0].length,
          toiletPaperPoint.y,
          map.length,
        );
        removedSome = true;
      }
    }

    if (removedSome) {
      toiletPaper = toiletPaper.difference(accessibleToiletPaper);
    } else {
      break;
    }
  }

  console.log(`Part 2: ${accessibleToiletPaper.size}`);
}

export function solve(input: string) {
  const map = input.split("\n");
  part1(map);
  part2(map);
}
