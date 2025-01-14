import { FLUENT_HEADER_SIZE } from "./consts"
import { _readInput } from "./bindings"

export class BlockContext {
    constructor(
        public chainId: u64,
        public coinbase: Uint8Array, // Address as a Uint8Array
        public timestamp: u64,
        public number: u64,
        public difficulty: Uint8Array, // U256 as a Uint8Array
        public prevRandao: Uint8Array, // B256 as a Uint8Array
        public gasLimit: u64,
        public baseFee: Uint8Array // U256 as a Uint8Array
    ) { }
}

export class TxContext {
    constructor(
        public gasLimit: u64,
        public nonce: u64,
        public gasPrice: Uint8Array,
        public gasPriorityFee: Uint8Array,
        public origin: Uint8Array,
        public value: Uint8Array
    ) { }
}

export class ContractContext {
    constructor(
        public address: Uint8Array,
        public bytecodeAddress: Uint8Array,
        public caller: Uint8Array,
        public isStatic: bool,
        public value: Uint8Array
    ) { }
}

export class Context {
    constructor(
        public block: BlockContext,
        public tx: TxContext,
        public contract: ContractContext
    ) { }
}

class ContextParser {
    public offset: usize = 0;
    public buffer: Uint8Array;
    constructor(buffer: Uint8Array) {
        this.buffer = buffer;
    }

    readU64(): u64 {
        const value = load<u64>(this.buffer.dataStart + this.offset);
        this.offset += 8;
        return value;
    }

    readUint8Array(length: i32): Uint8Array {
        const array = this.buffer.subarray(this.offset as i32, this.offset as i32 + length);
        this.offset += length;
        return array;
    }

    readBool(): bool {
        const value = load<u32>(this.buffer.dataStart + this.offset);
        this.offset += 4
        return value != 0;
    }
}

export function getContext(): Context {
    const buffer = new Uint8Array(FLUENT_HEADER_SIZE);
    _readInput(buffer.dataStart, 0, buffer.byteLength);
    const parser = new ContextParser(buffer);
    const block = new BlockContext(
        parser.readU64(),               // chainId
        parser.readUint8Array(20),      // coinbase (Address, 20 bytes)
        parser.readU64(),               // timestamp
        parser.readU64(),               // number
        parser.readUint8Array(32),      // difficulty (U256, 32 bytes)
        parser.readUint8Array(32),      // prevRandao (B256, 32 bytes)
        parser.readU64(),               // gasLimit
        parser.readUint8Array(32)       // baseFee (U256, 32 bytes)
    );
    const tx = new TxContext(
        parser.readU64(),               // gasLimit
        parser.readU64(),               // nonce
        parser.readUint8Array(32),      // gasPrice (U256, 32 bytes)
        parser.readUint8Array(36),      // gasPriorityFee (Option<U256>, 36 bytes)
        parser.readUint8Array(20),      // origin (Address, 20 bytes)
        parser.readUint8Array(32)       // value (U256, 32 bytes)
    );
    tx.gasPriorityFee = tx.gasPriorityFee.subarray(4); // TODO: make the field optional
    const contract = new ContractContext(
        parser.readUint8Array(20),      // address (Address, 20 bytes)
        parser.readUint8Array(20),      // bytecodeAddress (Address, 20 bytes)
        parser.readUint8Array(20),      // caller (Address, 20 bytes)
        parser.readBool(),              // isStatic (bool, 4 bytes)
        parser.readUint8Array(32)       // value (U256, 32 bytes)
    );
    return new Context(block, tx, contract);
}
