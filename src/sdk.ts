import { FLUENT_HEADER_SIZE, SYSCALL_ID_STORAGE_READ, SYSCALL_ID_STORAGE_WRITE } from "./consts"
import { _exit, _inputSize, _readInput, _outputSize, _writeOutput, _exec, _keccak256, _readOutput } from "./bindings"
import { getContext } from "./context"


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
    let input = new Uint8Array(64);
    for (let i = 0; i < 32; i++) {
        input[i] = slot[i];
        input[32 + i] = value[i];
    }
    const hash = Uint8Array.wrap(changetype<ArrayBuffer>(SYSCALL_ID_STORAGE_WRITE));
    const execResult = exec(hash, input, 22_100, 0);
    if (execResult.exitCode != 0) {
        throw new Error("execution failed during storage write: exit code is not 0");
    }
}

export function readStorage(slot: Uint8Array): Uint8Array {
    const hash = Uint8Array.wrap(changetype<ArrayBuffer>(SYSCALL_ID_STORAGE_READ));
    let execResult = exec(hash, slot, 2100, 0);
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
    const message = changetype<String>(messagePtr);
    const fileName = changetype<String>(fileNamePtr);
    const errorReport = `Abort called: ${message}; File: ${fileName}; Line: ${line}, Column: ${column}`;
    const buffer = Uint8Array.wrap(String.UTF16.encode(errorReport));
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

/**
 * WARNING: This implementation is predictable and insecure as it relies solely on the block number.
 */
export function seed(): f64 {
    const context = getContext();
    return context.block.number as f64;
}
