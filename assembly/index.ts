@external("fluentbase_v1preview", "_input_size")
declare function _input_size(): usize
@external("fluentbase_v1preview", "_read")
declare function _readInput(target_ptr: usize, offset: usize, length: usize): void
@external("fluentbase_v1preview", "_exec")
declare function _exec(hash32_ptr: usize, input_ptr: usize, input_len: usize, fuel_ptr: usize,state: u32): i32
@external("fluentbase_v1preview", "_read_output")
declare function _readOutput(target_ptr: usize, offset: usize, length: usize): void
@external("fluentbase_v1preview", "_keccak256")
declare function _keccak256(data_offset: usize, data_len: usize, output32_offset: usize): void
@external("fluentbase_v1preview", "_exit")
declare function _exit(code: i32): void
@external("fluentbase_v1preview", "_write")
declare function _writeOutput(string_ptr: i32, string_len: i32): void
function writeOutputBuffer(buffer: Uint8Array): void {
  _writeOutput(changetype<i32>(buffer), buffer.byteLength as i32)
}


/* this function have to be defined for compiler, it is not for smart contract writers */
function _abort(messagePtr: usize, fileNamePtr: usize, line: u32, column: u32): void {
  let message = ""
  while (true) {
    let codeUnit = load<u16>(messagePtr); // Load 16-bit (UTF-16) character from memory
    if (codeUnit == 0) {
      break;
    }
    message += String.fromCharCode(codeUnit);
    messagePtr += 2;
  }
  let utf8Buffer = String.UTF8.encode(message, false);
  _exit(1)
}



export function deploy(): void {
  // that is deployment stage (aka constructor)
}

export function main(): void {
  let buffer = new Uint8Array(5);
  buffer[0] = 'H'.charCodeAt(0);
  buffer[1] = 'e'.charCodeAt(0);
  buffer[2] = 'l'.charCodeAt(0);
  buffer[3] = 'l'.charCodeAt(0);
  buffer[4] = 'o'.charCodeAt(0);
  writeOutputBuffer(buffer);
}
