import { readStorage, readInput, writeOutput, writeStorage } from "@fluent.xyz/assembly-script-sdk/assembly"

export function main(): void {
    const slot = new Uint8Array(32); // slot 0
    const input = readInput();
    if (input.byteLength == 0) {
        const data = readStorage(slot).subarray(0, 32);
        writeOutput(data);
    } else {
        const data = new Uint8Array(32);
        for (let i = 0; i < input.byteLength; i++) {
            data[i] = input[i];
        }
        writeStorage(slot, data);
    }
}
