import { flag, esc } from "../config";

export function byteInsertion(data: string): string {
  let substituicaoESC = new RegExp(flag, "g");
  let substituicaoDoubleESC = new RegExp(esc, "g");

  data.replace(substituicaoDoubleESC, esc.concat(esc));
  data.replace(substituicaoESC, esc.concat(flag));

  return flag.concat(data).concat(flag);
}
