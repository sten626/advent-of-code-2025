import { parseArgs } from "@std/cli/parse-args";

export type OperatorFunction = (a: number, b: number) => number;

export function add(a: number, b: number): number {
  return a + b;
}

export function areArraysEqual<T>(a: T[], b: T[]): boolean {
  if (a.length !== b.length) {
    return false;
  }

  return a.every((v, i) => v === b[i]);
}

export function* combinations<T>(
  iterable: Iterable<T>,
  r: number
): Generator<T[]> {
  const pool = [...iterable];
  const n = pool.length;

  if (r > n) {
    return;
  }

  const indices = range(r).toArray();
  yield indices.map((i) => pool[i]);

  while (true) {
    let noBreak = true;
    let indexToIncrement = 0;

    for (const i of range(r).toArray().reverse()) {
      if (indices[i] !== i + n - r) {
        noBreak = false;
        indexToIncrement = i;
        break;
      }
    }

    if (noBreak) {
      return;
    }

    indices[indexToIncrement] += 1;

    for (const j of range(indexToIncrement + 1, r)) {
      indices[j] = indices[j - 1] + 1;
    }

    yield indices.map((i) => pool[i]);
  }
}

export function* enumerate<T>(
  iterable: Iterable<T>,
  start = 0
): Generator<[number, T]> {
  let n = start;

  for (const elem of iterable) {
    yield [n, elem];
    n++;
  }
}

export function euclideanDistance(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error("Vectors must be of the same length");
  }

  return Math.sqrt(
    zip(a, b)
      .toArray()
      .map(([x, y]) => (x - y) ** 2)
      .reduce(add, 0)
  );
}

export function getArgs(): { day: number; useExample: boolean } {
  const args = parseArgs(Deno.args, {
    boolean: ["example"],
    alias: { e: "example" },
  });
  const day = args._[0] as number;
  const useExample = args.example;
  return { day, useExample };
}

export function multiply(a: number, b: number): number {
  return a * b;
}

export function* pairwise<T>(iterable: Iterable<T>): Generator<[T, T]> {
  const iterator = iterable[Symbol.iterator]();
  let { value: a, done } = iterator.next();

  while (!done) {
    const { value: b, done } = iterator.next();

    if (done) {
      return;
    }

    yield [a, b];
    a = b;
  }
}

export function range(stop: number): Generator<number>;
export function range(
  start: number,
  stop: number,
  step?: number
): Generator<number>;
export function* range(
  startOrStop: number,
  stop?: number,
  step?: number
): Generator<number> {
  let start = 0;

  if (stop === undefined) {
    stop = startOrStop;
  } else {
    start = startOrStop;
  }

  if (step === undefined) {
    step = 1;
  }

  for (let i = start; i < stop; i += step) {
    yield i;
  }
}

export function* zip<T>(...iterables: Iterable<T>[]): Generator<T[]> {
  const iterators = iterables.map((iterable) => iterable[Symbol.iterator]());

  while (true) {
    const values: T[] = [];

    for (const iterator of iterators) {
      const { value, done } = iterator.next();

      if (done) {
        return;
      }

      values.push(value);
    }

    yield values;
  }
}

export class DisjointSet<T> {
  private nSubsets = 0;
  private parents = new Map<T, T>();
  private sizes = new Map<T, number>();

  get numSubsets(): number {
    return this.nSubsets;
  }

  allSizes(): number[] {
    const sizes: number[] = [];

    for (const [item, parent] of this.parents) {
      if (item === parent) {
        sizes.push(this.sizes.get(item)!);
      }
    }

    return sizes.sort((a, b) => b - a);
  }

  find(item: T): T {
    const parent = this.parents.get(item);

    if (parent === undefined) {
      throw new Error("Item not found in disjoint set");
    }

    if (parent !== item) {
      const root = this.find(parent);
      this.parents.set(item, root);
      return root;
    } else {
      return item;
    }
  }

  makeSet(item: T): void {
    if (!this.parents.has(item)) {
      this.nSubsets += 1;
      this.parents.set(item, item);
      this.sizes.set(item, 1);
    }
  }

  union(a: T, b: T): void {
    const rootA = this.find(a);
    const rootB = this.find(b);

    if (rootA === rootB) {
      return;
    }

    const sizeA = this.sizes.get(rootA)!;
    const sizeB = this.sizes.get(rootB)!;

    // Make sure rootA is the larger set
    if (sizeA < sizeB) {
      [a, b] = [b, a];
    }

    this.parents.set(rootB, rootA);
    this.sizes.set(rootA, sizeA + sizeB);
    this.nSubsets -= 1;
  }
}

export interface Point2D {
  x: number;
  y: number;
}

export interface Point3D extends Point2D {
  z: number;
}
