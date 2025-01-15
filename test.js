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

function buildExample(examplePath) {
    execSync(`make -C ${examplePath}`)
    const bytecode = readFileSync(`${examplePath}/lib.wasm`, null);
    return bytecode;
}

function encodeToUtf16Hex(str) {
    const utf16Array = Array.from(str).map(char => char.charCodeAt(0));
    const hexString = utf16Array.map(codeUnit => codeUnit.toString(16).padStart(4, '0')).join('');
    return hexString;
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
        const bytecode = buildExample("examples/simple-storage")
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
        const bytecode = buildExample("examples/who-am-i")
        const contractAddress = await deployContract(signer, bytecode);
        const result = await provider.call({
            from: signer.address,
            to: contractAddress,
            data: "",
        });
        const decodedResult = ethers.hexlify(ethers.getBytes(result));
        expect(decodedResult).to.equal(signer.address.toLowerCase());
    });

    it('throw error actually throws an error', async function () {
        const bytecode = buildExample("examples/throw-error")
        const contractAddress = await deployContract(signer, bytecode);
        let catched = false;
        try {
            const result = await provider.call({
                from: signer.address,
                to: contractAddress,
                data: "",
            });

        } catch (error) {
            catched = true;
            const errorText = Buffer.from(error.data.slice(2), 'hex').toString();
            console.log(errorText);
            const expected = encodeToUtf16Hex("this is an error!");
            expect(error.data).to.contain(expected);
        }
        expect(catched).to.equal(true);
    });
});
