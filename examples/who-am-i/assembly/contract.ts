import { readStorage, readInput, writeOutput, writeStorage, getContext } from "@fluent.xyz/assembly-script-sdk/assembly"

export function main(): void {
    const context = getContext();
    const caller = context.contract.caller;
    writeOutput(caller);
}
