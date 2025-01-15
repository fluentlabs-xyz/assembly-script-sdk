.PHONY: lib.wasm
lib.wasm: assembly/contract.ts node_modules
	npx compile assembly/contract.ts -o lib.wasm -t lib.wat

node_modules:
	npm install
