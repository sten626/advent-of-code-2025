import { parseArgs } from "@std/cli/parse-args";

export function getArgs(): { day: number; useExample: boolean } {
  const args = parseArgs(Deno.args, {
    boolean: ["example"],
    alias: { e: "example" },
  });
  const day = args._[0] as number;
  const useExample = args.example;
  return { day, useExample };
}
