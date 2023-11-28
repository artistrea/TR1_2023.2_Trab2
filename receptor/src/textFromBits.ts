export function textFromBits(data: string) {
  let text = "";

  for (let i = 0; i < data.length; i += 8) {
    text += String.fromCharCode(parseInt(data.slice(i, i + 8), 2));
  }

  return text;
}
