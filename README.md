# AssemblyScript SDK for Fluent Blockchain

The **AssemblyScript SDK** is a toolkit for building smart contracts in AssemblyScript on the Fluent blockchain.

## Getting Started

To develop a smart contract using Assembly Script for the Fluent blockchain, follow these steps:

#### Step 1: Install Assembly Script SDK

First, ensure you have Node.js and npm installed on your machine. Then, install the `@fluent.xyz/assembly-script-sdk` package:

```bash
npm install @fluent.xyz/assembly-script-sdk
```

#### Step 2: Create Your Assembly Script Application

Create a new TypeScript file with the `.ts` extension for your smart contract. For instance, you can create a file named `assembly/contract.ts`.

#### Step 3: Implement the Smart Contract

In your newly created `.ts` file, import the required methods and define the main function. Here's a basic template:

```typescript
import { readStorage, readInput, writeOutput, writeStorage } from "@fluent.xyz/assembly-script-sdk/assembly";

export function main(): void {
  // Your smart contract implementation here
}
```

Refer to [Assembly Script documentation](https://www.assemblyscript.org/) for more details on the language syntax and features.

#### Step 4: Build the Smart Contract into WASM Bytecode

Once your implementation is complete, compile the smart contract to WebAssembly (WASM) bytecode using the following command:

```bash
npx compile assembly/contract.ts -o lib.wasm
```

This command essentially passes the specified arguments to the AssemblyScript compiler. You can include additional options like `--optimize` to produce an optimized WASM binary. For more detailed options and configurations, visit the [AssemblyScript Compiler documentation](https://www.assemblyscript.org/compiler.html).

#### Step 5: Deploy to Fluent Blockchain

With the bytecode ready (`lib.wasm`), you can proceed to deploy it to the Fluent blockchain.

#### Additional Resources

You can find more comprehensive examples in the `examples/` folder of the SDK package or refer to specific documentation provided by Fluent.


## Documentation

This section describes all available methods in the **AssemblyScript SDK**, a toolkit for building smart contracts in AssemblyScript on the Fluent blockchain.

- **`function exit(code: i32): void`**
  Terminates the execution with the specified exit code.

- **`function inputSize(): u32`**
  Returns the size of the input data.

- **`function readInput(): Uint8Array`**
  Reads the input data and returns it as a `Uint8Array`.

- **`function readOutput(): Uint8Array`**
  Reads the output data and returns it as a `Uint8Array`.

- **`function writeOutput(buffer: Uint8Array): void`**
  Writes the provided `Uint8Array` to the output.

- **`function exec(codeHash: Uint8Array, input: Uint8Array, gasLimit: u64, state: u32): ExecResult`**
  Executes a smart contract with the given parameters:
  - `codeHash`: The hash of the code to execute.
  - `input`: Input data as a `Uint8Array`.
  - `gasLimit`: Maximum gas allowed for the execution.
  - `state`: State context identifier.

  Returns an `ExecResult` object that contains:
  - `gasUsed`: The amount of gas consumed during execution.
  - `exitCode`: The exit code of the execution.

- **`function keccak256(data: Uint8Array): Uint8Array`**
  Computes the Keccak-256 hash of the given `Uint8Array`.

- **`function writeStorage(slot: Uint8Array, value: Uint8Array): void`**
  Writes a value to the specified storage slot.

- **`function readStorage(slot: Uint8Array): Uint8Array`**
  Reads the value stored at the specified storage slot.

- **`function abort(messagePtr: usize, fileNamePtr: usize, line: u32, column: u32): void`**
  Aborts execution and provides debugging details:
  - `messagePtr`: Pointer to the error message.
  - `fileNamePtr`: Pointer to the file name.
  - `line`: Line number.
  - `column`: Column number.

  Instead of calling this function directly, you can use the TypeScript syntax:
  ```typescript
  throw new Error("this is an error!");
  ```

- **`function seed(): f64`**
  Supposed to return a random value, but currently, it only returns the block number.
  **Do not use this value to produce secure random numbers.**

- **`function getContext(): Context`**
  Retrieves the current execution context as a Context object, which contains essential details about the transaction, block, and contract. This includes information such as the block number, caller address, and other relevant metadata.


## Missing Features

1. No named value storage or Solidity-like mappings.
2. Contracts have a single `main` function that must manually parse transaction inputs.
3. Ethereum primitives (`Address`, `U256`, etc.) are not supported; use `Uint8Array` instead.
4. Event emission is not yet implemented.

## Known Issues

1. SDK import is mandatory for all contracts to resolve abort, trace, and seed functions.
2. Contracts without initialized memory (memory $0 0 in .wat) may not execute correctly
3. Randomness generated using the `seed` function is insecure and predictable, as it relies on the block number.

## How to Run an Example

1. Navigate to the example directory:

```bash
cd examples/<example_name>
```

2. Install dependencies and build the smart contract:

```bash
make
```

3. Deploy the generated `lib.wasm` file to the Fluent blockchain using your preferred deployment tool or method.


## Testing

To run tests, use the following commands:

- For testing against a local fluent node:

  ```bash
  npx hardhat test --local
  ```

- To skip tests requiring Fluent features:

  ```bash
  npx hardhat test
  ```
