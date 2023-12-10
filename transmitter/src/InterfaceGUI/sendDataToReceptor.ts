import type { EncodingType } from "../CamadaFisica/encode";

type ReceptorMessage = {
  bits: string;
};

// Send bits and encoding type to receptor
export function sendDataToReceptor(
  data: ReceptorMessage,
  receptorBaseUrl: string
) {
  fetch(receptorBaseUrl, {
    method: "POST",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify(data),
  });
}
