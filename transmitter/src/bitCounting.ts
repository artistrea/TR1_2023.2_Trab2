import { z } from "zod";

// headers terão 7 bits
export function addBitCount(data: string): string {
  let dataNaoAlterado: string = data;

  //Instancia variáveis default de quadros
  let frameSize = 64;

  let quadros = data.match(/.{1,64}/g) || [];

  return quadros.map((s: string) => convertToBin(s.length) + s).join("");
}

export function addWordCount(data: string): string {
  let dataNaoAlterado: string = data;

  //Instancia variáveis default de quadros
  let frameSize = 64;

  let quadros = data.match(/.{1,64}/g) || [];

  return quadros.map((s: string) => convertToBin(Math.ceil((s.length)/32)) + s).join("");
}

// converte número em string binário de 7 bits
export function convertToBin(n: number) {
  let variavelRetorno = (n >>> 0).toString(2);
  while (variavelRetorno.length < 7) {
    variavelRetorno = "0".concat(variavelRetorno);
  }
  return variavelRetorno;
}
