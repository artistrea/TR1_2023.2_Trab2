export const frameSize = {
  crc: 32,
  hamming: 34,
  paridade: 63,
};

export const EDC: keyof typeof frameSize = "hamming";

export const headerSize = 7;
export const flag = "11110000";
export const esc = "11111111";

export const frameLimiter: "count" | "insertion" = "insertion";
