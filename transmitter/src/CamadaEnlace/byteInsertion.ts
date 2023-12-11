const flag = "11110000";
const esc = "11111111";

export function byteInsertion(data: string): string {
  let substituicaoESC = new RegExp(flag,"g");
  let substituicaoDoubleESC = new RegExp(esc,"g");

  data.replace(substituicaoDoubleESC, esc.concat(esc));
  data.replace(substituicaoESC, esc.concat(flag));
  
  return flag.concat(data).concat(flag);
}