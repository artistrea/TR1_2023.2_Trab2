export const frameSize = {
  crc: 32,
  hamming: 34,
  paridade: 63,
};

export const EDC: keyof typeof frameSize = "crc";

export const headerSize = 7;
