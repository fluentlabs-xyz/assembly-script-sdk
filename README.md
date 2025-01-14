# AssemblyScript SDK for Fluent Blockchain

The **AssemblyScript SDK** is a toolkit for building smart contracts in AssemblyScript on the Fluent blockchain.

---

### Usage

```bash
nvm use 23 # use Node.js v23.6.0 (npm v11.0.0)
npm install
npx compile examples/echo.ts # pass arguments to the AssemblyScript compiler
```

### Missing Features

1. No named value storage or Solidity-like mappings.
2. Contracts have a single `main` function that must manually parse transaction inputs.
3. Ethereum primitives (`Address`, `U256`, etc.) are not supported; use `Uint8Array` instead.

### Known Issues

1. SDK import is mandatory for all contracts to resolve abort, trace, and seed functions.
2. Contracts without initialized memory (memory $0 0 in .wat) may not execute correctly
