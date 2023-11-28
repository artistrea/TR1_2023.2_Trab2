import { z } from "zod";

export const encodingSchema = z.enum(["NRZ-Polar", "Manchester", "Bipolar"]);

export type EncodingType = z.infer<typeof encodingSchema>;

export function decode(data: string, _encodingType: EncodingType): string {
  let outIn = "";
  outIn = data;
  const regex = /V|v/gi;
  switch(_encodingType){
    case "NRZ-Polar":
      var codif: {[key:string]: string} = {
        v:"0",
        V:"1"
      }
      outIn = outIn.replace(regex, b => codif[b]); break
    case "Manchester":
      let aux = ""
      for (let i = 0; i < outIn.length; i += 2) {
        if (outIn[i] === '0' && outIn[i+1] === '1') {
          aux += '0'
        } else if (outIn[i] === '1' && outIn[i+1] === '0') {
          aux += '1'
        } else {
          aux += "erroNaManchester"
        }
      }
      outIn = aux; break
    case "Bipolar":
      var codif: {[key:string]: string} = {
        V:"1",
        v:"1"
      }
      outIn = outIn.replace(regex, b=> codif[b]); break
    }

  return outIn;
}