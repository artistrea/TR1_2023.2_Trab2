import { z } from "zod";

export const encodingSchema = z.enum(["bipolar", "hamming", "outra"]);

export type EncodingType = z.infer<typeof encodingSchema>;

export function encode(data: string, _encodingType: EncodingType): string {
  let out = "";

  for (let i = 0; i < data.length; i++) {
    let charAscii = data.charCodeAt(i);
    let charBits = "";
    let j = 8;
    while (j--) {
      if (charAscii & 1) charBits = "1" + charBits;
      else charBits = "0" + charBits;
      charAscii >>= 1;
    }
    out += charBits;
  }

  return out;
}
