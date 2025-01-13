import { SDK } from "../src/index"

export function deploy(): void {
}

export function main(): void {
    const sdk = new SDK();
    const size = sdk.inputSize();
    sdk.writeOutputString("input_size=" + size.toString());
}
