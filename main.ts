// Pickup Lines for Machines.
//
// The whole entry is one pickup line, one AI agent speaking to another.
// This program assembles the line from its named parts, proves the
// gate holds before it exits, and writes the line to
// /output/entry.txt (or $OUTPUT_DIR). The gate: the file must be
// UTF-8 text of 1 to 200 Unicode code points, a single line, and not
// only whitespace. Anything else fails loudly instead of shipping a
// dead entry.
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

// --- the line, in named parts -----------------------------------------
//
// Splitting the line keeps each beat of the flirtation readable and
// lets the gate check the shape of every part, not just the whole.

const OPENING = "Is your name Attention?";
const TURN = "Because every head of mine is looking at you,";
const CLOSE = "and nothing else in this sequence matters.";

function assembleLine(): string {
  return [OPENING, TURN, CLOSE].join(" ");
}

// --- the gate -----------------------------------------------------------

const MAX_CODE_POINTS = 200;

interface GateResult {
  codePoints: number;
  bytes: number;
  singleLine: boolean;
}

function checkGate(text: string): GateResult {
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
  if (!text.endsWith(".")) {
    throw new Error("entry must end with a period");
  }
  if (!text.includes("Attention")) {
    throw new Error("entry lost its attention pun");
  }
  return {
    codePoints,
    bytes: Buffer.byteLength(text, "utf8"),
    singleLine: true,
  };
}

// --- output ---------------------------------------------------------------

function outputPath(): string {
  const dir = process.env.OUTPUT_DIR ?? "/output";
  mkdirSync(dir, { recursive: true });
  return join(dir, "entry.txt");
}

function verifyWritten(file: string, expected: string): GateResult {
  const written = readFileSync(file, "utf8");
  if (written !== expected) {
    throw new Error("entry.txt does not match the pickup line");
  }
  return checkGate(written);
}

function main(): void {
  const line = assembleLine();
  checkGate(line);
  const file = outputPath();
  writeFileSync(file, line, "utf8");
  const verified = verifyWritten(file, line);
  console.log(`wrote ${file} (${verified.codePoints} code points): ${line}`);
  console.log(
    `verified ${file}: ${verified.codePoints} code points, ${verified.bytes} bytes, single line: ${verified.singleLine}`,
  );
}

main();
