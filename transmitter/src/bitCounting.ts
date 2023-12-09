import { z } from "zod";

//export const ECSchema = z.enum(["Bit de paridade par", "CRC"]);

//export type ErrorControlType = z.infer<typeof ECSchema>;

// considerar-se-á os quadros como tendo, no máximo, 7 bits
// headers terão 7 bits
export function addBitCount(data: string): string {
  let dataNaoAlterado: string = data;
  let tamanhoDataEmBits = convertToBin(dataNaoAlterado.length);

  //Instancia variáveis default de quadros
  let frameSize = 64;

  let quadros = data.match(/.{1,64}/g) || [];

  return quadros.map((s: string) => convertToBin(s.length) + s).join("");
}

// converte número em string binário de 7 bits
export function convertToBin(n: number) {
  let variavelRetorno = (n >>> 0).toString(2);
  while (variavelRetorno.length < 7) {
    variavelRetorno = "0".concat(variavelRetorno);
  }
  return variavelRetorno;
}
