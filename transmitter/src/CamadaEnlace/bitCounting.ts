export function addBitCount(data: string): string {
  let header = convertToBin(data.length);
  return header.concat(data);
}

export function addCharCount(data: string): string {
  let header = convertToBin(Math.ceil(data.length / 8));
  return header.concat(data);
}

export function addWordCount(data: string): string {
  let header = convertToBin(Math.ceil(data.length / 32));
  return header.concat(data);
}

// converte número em string binário de 7 bits
export function convertToBin(n: number) {
  return (n >>> 0).toString(2).padStart(7, "0");
}
