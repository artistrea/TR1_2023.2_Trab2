import { frameSize } from "./config";

const frameMatchingRegex = new RegExp(`.{1,${frameSize}}`, "g");

export function addBitCount(data: string): string {
  let quadros = data.match(frameMatchingRegex) || [];

  return quadros.map((s: string) => convertToBin(s.length) + s).join("");
}

export function addCharCount(data: string): string {
  let quadros = data.match(frameMatchingRegex) || [];

  return quadros
    .map((s: string) => convertToBin(Math.ceil(s.length / 8)) + s)
    .join("");
}

export function addWordCount(data: string): string {
  let quadros = data.match(frameMatchingRegex) || [];

  return quadros
    .map((s: string) => convertToBin(Math.ceil(s.length / 32)) + s)
    .join("");
}

// converte número em string binário de 7 bits
export function convertToBin(n: number) {
  return (n >>> 0).toString(2).padStart(7, "0");
}
