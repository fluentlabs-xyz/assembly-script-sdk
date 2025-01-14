import { FLUENT_HEADER_SIZE } from "./consts"
import { _exit, _inputSize, _readInput, _outputSize, _writeOutput, _exec, _keccak256, _readOutput } from "./bindings"
import { getContext } from "./context"

export * from "./context"

export function exit(code: i32): void {
    _exit(code);
}

export function inputSize(): u32 {
    return _inputSize() - FLUENT_HEADER_SIZE;
}

export function readInput(): Uint8Array {
    const size = inputSize();
    const buffer = new Uint8Array(size);
    _readInput(buffer.dataStart, FLUENT_HEADER_SIZE, size);
    return buffer;
}

export function readOutput(): Uint8Array {
    const size = _outputSize();
    const buffer = new Uint8Array(size);
    _readOutput(buffer.dataStart, 0, size);
    return buffer;
}

export function writeOutput(buffer: Uint8Array): void {
    _writeOutput(buffer.dataStart, buffer.byteLength)
}

export function exec(codeHash: Uint8Array, input: Uint8Array, gasLimit: u64, state: u32): ExecResult {
    let gasLimitPtr: usize = (new Uint64Array(1)).dataStart;
    store<u64>(gasLimitPtr, gasLimit);
    const exitCode = _exec(codeHash.dataStart, input.dataStart, input.length, gasLimitPtr, state);
    let gasUsed: u32 = load<u64>(gasLimitPtr) as u32;
    return { exitCode, gasUsed };
}

export function keccak256(data: Uint8Array): Uint8Array {
    const buffer = new Uint8Array(32);
    _keccak256(data.dataStart, data.length, buffer.dataStart);
    return buffer;
}

export function writeStorage(slot: Uint8Array, value: Uint8Array): void {
    // pub const SYSCALL_ID_STORAGE_WRITE: B256 =
    // b256!("126659e43fb4baaff19b992a1869aa0cac8ec5e30b38556fd8cf28e6fd2255b9"); // keccak256("_syscall_storage_write")
    let input = new Uint8Array(64);
    for (let i = 0; i < 32; i++) {
        input[i] = slot[i];
        input[32 + i] = value[i];
    }
    let bytesArray = new Uint8Array(32);
    bytesArray[0] = 0x12;
    bytesArray[1] = 0x66;
    bytesArray[2] = 0x59;
    bytesArray[3] = 0xe4;
    bytesArray[4] = 0x3f;
    bytesArray[5] = 0xb4;
    bytesArray[6] = 0xba;
    bytesArray[7] = 0xaf;
    bytesArray[8] = 0xf1;
    bytesArray[9] = 0x9b;
    bytesArray[10] = 0x99;
    bytesArray[11] = 0x2a;
    bytesArray[12] = 0x18;
    bytesArray[13] = 0x69;
    bytesArray[14] = 0xaa;
    bytesArray[15] = 0x0c;
    bytesArray[16] = 0xac;
    bytesArray[17] = 0x8e;
    bytesArray[18] = 0xc5;
    bytesArray[19] = 0xe3;
    bytesArray[20] = 0x0b;
    bytesArray[21] = 0x38;
    bytesArray[22] = 0x55;
    bytesArray[23] = 0x6f;
    bytesArray[24] = 0xd8;
    bytesArray[25] = 0xcf;
    bytesArray[26] = 0x28;
    bytesArray[27] = 0xe6;
    bytesArray[28] = 0xfd;
    bytesArray[29] = 0x22;
    bytesArray[30] = 0x55;
    bytesArray[31] = 0xb9;
    const execResult = exec(bytesArray, input, 22_100, 0);
    if (execResult.exitCode != 0) {
        throw new Error("execution failed during storage write: exit code is not 0");
    }
}

export function readStorage(slot: Uint8Array): Uint8Array {
    // pub const SYSCALL_ID_STORAGE_READ: B256 =
    // b256!("4023096842131de08903e3a03a648b5a91209ca2a264e0a3a90f9899431ad227"); // keccak256("_syscall_storage_read")
    let bytesArray = new Uint8Array(32);
    bytesArray[0] = 0x40;
    bytesArray[1] = 0x23;
    bytesArray[2] = 0x09;
    bytesArray[3] = 0x68;
    bytesArray[4] = 0x42;
    bytesArray[5] = 0x13;
    bytesArray[6] = 0x1d;
    bytesArray[7] = 0xe0;
    bytesArray[8] = 0x89;
    bytesArray[9] = 0x03;
    bytesArray[10] = 0xe3;
    bytesArray[11] = 0xa0;
    bytesArray[12] = 0x3a;
    bytesArray[13] = 0x64;
    bytesArray[14] = 0x8b;
    bytesArray[15] = 0x5a;
    bytesArray[16] = 0x91;
    bytesArray[17] = 0x20;
    bytesArray[18] = 0x9c;
    bytesArray[19] = 0xa2;
    bytesArray[20] = 0xa2;
    bytesArray[21] = 0x64;
    bytesArray[22] = 0xe0;
    bytesArray[23] = 0xa3;
    bytesArray[24] = 0xa9;
    bytesArray[25] = 0x0f;
    bytesArray[26] = 0x98;
    bytesArray[27] = 0x99;
    bytesArray[28] = 0x43;
    bytesArray[29] = 0x1a;
    bytesArray[30] = 0xd2;
    bytesArray[31] = 0x27;
    let execResult = exec(bytesArray, slot, 2100, 0);
    if (execResult.exitCode != 0) {
        throw new Error("execution failed during storage read: exit code is not 0");
    }
    let output = readOutput();
    return output;
}

export class ExecResult {
    exitCode!: i32;
    gasUsed!: i32;
}


function decodeNullTerminatedString(ptr: usize): string {
    let i = 0;
    while (true) {
        let unit = load<u16>(ptr + i * 2); // Load 16-bit (UTF-16) character from memory
        if (unit == 0) {
            break;
        }
        i++;
    }
    return String.UTF16.decodeUnsafe(ptr, i * 2);
}

export function abort(messagePtr: usize, fileNamePtr: usize, line: u32, column: u32): void {
    const message = decodeNullTerminatedString(messagePtr);
    const buffer = Uint8Array.wrap(String.UTF16.encode(message));
    writeOutput(buffer);
    exit(-71);
}

export function trace(messagePtr: usize, n: i32, a0?: f64, a1?: f64, a2?: f64, a3?: f64, a4?: f64): void {
    let message = decodeNullTerminatedString(messagePtr);
    const args = [a0, a1, a2, a3, a4];
    let joinedArgs = ""
    for (let i = 0; i < n; i++) {
        joinedArgs += args[i]!.toString();
        if (i != n - 1) {
            joinedArgs += " ";
        }
    }
    message += " " + joinedArgs;
    const buffer = Uint8Array.wrap(String.UTF16.encode(message));
    writeOutput(buffer);
}

export function seed(): f64 {
    const context = getContext();
    return context.block.number as f64;
}
