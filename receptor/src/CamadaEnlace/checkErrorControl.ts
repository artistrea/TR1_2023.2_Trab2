import { z } from "zod";

export const ECSchema = z.enum(["paridade", "crc"]);

export type ErrorControlType = z.infer<typeof ECSchema>;

export function checkEDC(
  data: string,
  errorControlType: ErrorControlType
): string {
  //data = "100100000"
  let dataEDC: string = data;
  let edc: string = "";

  switch (errorControlType) {
    case "crc":
      const polynomial = "10000010011000001000111011011011";
      const ord = polynomial.length;

      let divPiece: string = dataEDC.slice(0, ord);
      for (var i = ord; i < dataEDC.length; i++) {
        if (divPiece[0] === "1") {
          divPiece = xor(divPiece, polynomial).slice(1) + dataEDC[i];
        } else {
          divPiece = divPiece.slice(1) + dataEDC[i];
        }
      }
      edc = divPiece.slice(0, ord - 1);
      data = data.slice(0, 32);
      break;
    case "paridade":
      let sum = 0;
      for (const bit of data) {
        if (bit === "1") sum += 1;
      }
      edc = sum % 2 === 0 ? "0" : "1";
      data = data.slice(0, data.length - 1);
      break;
  }
  if (parseInt(edc) === 0) {
    return data;
  } else {
    throw "Teve ruído"; // TODO: Pensar melhor o que fazer
  }
}

export function checkHamming(data: string): string {
  //data = "1101001"
  //PP1P101P001
  const log2 = (x: number) => Math.ceil(Math.log2(x));
  const dataLen = data.length;
  let hammingData = data;
  let verfBitsLen = log2(dataLen);
  const hammingDataLen = dataLen + verfBitsLen;

  let sum = 0;
  const edac: string[] = [];
  let window: number;
  for (let i = 0; i < verfBitsLen; i++) {
    sum = 0;
    window = 2 ** i;
    for (let j = window - 1; j < hammingDataLen; j += 2 * window) {
      for (let k = j; k < j + window; k++) {
        sum += hammingData[k] == "1" ? 1 : 0;
      }
    }
    edac.push(sum % 2 === 0 ? "0" : "1");
  }
  const bitErrorPosition: number = parseInt(edac.reverse().join(""), 2);

  if (bitErrorPosition !== 0) {
    data =
      data.slice(0, bitErrorPosition - 1) +
      (data.slice(bitErrorPosition - 1, bitErrorPosition) === "0" ? "1" : "0") +
      data.slice(bitErrorPosition);
    //throw("Teve ruído na posição "+bitErrorPosition)
  }

  let cut: number;
  for (let i = 0; i < verfBitsLen; i++) {
    cut = 2 ** i - 1;
    data = data.slice(0, cut) + "P" + data.slice(cut + 1);
  }
  data = data.replace(/P/gi, "");

  return data;
}

function xor(s1: string, s2: string): string {
  let result: string = "";
  for (var i = 0; i < s1.length; i++) {
    if (s1[i] === s2[i]) result += "0";
    else result += "1";
  }
  return result;
}
