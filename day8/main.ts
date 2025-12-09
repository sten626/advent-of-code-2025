import { DisjointSet, enumerate, euclideanDistance, range } from "../util.ts";

interface Point {
  x: number;
  y: number;
  z: number;
}

interface Edge {
  a: Point;
  b: Point;
  distance: number;
}

function part1(points: Point[], numConnections: number): void {
  // Calculate all edges and add all points to disjoint set
  const disjointSet = new DisjointSet<Point>();
  const edges: Edge[] = [];

  for (const [i, p1] of enumerate(points)) {
    disjointSet.makeSet(p1);

    for (const p2 of points.slice(i + 1)) {
      const distance = euclideanDistance(
        [p1.x, p1.y, p1.z],
        [p2.x, p2.y, p2.z]
      );
      edges.push({ a: p1, b: p2, distance });
    }
  }

  // Sort edges by distance
  edges.sort((e1, e2) => e1.distance - e2.distance);

  // Kruskal's algorithm over edges
  for (const _ of range(numConnections)) {
    const edge = edges.shift();
    if (!edge) break;
    const { a, b } = edge;
    const rootA = disjointSet.find(a);
    const rootB = disjointSet.find(b);

    if (rootA !== rootB) {
      disjointSet.union(a, b);
    }
  }

  const sizes = disjointSet.allSizes();
  const top3Product = sizes.slice(0, 3).reduce((a, b) => a * b, 1);

  console.log(`Part 1: ${top3Product}`); // 46398
}

function part2(points: Point[]): void {
  // Calculate all edges and add all points to disjoint set
  const disjointSet = new DisjointSet<Point>();
  const edges: Edge[] = [];

  for (const [i, p1] of enumerate(points)) {
    disjointSet.makeSet(p1);

    for (const p2 of points.slice(i + 1)) {
      const distance = euclideanDistance(
        [p1.x, p1.y, p1.z],
        [p2.x, p2.y, p2.z]
      );
      edges.push({ a: p1, b: p2, distance });
    }
  }

  // Sort edges by distance
  edges.sort((e1, e2) => e1.distance - e2.distance);
  let lastA: Point | null = null;
  let lastB: Point | null = null;

  // Kruskal's algorithm over edges
  for (const { a, b } of edges) {
    const rootA = disjointSet.find(a);
    const rootB = disjointSet.find(b);

    if (rootA !== rootB) {
      disjointSet.union(a, b);
    }

    if (disjointSet.numSubsets === 1) {
      lastA = a;
      lastB = b;
      break;
    }
  }

  if (lastA === null || lastB === null) {
    throw new Error("No points?");
  }

  const product = lastA.x * lastB.x;
  console.log(`Part 2: ${product}`);
}

export function solve(input: string): void {
  const points: Point[] = input
    .trim()
    .split("\n")
    .map((line) => line.split(",").map(Number))
    .map(([x, y, z]) => ({ x, y, z }));

  part1(points, 1000);
  part2(points);
}
