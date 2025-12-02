import { assertEquals } from "@std/assert";
import { turn } from "./main.ts";

Deno.test("starts on 0, moves left 10 to 90", () => {
  const [newPosition, passes] = turn(0, "L", 10);
  assertEquals(newPosition, 90);
  assertEquals(passes, 0);
});

Deno.test("starts on 0, moves right 10 to 10", () => {
  const [newPosition, passes] = turn(0, "R", 10);
  assertEquals(newPosition, 10);
  assertEquals(passes, 0);
});

Deno.test("starts on 0, moves left 100 to 0", () => {
  const [newPosition, passes] = turn(0, "L", 100);
  assertEquals(newPosition, 0);
  assertEquals(passes, 1);
});

Deno.test("starts on 0, moves right 100 to 0", () => {
  const [newPosition, passes] = turn(0, "R", 100);
  assertEquals(newPosition, 0);
  assertEquals(passes, 1);
});

Deno.test("starts on 52, moves right 48 to 0", () => {
  const [newPosition, passes] = turn(52, "R", 48);
  assertEquals(newPosition, 0);
  assertEquals(passes, 1);
});
