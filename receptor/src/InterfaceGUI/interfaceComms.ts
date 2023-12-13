import type { Response, Request, Query } from "express-serve-static-core";
import type { EncodingType } from "../CamadaFisica/decode";

type Res = Response<any, Record<string, any>, number>;
type Req = Request<{}, any, any, Query, Record<string, any>>;

let interfaceClients: { id: number; res: Res }[] = [];

export function subscribeInterface(
  request: Req,
  response: Res,
  startEncoding: EncodingType
) {
  const headers = {
    "Content-Type": "text/event-stream",
    Connection: "keep-alive",
    "Cache-Control": "no-cache",
  };
  const clientId = Date.now();

  response.writeHead(200, headers);
  response.flushHeaders();

  interfaceClients.push({ id: clientId, res: response });
  console.log("Client connected");
  sendDataToInterface({ type: "connected", startEncoding });

  // lost connection:
  request.on("close", () => {
    console.log(`${clientId} Connection closed`);
    interfaceClients = interfaceClients.filter(
      (client) => client.id !== clientId
    );
  });
}

export function sendDataToInterface(data: InterfaceMessage) {
  interfaceClients.forEach((client) =>
    client.res.write(`data: ${JSON.stringify(data)}\n\n`)
  );
}

type InterfaceMessage =
  | {
      type: "connected";
      startEncoding: EncodingType;
    }
  | {
      type: "text";
      content: string;
    }
  | {
      type: "bits";
      content: string;
    }
  | {
      type: "encoded-bits";
      content: string;
    }
  | {
      type: "encoding";
      content: EncodingType;
    };
