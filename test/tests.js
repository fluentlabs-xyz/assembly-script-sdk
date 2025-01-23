import { expect } from "chai";
import { execSync } from "child_process";
import { readFileSync } from "fs"
import { join, dirname } from "path";


async function deployWasmContract(signer, bytecode) {
    const tx = await signer.sendTransaction({
        data: bytecode,
        gasLimit: 30000000,
        gasPrice: 30000000,
    });
    const receipt = await tx.wait();
    return receipt.contractAddress;
}

function compileWasmContract(examplePath) {
    examplePath = join(dirname(import.meta.filename), examplePath);
    execSync(`make -C ${examplePath}`)
    const bytecode = readFileSync(`${examplePath}/lib.wasm`, null).toString("hex");
    return "0x" + bytecode;
}

function decodeUtf16(bytes) {
    const decoder = new TextDecoder("utf-16");
    return decoder.decode(new Uint8Array(bytes));
}

describe('compilation tests', function () {
    it('all examples must build', function () {
        compileWasmContract("../examples/simple-storage");
        compileWasmContract("../examples/who-am-i");
        compileWasmContract("../examples/throw-error");
    });
});

describe('e2e tests', function () {
    it('simple storage returns the value that was sent to it', async function () {
        if (network.name === 'hardhat') {
            console.warn('⚠️  WASM tests require a Fluent-compatible network');
            this.skip();
        }
        const signer = (await ethers.getSigners())[0];
        const bytecode = compileWasmContract("../examples/simple-storage");
        const contractAddress = await deployWasmContract(signer, bytecode);
        const inputData = "0xff00aa0000000000000000000000000000000000000000000000000000000000";
        const tx = await signer.sendTransaction({
            to: contractAddress,
            data: inputData,
            gasLimit: 30000000,
            gasPrice: 30000000,
        });
        await tx.wait();
        const result = await signer.call({
            to: contractAddress,
            data: "0x",
        });
        const decodedResult = ethers.hexlify(ethers.getBytes(result));
        expect(decodedResult).to.equal(inputData);
    });

    it('who-am-i correctly returns caller', async function () {
        if (network.name === 'hardhat') {
            console.warn('⚠️  WASM tests require a Fluent-compatible network');
            this.skip();
        }
        const signer = (await ethers.getSigners())[0];
        const bytecode = compileWasmContract("../examples/who-am-i");
        const contractAddress = await deployWasmContract(signer, bytecode);
        const result = await signer.call({
            to: contractAddress,
            data: "0x",
        });
        const decodedResult = ethers.hexlify(ethers.getBytes(result));
        expect(decodedResult).to.equal(signer.address.toLowerCase());
    });

    it('throw error actually throws an error', async function () {
        if (network.name === 'hardhat') {
            console.warn('⚠️  WASM tests require a Fluent-compatible network');
            this.skip();
        }
        const signer = (await ethers.getSigners())[0];
        const bytecode = compileWasmContract("../examples/throw-error");
        const contractAddress = await deployWasmContract(signer, bytecode);
        let catched = false;
        try {
            const result = await signer.call({
                to: contractAddress,
                data: "0x",
            });

        } catch (error) {
            catched = true;
            const errorText = decodeUtf16(Buffer.from(error.data.slice(2), 'hex'));
            expect(errorText).to.contain("this is an error!");
        }
        expect(catched).to.equal(true);
    });
});
