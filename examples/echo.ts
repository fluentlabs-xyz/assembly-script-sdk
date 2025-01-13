import { SDK } from "../src/index"

export function deploy(): void {
}

export function main(): void {
    const sdk = new SDK();
    const inputBuf = sdk.readInput();
    const str = String.UTF8.decode(inputBuf.buffer);
    sdk.writeOutputString("INPUT: \"" + str + "\"");
}
