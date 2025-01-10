// noinspection JSUnusedGlobalSymbols

@external("fluentbase_v1preview", "_write")
declare function _writeOutput(string_ptr: i32, string_len: i32): void

function writeOutputBuffer(buffer: Uint8Array): void {
  _writeOutput(changetype<i32>(buffer), buffer.byteLength as i32)
}

export function deploy(): void {
  // that is deployment stage (aka constructor)
}

function _abort(messagePtr: usize, fileNamePtr: usize, line: u32, column: u32): void {
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
