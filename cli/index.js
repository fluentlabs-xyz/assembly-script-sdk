#!/usr/bin/env node
import { spawn } from "child_process";
const args = process.argv.slice(2);
const child = spawn("asc", [...args, "--use", "abort=src/index/_abort"], {stdio: "inherit"});
child.on("exit", (code) => process.exit(code));
