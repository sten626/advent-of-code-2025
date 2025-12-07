import { parseArgs } from "@std/cli/parse-args";

export type OperatorFunction = (a: number, b: number) => number;

export function add(a: number, b: number): number {
  return a + b;
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
