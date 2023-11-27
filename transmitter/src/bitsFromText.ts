export function bitsFromText(data: string) {
  let bits = "";

  for (let i = 0; i < data.length; i++) {
    let charAscii = data.charCodeAt(i);
    let charBits = "";
    let j = 8;
    while (j--) {
      if (charAscii & 1) charBits = "1" + charBits;
      else charBits = "0" + charBits;
      charAscii >>= 1;
    }
    bits += charBits;
  }

  return bits;
}
