#!/usr/bin/env node
import { spawn } from "child_process";

const args = [
    ...process.argv.slice(2),
    "--use", `abort=~lib/@fluent.xyz/assembly-script-sdk/assembly/sdk/abort`,
    "--use", `trace=~lib/@fluent.xyz/assembly-script-sdk/assembly/sdk/trace`,
    "--use", `seed=~lib/@fluent.xyz/assembly-script-sdk/assembly/sdk/seed`,
];
const child = spawn("asc", args, {stdio: "inherit"});
child.on("exit", (code) => process.exit(code));
