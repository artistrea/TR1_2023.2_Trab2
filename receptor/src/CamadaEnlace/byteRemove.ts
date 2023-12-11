import { flag, esc } from "../config";

const jaTinhaESC = esc.concat(esc);
const escFlag = esc.concat(flag);

//Começa com flag e termina com flag não precedida de esc
let frameMatchingRegex = new RegExp(`${flag}.*(?<!${esc})${flag}`,"g")

export function byteRemove(data: string): string[] {
  let sumirDoubleESC = new RegExp(jaTinhaESC,"g");
  let sumirESC = new RegExp(escFlag, "g")

  let quadros = data.match(frameMatchingRegex)?.map((s:string) => data.replace(sumirDoubleESC, esc).replace(sumirESC, flag))!;

  return quadros;
}