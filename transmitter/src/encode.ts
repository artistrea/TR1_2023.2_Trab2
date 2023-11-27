import { z } from "zod";

export const encodingSchema = z.enum(["NRZ-Polar", "Manchester", "Bipolar"]);

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

  const regex = /0|1/gi;
  switch(_encodingType){
    case "NRZ-Polar":
      var codif: {[key:string]: string} = {
        0:"v",
        1:"V"
      }
      out = out.replace(regex, b => codif[b]); break
    case "Manchester":
      var codif: {[key:string]: string} = {
        0:"01",
        1:"10"
      }
      out = out.replace(regex, b => codif[b]); break
    case "Bipolar":
      let aux = ""
      let one = 'V'
      for (let i = 0; i < out.length; i++) {
        if (out[i] === '1'){
          aux += one
          if(one === 'V') one = 'v'
          else one = 'V'
        }
        else aux += '0'
      }
      out = aux; break
    }

  return out;
}
