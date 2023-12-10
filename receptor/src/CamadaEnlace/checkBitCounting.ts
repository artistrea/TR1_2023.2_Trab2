import { headerSize } from "../config";

function getFramesByCount(data: string, headerMultiplier: number): string[] {
  const frames: string[] = [];

  let i = 0;
  while (i < data.length) {
    const header =
      parseInt(data.slice(i, i + headerSize), 2) * headerMultiplier;
    const dataWithoutHeader = data.slice(
      i + headerSize,
      i + headerSize + header
    );
    frames.push(dataWithoutHeader);

    if (dataWithoutHeader.length !== header) {
      // console.log(
      //   "dataWithoutHeader.length",
      //   dataWithoutHeader.length,
      //   "header",
      //   header
      // );
      throw "Deu erro com header, há interferência";
    }

    i += header + headerSize;
  }

  return frames;
}

// throws if error in frame
// returns frames without their headers
export function getFramesByBitCount(data: string): string[] {
  return getFramesByCount(data, 1);
}

// throws if error in frame
// returns frames without their headers
export function getFramesByWordCount(data: string): string[] {
  return getFramesByCount(data, 32);
}

// throws if error in frame
// returns frames without their headers
export function getFramesByCharCount(data: string): string[] {
  return getFramesByCount(data, 8);
}
