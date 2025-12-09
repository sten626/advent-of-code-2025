import { enumerate } from "../util.ts";

const splitterRe = /\^/g;

function part1(lines: string[]): void {
  const splitters = new Map<number, Set<number>>();
  let beams = new Set<number>();

  // Parse input for starting beams and splitters
  for (const [y, line] of enumerate(lines)) {
    const startIndex = line.indexOf("S");
    if (startIndex !== -1) {
      beams.add(startIndex);
    }

    let splittersInRow = splitters.get(y);
    if (splittersInRow === undefined) {
      splittersInRow = new Set<number>();
      splitters.set(y, splittersInRow);
    }

    const splitterMatches = line.matchAll(splitterRe);
    for (const match of splitterMatches) {
      splittersInRow.add(match.index);
    }
  }

  // Move beams downwards, splitting as necessary
  let nextY = 1;
  let numSplits = 0;

  while (nextY < lines.length) {
    const newBeams = new Set<number>();
    const splittersInRow = splitters.get(nextY) ?? new Set<number>();

    for (const beamX of beams) {
      if (splittersInRow.has(beamX)) {
        newBeams.add(beamX - 1);
        newBeams.add(beamX + 1);
        numSplits++;
      } else {
        newBeams.add(beamX);
      }
    }

    beams = newBeams;
    nextY++;
  }

  console.log(`Part 1: ${numSplits}`);
}

function part2(lines: string[]): void {
  const splitters = new Map<number, Set<number>>();
  let beams = new Map<number, number>(); // position -> timelines

  // Parse input for starting beams and splitters
  for (const [y, line] of enumerate(lines)) {
    const startIndex = line.indexOf("S");
    if (startIndex !== -1) {
      beams.set(startIndex, 1);
    }

    let splittersInRow = splitters.get(y);
    if (splittersInRow === undefined) {
      splittersInRow = new Set<number>();
      splitters.set(y, splittersInRow);
    }

    const splitterMatches = line.matchAll(splitterRe);
    for (const match of splitterMatches) {
      splittersInRow.add(match.index);
    }
  }

  // Move beams downwards, splitting as necessary
  let nextY = 1;

  while (nextY < lines.length) {
    const newBeams = new Map<number, number>();
    const splittersInRow = splitters.get(nextY) ?? new Set<number>();

    for (const [beamX, timelines] of beams) {
      const nextBeamXs: number[] = [];

      if (splittersInRow.has(beamX)) {
        nextBeamXs.push(beamX - 1, beamX + 1);
      } else {
        nextBeamXs.push(beamX);
      }

      for (const nextBeamX of nextBeamXs) {
        const existingTimelines = newBeams.get(nextBeamX) ?? 0;
        newBeams.set(nextBeamX, existingTimelines + timelines);
      }
    }

    beams = newBeams;
    nextY++;
  }

  const timelines = beams.values().toArray().reduce((a, b) => a + b, 0);
  console.log(`Part 2: ${timelines}`);
}

export function solve(input: string): void {
  const lines = input.split("\n");
  part1(lines);
  part2(lines);
}
