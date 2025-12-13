export abstract class Solution {
  protected abstract part1(input: string): void;
  protected abstract part2(input: string): void;

  constructor(protected path: string) {}

  solve(): void {
    const examplePath = `${this.path}/example.txt`;
    const inputPath = `${this.path}/input.txt`;

    console.log("\nRunning Part 1 with example input:");
    const exampleInput = Deno.readTextFileSync(examplePath);
    this.part1(exampleInput);
    console.log("\nRunning Part 1 with actual input:");
    const input = Deno.readTextFileSync(inputPath);
    this.part1(input);

    console.log("\nRunning Part 2 with example input:");
    this.part2(exampleInput);
    console.log("\nRunning Part 2 with actual input:");
    this.part2(input);
  }
}
