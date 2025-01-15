# AssemblyScript SDK for Fluent Blockchain

The **AssemblyScript SDK** is a toolkit for building smart contracts in AssemblyScript on the Fluent blockchain.

### Missing Features

1. No named value storage or Solidity-like mappings.
2. Contracts have a single `main` function that must manually parse transaction inputs.
3. Ethereum primitives (`Address`, `U256`, etc.) are not supported; use `Uint8Array` instead.
4. Event emission is not yet implemented.

### Known Issues

1. SDK import is mandatory for all contracts to resolve abort, trace, and seed functions.
2. Contracts without initialized memory (memory $0 0 in .wat) may not execute correctly
3. Randomness generated using the `seed` function is insecure and predictable, as it relies on the block number.

---

### How to Build an Example

1. Navigate to the example directory:

```bash
cd examples/<example_name>
```

2. Install dependencies and build the smart contract:

```bash
make
```

3. Deploy the generated `lib.wasm` file to the Fluent blockchain using your preferred deployment tool or method.
