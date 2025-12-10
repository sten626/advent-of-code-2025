import { Solution } from "../solution.ts";
import { combinations, enumerate, pairwise, Point2D } from "../util.ts";

interface EdgeV {
  x: number;
  yMin: number;
  yMax: number;
}

interface EdgeH {
  xMin: number;
  xMax: number;
  y: number;
}

interface Rectangle {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
}

export default class Day9Solution extends Solution {
  protected override part1(input: string): void {
    const redTiles: Point2D[] = input
      .trim()
      .split("\n")
      .map((line) => line.split(","))
      .map(([x, y]) => ({ x: Number(x), y: Number(y) }));
    let maxArea = 0;

    for (const [i, tl] of enumerate(redTiles)) {
      for (const t2 of redTiles.slice(i + 1)) {
        const area = (Math.abs(tl.x - t2.x) + 1) * (Math.abs(tl.y - t2.y) + 1);
        if (area > maxArea) {
          maxArea = area;
        }
      }
    }

    console.log(`Part 1: ${maxArea}`);
  }

  protected override part2(input: string): void {
    const redTiles: Point2D[] = input
      .trim()
      .split("\n")
      .map((line) => line.split(","))
      .map(([x, y]) => ({ x: Number(x), y: Number(y) }));
    const { edgesH, edgesV } = this.findEdges(redTiles);
    let maxArea = 0;

    for (const [{ x: x1, y: y1 }, { x: x2, y: y2 }] of combinations(
      redTiles,
      2
    )) {
      const xMin = Math.min(x1, x2);
      const xMax = Math.max(x1, x2);
      const yMin = Math.min(y1, y2);
      const yMax = Math.max(y1, y2);
      const area = (xMax - xMin + 1) * (yMax - yMin + 1);

      if (area <= maxArea) {
        continue;
      }

      if (
        this.rectangeIntersectsEdges({ xMin, xMax, yMin, yMax }, edgesH, edgesV)
      ) {
        continue;
      }

      maxArea = area;
    }

    console.log(`Part 2: ${maxArea}`);
  }

  private findEdges(redTiles: Point2D[]): { edgesH: EdgeH[]; edgesV: EdgeV[] } {
    const edgesH: EdgeH[] = [];
    const edgesV: EdgeV[] = [];
    const redTilesLoop = [...redTiles, redTiles[0]];

    for (const [{ x: x1, y: y1 }, { x: x2, y: y2 }] of pairwise(redTilesLoop)) {
      if (x1 === x2) {
        // Vertical edge
        edgesV.push({
          x: x1,
          yMin: Math.min(y1, y2),
          yMax: Math.max(y1, y2),
        });
      } else {
        // Horizontal edge
        edgesH.push({
          xMin: Math.min(x1, x2),
          xMax: Math.max(x1, x2),
          y: y1,
        });
      }
    }

    return { edgesH, edgesV };
  }

  private rectangeIntersectsEdges(
    rectangle: Rectangle,
    edgesH: EdgeH[],
    edgesV: EdgeV[]
  ): boolean {
    const { xMin, xMax, yMin, yMax } = rectangle;

    for (const { x, yMin: edgeYMin, yMax: edgeYMax } of edgesV) {
      // Check vertical edges if their x is within the rectangle's x bounds
      if (xMin < x && x < xMax) {
        // Check if the edge's y range overlaps with the rectangle's y range
        const overlapStart = Math.max(edgeYMin, yMin);
        const overlapEnd = Math.min(edgeYMax, yMax);

        if (overlapStart < overlapEnd) {
          return true;
        }
      }
    }

    for (const { xMin: edgeXMin, xMax: edgeXMax, y } of edgesH) {
      // Check horizontal edges if their y is within the rectangle's y bounds
      if (yMin < y && y < yMax) {
        // Check if the edge's x range overlaps with the rectangle's x range
        const overlapStart = Math.max(edgeXMin, xMin);
        const overlapEnd = Math.min(edgeXMax, xMax);

        if (overlapStart < overlapEnd) {
          return true;
        }
      }
    }

    return false;
  }
}
