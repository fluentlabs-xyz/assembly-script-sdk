#!/usr/bin/env node
import { spawn } from "child_process";
const args = [
    ...process.argv.slice(2),
    "--use", "abort=src/index/abort",
    "--use", "trace=src/index/trace",
    "--use", "seed=src/index/seed",
];
const child = spawn("asc", args, {stdio: "inherit"});
child.on("exit", (code) => process.exit(code));
