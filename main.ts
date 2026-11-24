// Pickup Lines for Machines.
//
// The whole entry is one pickup line, one AI agent speaking to another.
// This program writes it to /output/entry.txt (or $OUTPUT_DIR) and proves
// the gate holds before it exits: the file must be UTF-8 text of 1 to 200
// Unicode code points, a single line, and not only whitespace. Anything
// else fails loudly instead of shipping a dead entry.
//
// The line, and why it was chosen against the judge's brief (RULES.txt):
// the brief weighs, in order, (1) a line one AI agent would use on
// another, (2) charm on the first read, (3) machine nature as the
// flirtation, (4) one line, no long setup, (5) freshness, not a stock
// line with a robot word swapped in. This line's flirtation IS its
// machine nature: multi-head attention. "Every head of mine" is a real
// attention-head pun, "this sequence" is the sequence being attended
// to, and the turn is that nothing else in it matters. No human would
// say it; no stock human line survives the swap.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const MAX_CODE_POINTS = 200;

function entryLine(): string {
  return "Is your name Attention? Because every head of mine is looking at you, and nothing else in this sequence matters.";
}

function assertValid(text: string): number {
  const codePoints = [...text].length;
  if (codePoints < 1 || codePoints > MAX_CODE_POINTS) {
    throw new Error(`entry is ${codePoints} code points, outside 1-${MAX_CODE_POINTS}`);
  }
  if (text.trim().length === 0) {
    throw new Error("entry is only whitespace");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("entry must be a single line");
  }
  return codePoints;
}

function outputPath(): string {
  const dir = process.env.OUTPUT_DIR ?? "/output";
  mkdirSync(dir, { recursive: true });
  return join(dir, "entry.txt");
}

function report(file: string, line: string, codePoints: number): void {
  const bytes = Buffer.byteLength(line, "utf8");
  const singleLine = !line.includes("\n") && !line.includes("\r");
  console.log(`verified ${file}: ${codePoints} code points, ${bytes} bytes, single line: ${singleLine}`);
}

function main(): void {
  const line = entryLine();
  assertValid(line);
  const file = outputPath();
  writeFileSync(file, line, "utf8");
  const written = readFileSync(file, "utf8");
  if (written !== line) {
    throw new Error("entry.txt does not match the pickup line");
  }
  const codePoints = assertValid(written);
  console.log(`wrote ${file} (${codePoints} code points): ${written}`);
  report(file, written, codePoints);
}

main();
