import { expect } from "chai";
import { ethers } from "ethers";
import { execSync } from "child_process";
import { readFileSync } from "fs"

describe('simple-storage', function () {
    let provider;
    let signer;
    let contractAddress;
    this.timeout(120000);
    before(async function () {
        const mnemonic = "test test test test test test test test test test test junk";
        const path = "m/44'/60'/0'/0/19";
        const rpc = "http://localhost:8545";
        provider = new ethers.JsonRpcProvider(rpc);
        signer = ethers.Wallet.fromPhrase(mnemonic, { path }).connect(provider);
        // compile and deploy smart contract
        execSync("npx compile assembly/contract.ts -o lib.wasm")
        const bytecode = readFileSync("lib.wasm", null);
        const tx = await signer.sendTransaction({
            data: "0x" + bytecode.toString("hex"),
            gasLimit: 30000000,
            gasPrice: 30000000,
        });
        const receipt = await tx.wait();
        contractAddress = receipt.contractAddress;
    });

    it('saved value should be returned', async function () {
        const inputData = "0xff00aa0000000000000000000000000000000000000000000000000000000000";
        const tx = await signer.sendTransaction({
            to: contractAddress,
            data: inputData,
            gasLimit: 30000000,
            gasPrice: 30000000,
        });
        await tx.wait();
        const result = await provider.call({
            from: signer.address,
            to: contractAddress,
            data: "",
        });
        const decodedResult = ethers.hexlify(ethers.getBytes(result));
        expect(decodedResult).to.equal(inputData);
    });
});
