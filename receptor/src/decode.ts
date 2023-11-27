import { z } from "zod";

export const encodingSchema = z.enum(["NRZ-Polar", "Manchester", "Bipolar"]);

export type EncodingType = z.infer<typeof encodingSchema>;

export function decode(data: string, _encodingType: EncodingType): string {
  let outIn = "";

  const regex = /V|v/gi;
  switch(_encodingType){
    case "NRZ-Polar":
      var codif: {[key:string]: string} = {
        v:"0",
        V:"1"
      }
      outIn = outIn.replace(regex, b => codif[b]); break
    case "Manchester":
      for (let i = 0; i < outIn.length; i += 2) {
        let aux = ""
        if (outIn[0] === '0' && outIn[1] === '1') {
          aux += '0'
        } else if (outIn[0] === '1' && outIn[1] === '0') {
          aux += '1'
        } else {
          aux += "erroNaManchester"
        }
        outIn = aux; break
      }
      var codif: {[key:string]: string} = {
        0:"01",
        1:"10"
      }
      outIn = outIn.replace(regex, b => codif[b]); break
    case "Bipolar":
      var codif: {[key:string]: string} = {
        V:"1",
        v:"1"
      }
      outIn = outIn.replace(regex, b=> codif[b]); break
    }

  return outIn;
}