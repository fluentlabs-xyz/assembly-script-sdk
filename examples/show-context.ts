import { getContext, writeOutput, readInput } from "../src/index"

export function main(): void {
    const context = getContext();
    let message = "caller=" + toHexString(context.contract.caller);
    message += " block=" + context.block.number.toString();
    message += " gasLimit=" + context.tx.gasLimit.toString();
    message += " input=" + toHexString(readInput());
    const messageBuf = Uint8Array.wrap(String.UTF8.encode(message));
    writeOutput(messageBuf);
}

function toHexString(bytes: Uint8Array): string {
    const hexChars = "0123456789abcdef";
    const result = new Array<string>(bytes.length * 2);
    for (let i = 0; i < bytes.length; i++) {
        const byte = bytes[i];
        result[i * 2] = hexChars.charAt((byte >> 4) & 0xf);
        result[i * 2 + 1] = hexChars.charAt(byte & 0xf);
    }
    return result.join("");
}
