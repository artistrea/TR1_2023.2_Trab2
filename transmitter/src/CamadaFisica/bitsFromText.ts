export function bitsFromText(data: string) {
  let bits = "";

  for (let i = 0; i < data.length; i++) {
    let charAscii = data.charCodeAt(i);
    let charBits = charAscii.toString(2).padStart(8, "0");

    bits += charBits;
  }

  return bits;
}
