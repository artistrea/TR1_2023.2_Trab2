import { z } from "zod";

export const encodingSchema = z.enum(["NRZ-Polar", "Manchester", "Bipolar"]);

export type EncodingType = z.infer<typeof encodingSchema>;

export function encode(bits: string, encodingType: EncodingType): string {
  const regex = /0|1/gi;
  switch (encodingType) {
    case "NRZ-Polar":
      var codif: { [key: string]: string } = {
        0: "v",
        1: "V",
      };
      bits = bits.replace(regex, (b) => codif[b]);
      break;
    case "Manchester":
      var codif: { [key: string]: string } = {
        0: "01",
        1: "10",
      };
      bits = bits.replace(regex, (b) => codif[b]);
      break;
    case "Bipolar":
      let aux = "";
      let one = "V";
      for (let i = 0; i < bits.length; i++) {
        if (bits[i] === "1") {
          aux += one;
          if (one === "V") one = "v";
          else one = "V";
        } else aux += "0";
      }
      bits = aux;
      break;
  }

  return bits;
}
