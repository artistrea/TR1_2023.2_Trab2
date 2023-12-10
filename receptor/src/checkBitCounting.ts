import { frameSize, headerSize } from "./config";

const frameWHeaderSize = frameSize + headerSize;

function checkCount(data: string, headerMultiplier: number) {
  let bits = data;
  let checkHeader = 0;
  let bitsSaida = "";

  for (let i = 0; i >= 0; i += frameWHeaderSize) {
    bits = data.slice(i + headerSize, i + frameWHeaderSize);
    checkHeader = parseInt(data.slice(i, i + headerSize), 2);

    if (checkHeader * headerMultiplier < bits.length) {
      throw "Deu erro com header, há interferência";
    }

    bitsSaida = bitsSaida.concat(bits);
    if (i + frameWHeaderSize >= data.length) {
      return bitsSaida;
    }
  }

  throw "Erro na função a qual faz a retiragem e checagem dos quadros";
}

// throws if error in frame
export function checkBitCount(data: string): string {
  return checkCount(data, 1);
}

// throws if error in frame
export function checkWordCount(data: string): string {
  return checkCount(data, 32);
}

// throws if error in frame
export function checkCharCount(data: string): string {
  return checkCount(data, 8);
}
