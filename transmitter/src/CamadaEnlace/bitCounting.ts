import { frameSize } from "../config";

const frameMatchingRegex = new RegExp(`.{1,${frameSize}}`, "g");

export function addBitCount(data: string): string {
  //let quadros = data.match(frameMatchingRegex) || [];

  //return quadros.map((s: string) => convertToBin(s.length) + s).join("");

  let header = convertToBin(data.length);
  return header.concat(data)
}

export function addCharCount(data: string): string {
  // let quadros = data.match(frameMatchingRegex) || [];

  // return quadros
  //   .map((s: string) => convertToBin(Math.ceil(s.length / 8)) + s)
  //   .join("");

  let header = convertToBin(Math.ceil(data.length / 8));
  return header.concat(data)
}

export function addWordCount(data: string): string {
  // let quadros = data.match(frameMatchingRegex) || [];

  // return quadros
  //   .map((s: string) => convertToBin(Math.ceil(s.length / 32)) + s)
  //   .join("");

  let header = convertToBin(Math.ceil(data.length / 32));
  return header.concat(data)
}

// converte número em string binário de 7 bits
export function convertToBin(n: number) {
  return (n >>> 0).toString(2).padStart(7, "0");
}
