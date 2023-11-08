import express from "express";
import cors from "cors";
import type { Response } from "express-serve-static-core";

const port = 3002;

const app = express();
app.use(express.json());
app.use(cors());

let interfaceClient: Response<any, Record<string, any>, number> | undefined;

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

function decode(data: string) {
  return "decoded data";
}

app.post("/", (req, res) => {
  const { bits } = req.body;

  if (typeof bits !== "string") {
    res.status(400).send({ message: "bits sent should be string" });
    return;
  }

  sendDataToInterface({ type: "bits", content: bits });

  const decodedData = decode(bits);

  sendDataToInterface({ type: "text", content: decodedData });

  const headers = {
    "Access-Control-Allow-Origin": "*",
  };
  res.status(200).header(headers).send({ message: "yay" });
});

app.get("/subscribe-interface", (request, response) => {
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
});

function sendDataToInterface(data: InterfaceMessage) {
  interfaceClient?.write(`data: ${JSON.stringify(data)}\n\n`);
}

app.listen(port, () => {
  console.log(`Transmitter app listening on http://localhost:${port}`);
});
