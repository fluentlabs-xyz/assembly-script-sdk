import { SDK } from "../src/index"

export function deploy(): void {
}

export function main(): void {
    const sdk = new SDK();
    const slot = new Uint8Array(32); // slot 0
    if (sdk.inputSize() == 0) {
        const data = sdk.readStorage(slot).subarray(0, 32);
        sdk.writeOutput(data);
    } else {
        const input = sdk.readInput();
        const data = new Uint8Array(32);
        for (let i = 0; i < input.byteLength; i++) {
            data[i] = input[i];
        }
        sdk.writeStorage(slot, data);
    }
}
