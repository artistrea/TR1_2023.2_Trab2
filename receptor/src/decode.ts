import { z } from "zod";

export const encodingSchema = z.enum(["bipolar", "hamming", "outra"]);

export type EncodingType = z.infer<typeof encodingSchema>;

export function decode(data: string, _encodingType: EncodingType): string {
  return "decoded data";
}
