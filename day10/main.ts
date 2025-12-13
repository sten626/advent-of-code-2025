import { Solution } from "../solution.ts";
import { enumerate, range } from "../util.ts";
import { Matrix, SVD } from "ml-matrix";
import * as sk from "scikitjs";

interface Machine {
  lights: number;
  buttons: number[];
  joltage: number[];
}

export default class Day10Solution extends Solution {
  private lightDiagramRe = /\[([\.#]+)\]/;
  private buttonRe = /\(((\d+,*)+)\)/g;
  private joltageRe = /\{((\d+,*)+)\}/;

  protected override part1(input: string): void {
    const machines: Machine[] = input
      .trim()
      .split("\n")
      .map((l) => this.parseLine(l));

    const presses: number[] = [];

    for (const { lights: target, buttons } of machines) {
      presses.push(this.solveLight(target, buttons));
    }

    const sum = presses.reduce((a, b) => a + b, 0);
    console.log(`Part 1: ${sum}`);
  }

  protected override part2(input: string): void {
    sk.setBackend("cpu");
    const machines: Machine[] = input
      .trim()
      .split("\n")
      .map((l) => this.parseLine(l));

    for (const { buttons, joltage } of machines) {
      // System where a * x = b
      const a = this.getMatrix(buttons, joltage.length);
      const b = Matrix.columnVector(joltage);

      // Compute SVD
      const svd = new SVD(a);

      // Build pseudoinverse A^+
      const U = svd.leftSingularVectors;
      const V = svd.rightSingularVectors;

      console.log();
    }
  }

  private getMatrix(buttons: number[], rows: number): Matrix {
    const matrix = Matrix.zeros(rows, buttons.length);

    for (const [col, button] of enumerate(buttons)) {
      for (const [row, digit] of enumerate(
        button.toString(2).padStart(rows, "0")
      )) {
        matrix.set(row, col, Number(digit));
      }
    }

    return matrix;
  }

  private parseButtons(line: string, lightSize: number): number[] {
    const buttons = [
      ...line.matchAll(this.buttonRe).map((m) => m[1].split(",").map(Number)),
    ];
    const buttonsBitwise = buttons.map((b) =>
      b.map((n) => 2 ** (lightSize - n - 1)).reduce((a, b) => a + b, 0)
    );

    return buttonsBitwise;
  }

  private parseJoltage(line: string): number[] {
    const match = line.match(this.joltageRe);

    if (match === null) {
      throw new Error(`No joltage found on line: ${line}`);
    }

    return match[1].split(",").map(Number);
  }

  private parseLights(line: string): [number, number] {
    const match = line.match(this.lightDiagramRe);

    if (match === null) {
      throw new Error(`No light diagram found on line: ${line}`);
    }

    return [this.toBitInt(match[1]), match[1].length];
  }

  private parseLine(line: string): Machine {
    const [lights, lightSize] = this.parseLights(line);
    const buttons = this.parseButtons(line, lightSize);
    const joltage = this.parseJoltage(line);
    return { lights, buttons, joltage };
  }

  private solveLight(target: number, buttons: number[]): number {
    let lights = new Set<number>([0]);
    const seen = new Set<number>(lights);
    let buttonPresses = 0;

    while (lights.size > 0) {
      buttonPresses += 1;
      const nextLights = new Set<number>();

      for (const light of lights) {
        for (const button of buttons) {
          const nextLight = light ^ button;

          if (nextLight === target) {
            return buttonPresses;
          }

          if (!seen.has(nextLight)) {
            nextLights.add(nextLight);
          }
        }
      }

      lights = nextLights;
    }

    return Infinity;
  }

  private toBitInt(input: string): number {
    return parseInt(
      [...input].map((char) => (char === "#" ? "1" : "0")).join(""),
      2
    );
  }
}
