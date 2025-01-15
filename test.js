import { expect } from "chai";
import { ethers } from "ethers";
import { execSync } from "child_process";
import { readFileSync } from "fs"


async function deployContract(signer, bytecode) {
    const tx = await signer.sendTransaction({
        data: "0x" + bytecode.toString("hex"),
        gasLimit: 30000000,
        gasPrice: 30000000,
    });
    const receipt = await tx.wait();
    return receipt.contractAddress;
}

describe('e2e tests', function () {
    let provider;
    let signer;
    this.timeout(120000);
    before(async function () {
        const mnemonic = "test test test test test test test test test test test junk";
        const path = "m/44'/60'/0'/0/19";
        const rpc = "http://localhost:8545";
        provider = new ethers.JsonRpcProvider(rpc);
        signer = ethers.Wallet.fromPhrase(mnemonic, { path }).connect(provider);
    });

    it('simple storage returns the value that was sent to it', async function () {
        execSync("make -C examples/simple-storage")
        const bytecode = readFileSync("examples/simple-storage/lib.wasm", null);
        const contractAddress = await deployContract(signer, bytecode);
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

    it('who-am-i correctly returns caller', async function () {
        execSync("make -C examples/who-am-i")
        const bytecode = readFileSync("examples/who-am-i/lib.wasm", null);
        const contractAddress = await deployContract(signer, bytecode);
        const result = await provider.call({
            from: signer.address,
            to: contractAddress,
            data: "",
        });
        const decodedResult = ethers.hexlify(ethers.getBytes(result));
        expect(decodedResult).to.equal(signer.address.toLowerCase());
    });



});
