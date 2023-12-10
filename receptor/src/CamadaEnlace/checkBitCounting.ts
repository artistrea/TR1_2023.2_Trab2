import { headerSize } from "../config";

function getFramesByCount(
  data: string,
  headerMultiplier: 1 | 8 | 32
): string[] {
  const frames: string[] = [];

  let i = 0;
  while (i < data.length) {
    const header =
      parseInt(data.slice(i, i + headerSize), 2) * headerMultiplier;
    console.log("header", header);
    const dataWithoutHeader = data.slice(
      i + headerSize,
      i + headerSize + header
    );
    console.log("dataWithoutHeader", dataWithoutHeader);
    frames.push(dataWithoutHeader);

    if (Math.ceil(dataWithoutHeader.length / headerMultiplier) === header) {
      // console.log(
      //   "dataWithoutHeader.length",
      //   dataWithoutHeader.length,
      //   "header",
      //   header
      // );
      throw "Deu erro com header, há interferência";
    }

    i += dataWithoutHeader.length - 1 + headerSize - 1;
    console.log("i", i);
    console.log("############");
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
