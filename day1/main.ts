const turnRegex = /([LR])(\d+)/;

function part1(input: string): void {
  const lines = input.split("\n");
  let position = 50;
  let zerosPart1 = 0;
  let zerosPart2 = 0;
  let passes = 0;

  for (const line of lines) {
    const match = turnRegex.exec(line);
    if (match) {
      const turnDirection = match[1];
      const distance = parseInt(match[2]);

      [position, passes] = turn(position, turnDirection, distance);
      // console.log(`The dial is rotated ${line} to point at ${position}.`);

      if (position === 0) {
        zerosPart1 += 1;
      }

      zerosPart2 += passes;
    }
  }

  console.log(`Part 1: ${zerosPart1}`);
}

function part2(input: string): void {
  const lines = input.split("\n");
  let position = 50;
  let zerosPart1 = 0;
  let zerosPart2 = 0;
  let passes = 0;

  for (const line of lines) {
    const match = turnRegex.exec(line);
    if (match) {
      const turnDirection = match[1];
      const distance = parseInt(match[2]);

      [position, passes] = turn(position, turnDirection, distance);
      // console.log(`The dial is rotated ${line} to point at ${position}.`);

      if (position === 0) {
        zerosPart1 += 1;
      }

      zerosPart2 += passes;
    }
  }

  console.log(`Part 2: ${zerosPart2}`);
}

export function turn(
  position: number,
  direction: string,
  amount: number,
): [number, number] {
  let result = position;
  let passes = Math.floor(amount / 100);
  amount -= passes * 100;

  if (amount === 0) {
    return [result, passes];
  }

  if (direction === "L") {
    result -= amount;
    if (position === 0) {
      passes -= 1;
    }
    if (result < 0) {
      result += 100;
      passes += 1;
    } else if (result === 0) {
      passes += 1;
    }
  } else if (direction === "R") {
    result += amount;
    if (result >= 100) {
      result -= 100;
      passes += 1;
    } else if (result === 0) {
      passes += 1;
    }
  } else {
    throw new Error(`Unknown direction: ${direction}`);
  }

  return [result, passes];
}

export function solve(input: string) {
  part1(input);
  part2(input);
}

// if (import.meta.main) {
//   const args = parseArgs(Deno.args, {
//     boolean: ["example"],
//     alias: { e: "example" },
//   });
//   const inputBasename = args.example ? "example.txt" : "input.txt";
//   const dirname = import.meta.dirname || "";
//   const inputFilename = path.join(dirname, inputBasename);
//   main(inputFilename);
// }
