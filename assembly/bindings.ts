// @ts-ignore
@external("fluentbase_v1preview", "_input_size")
export declare function _inputSize(): u32;

// @ts-ignore
@external("fluentbase_v1preview", "_output_size")
export declare function _outputSize(): u32;

// @ts-ignore
@external("fluentbase_v1preview", "_read")
export declare function _readInput(
    destinationPtr: usize, // Pointer to the destination buffer
    dataOffset: u32,       // Offset within the input data
    dataLength: u32        // Length of data to read
): void;

// @ts-ignore
@external("fluentbase_v1preview", "_exec")
export declare function _exec(
    hashPtr: usize,        // Pointer to the 32-byte hash
    inputPtr: usize,       // Pointer to the input buffer
    inputLength: u32,      // Length of the input buffer
    fuelPtr: usize,        // Pointer to the fuel value
    stateValue: u32        // State flag or value
): i32;

// @ts-ignore
@external("fluentbase_v1preview", "_read_output")
export declare function _readOutput(
    destinationPtr: usize, // Pointer to the destination buffer
    dataOffset: u32,       // Offset within the output data
    dataLength: u32        // Length of data to read
): void;

// @ts-ignore
@external("fluentbase_v1preview", "_keccak256")
export declare function _keccak256(
    inputDataPtr: usize,   // Pointer to the input data
    inputDataLength: u32,  // Length of the input data
    outputHashPtr: usize   // Pointer to the output buffer (32 bytes)
): void;

// @ts-ignore
@external("fluentbase_v1preview", "_exit")
export declare function _exit(exitCode: i32): void;

// @ts-ignore
@external("fluentbase_v1preview", "_write")
export declare function _writeOutput(
    sourcePtr: usize,      // Pointer to the source data (string)
    sourceLength: u32      // Length of the source data
): void;
