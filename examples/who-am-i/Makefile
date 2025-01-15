.PHONY: lib.wasm
lib.wasm: assembly/contract.ts node_modules
	npx compile assembly/contract.ts -o lib.wasm -t lib.wat

package-lock.json:
	npm install
