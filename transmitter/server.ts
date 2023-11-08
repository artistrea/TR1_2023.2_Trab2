import express from "express";
import cors from "cors";
import type { Response } from "express-serve-static-core";

const port = 3001;

const app = express();
app.use(express.json());
app.use(cors());

let interfaceClient: Response<any, Record<string, any>, number> | undefined;
const receptorBaseUrl = "http://localhost:3002/";

type ReceptorMessage = {
  bits: string;
};

function sendDataToReceptor(data: ReceptorMessage) {
  fetch(receptorBaseUrl, {
    method: "POST",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify(data),
  });
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

function encode(data: string) {
  let out = "";

  for (let i = 0; i < data.length; i++) {
    let num = data.charCodeAt(0);
    let charBits = "";
    let j = 8;
    while (j--) {
      if (num & 1) charBits = "1" + charBits;
      else charBits = "0" + charBits;
      num >>= 1;
    }
    out += charBits;
  }

  return out;
}

app.post("/", (req, res) => {
  const { text } = req.body;

  if (typeof text !== "string") {
    res.status(400).send({ message: "text sent should be string" });
    return;
  }

  sendDataToInterface({ type: "text", content: text });

  const encodedData = encode(text);

  sendDataToInterface({ type: "bits", content: encodedData });
  sendDataToReceptor({ bits: encodedData });

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
