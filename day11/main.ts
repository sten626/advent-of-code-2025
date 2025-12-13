import { Solution } from "../solution.ts";
import { pairwise } from "../util.ts";

interface Device {
  name: string;
  outputs: string[];
}

export default class Day11Solution extends Solution {
  pathCache = new Map<string, number>();

  override solve(): void {
    const examplePath = `${this.path}/example.txt`;
    const inputPath = `${this.path}/input.txt`;

    console.log("\nRunning Part 1 with example input:");
    const exampleInput = Deno.readTextFileSync(examplePath);
    this.part1(exampleInput);
    console.log("\nRunning Part 1 with actual input:");
    const input = Deno.readTextFileSync(inputPath);
    this.part1(input);

    const example2Path = `${this.path}/example2.txt`;
    const example2Input = Deno.readTextFileSync(example2Path);
    console.log("\nRunning Part 2 with example input:");
    this.part2(example2Input);
    console.log("\nRunning Part 2 with actual input:");
    this.part2(input);
  }

  protected override part1(input: string): void {
    const devices = this.parseDevices(input);
    const start = devices.get("you");

    if (start === undefined) {
      throw new Error("Couldn't find starting device");
    }

    this.pathCache = new Map();
    const numPaths = this.search(devices, start, new Set(), "out");
    console.log(`Part 1: ${numPaths}`);
  }

  protected override part2(input: string): void {
    const devices = this.parseDevices(input);
    const paths = [
      ["svr", "fft", "dac", "out"],
      ["svr", "dac", "fft", "out"],
    ];

    const pathCounts: number[] = [];

    for (const pathGroup of paths) {
      const pathCountsForGroup: number[] = [];

      for (const [start, end] of pairwise(pathGroup)) {
        this.pathCache = new Map();
        const startDevice = devices.get(start)!;
        pathCountsForGroup.push(
          this.search(devices, startDevice, new Set(), end)
        );
      }

      pathCounts.push(pathCountsForGroup.reduce((a, b) => a * b, 1));
    }

    const numPaths = pathCounts.reduce((a, b) => a + b, 0);
    console.log(`Part 2: ${numPaths}`);
  }

  private parseDevice(line: string): Device {
    const [name, outputsString] = line.split(":");
    const outputs = outputsString.trim().split(" ");

    return { name, outputs };
  }

  private parseDevices(input: string): Map<string, Device> {
    return new Map(
      input
        .trim()
        .split("\n")
        .map((l) => this.parseDevice(l))
        .map((d) => [d.name, d])
    );
  }

  private search(
    devices: Map<string, Device>,
    current: Device,
    seen: Set<string>,
    target: string
  ): number {
    const cachedPathsCount = this.pathCache.get(current.name);
    if (cachedPathsCount !== undefined) {
      return cachedPathsCount;
    }

    seen.add(current.name);
    let paths = 0;

    for (const outputName of current.outputs) {
      if (seen.has(outputName)) {
        continue;
      }

      if (outputName === target) {
        paths += 1;
      } else if (outputName === "out") {
        // Hitting out when out isn't the target
        continue;
      } else {
        const output = devices.get(outputName)!;
        paths += this.search(devices, output, new Set(seen), target);
      }
    }

    this.pathCache.set(current.name, paths);
    return paths;
  }
}
