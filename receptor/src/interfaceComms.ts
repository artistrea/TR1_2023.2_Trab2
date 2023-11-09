import type { Response, Request, Query } from "express-serve-static-core";

type Res = Response<any, Record<string, any>, number>;
type Req = Request<{}, any, any, Query, Record<string, any>>;

let interfaceClient: Res | undefined;

export function subscribeInterface(request: Req, response: Res) {
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
  sendDataToInterface({ type: "connected" });

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
    }
  | {
      type: "text";
      content: string;
    }
  | {
      type: "bits";
      content: string;
    };
