import { SDK } from "../src/index"

export function deploy(): void {
}

export function main(): void {
    const sdk = new SDK();
    const slot = new Uint8Array(32); // slot 0
    slot[0] = 'a'.codePointAt(0);
    slot[11] = 'a'.codePointAt(0);
    slot[31] = 'x'.codePointAt(0);
    if (sdk.inputSize() == 0) {
        const data = sdk.readStorage(slot);
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
