import { Solution } from "./solution.ts";

async function run(dirPath: string) {
  // TODO: Error handling for argument
  const modulePath = `${dirPath}/main.ts`;
  const module = (await import(modulePath)) as {
    default: new (path: string) => Solution;
  };
  const SolutionClass = module.default;
  const solution = new SolutionClass(dirPath);
  solution.solve();
}

if (import.meta.main) {
  await run(Deno.args[0]);
}
