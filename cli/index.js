#!/usr/bin/env node
import { spawn } from "child_process";
import path from "path";

// Calculate the relative path to the required helper functions (abort, trace, seed)
// These functions are essential for AssemblyScript compilation.
// We dynamically resolve the paths relative to the project root to ensure portability.
const projectRoot = path.relative(
    process.cwd(),
    path.resolve(import.meta.dirname, "..")
);
const srcDirPath = path.join(projectRoot, "src");
const args = [
    ...process.argv.slice(2),
    "--use", `abort=${srcDirPath}/index/abort`,
    "--use", `trace=${srcDirPath}/index/trace`,
    "--use", `seed=${srcDirPath}/index/seed`,
];
const child = spawn("asc", args, {stdio: "inherit"});
child.on("exit", (code) => process.exit(code));
