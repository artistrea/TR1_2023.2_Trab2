import type { Response, Request, Query } from "express-serve-static-core";
import type { EncodingType } from "../CamadaFisica/encode";

type Res = Response<any, Record<string, any>, number>;
type Req = Request<{}, any, any, Query, Record<string, any>>;

let interfaceClient: Res | undefined;

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

  response.writeHead(200, headers);
  response.flushHeaders();

  if (interfaceClient) {
    interfaceClient.end();
    console.warn("A interfaceClient has been forcefully disconnected");
  }
  interfaceClient = response;
  console.log("Client connected");
  sendDataToInterface({ type: "connected", startEncoding });

  // lost connection:
  request.on("close", () => {
    interfaceClient = undefined;
    console.log("Client disconnected");
  });
}

export function sendDataToInterface(data: InterfaceMessage) {
  interfaceClient?.write(`data: ${JSON.stringify(data)}\n\n`);
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
