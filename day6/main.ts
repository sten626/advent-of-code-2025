import { add, multiply, OperatorFunction } from "../util.ts";

function part1(input: string): void {
  const lines = input.split("\n");
  const operatorRow = lines.splice(-1, 1)[0].trim().split(/\s+/).map((op) =>
    op.trim()
  );
  const matrix = lines.map((line) => line.trim().split(/\s+/).map(Number));
  const answers: number[] = [];

  for (let col = 0; col < matrix[0].length; col++) {
    const columnValues: number[] = [];

    for (const row of matrix) {
      columnValues.push(row[col]);
    }

    let operator: (a: number, b: number) => number = add;
    let initialValue = 0;

    if (operatorRow[col] === "+") {
      operator = add;
      initialValue = 0;
    } else if (operatorRow[col] === "*") {
      operator = multiply;
      initialValue = 1;
    } else {
      throw new Error(`Unknown operator: ${operatorRow[col]}`);
    }
    answers.push(columnValues.reduce(operator, initialValue));
  }

  const answerSum = answers.reduce(add, 0);
  console.log(`Part 1: ${answerSum}`);
}

interface Equation {
  numbers: number[];
  operator: OperatorFunction;
  initialValue: number;
}

function part2(input: string): void {
  const lines = input.split("\n");
  const equations: Equation[] = [];

  let operator: OperatorFunction | null = null;
  let initialValue = 0;
  let parsedNumbers: number[] = [];

  for (let x = lines[0].length - 1; x >= 0; x--) {
    let curNumString = "";

    for (const line of lines) {
      const cursor = line.charAt(x);

      if (cursor === "+") {
        operator = add;
        initialValue = 0;
      } else if (cursor === "*") {
        operator = multiply;
        initialValue = 1;
      } else {
        curNumString += cursor;
      }
    }

    parsedNumbers.push(Number(curNumString));
    curNumString = "";

    if (operator !== null) {
      // Done parsing this equation
      equations.push({ numbers: parsedNumbers, operator, initialValue });
      operator = null;
      parsedNumbers = [];
      // Skip blank column after each equation
      x--;
    }
  }

  const solutions = equations.map((eq) =>
    eq.numbers.reduce(eq.operator, eq.initialValue)
  );
  const sum = solutions.reduce(add, 0);
  console.log(`Part 2: ${sum}`);
}

export function solve(input: string): void {
  part1(input);
  part2(input);
}
