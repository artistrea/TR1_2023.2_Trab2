export const frameSize = {
  crc: 32,
  hamming: 34,
  paridade: 63,
};
export const headerSize = 7;
export const flag = "11110000";
export const esc = "11111111";

// valores alteráveis a gosto
export const EDC: keyof typeof frameSize = "hamming";
export const frameLimiter: "count" | "insertion" = "count";
