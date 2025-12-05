import { getArgs } from "./util.ts";

async function run(day: number, useExample: boolean) {
  const modulePath = `./day${day}/main.ts`;
  const inputBasename = useExample ? "example.txt" : "input.txt";
  const inputPath = `./day${day}/${inputBasename}`;
  const input = await Deno.readTextFile(inputPath);
  const solution = await import(modulePath) as {
    solve: (input: string) => void;
  };
  solution.solve(input.trim());
}

if (import.meta.main) {
  const { day, useExample } = getArgs();
  await run(day, useExample);
}
