import express from "express";
import type { Response } from "express-serve-static-core";

const port = 3001;

const app = express();

let interfaceClient: Response<any, Record<string, any>, number> | undefined;
let receptor: Response<any, Record<string, any>, number> | undefined;

app.get("/subscribe-interface", (request, response) => {
  const headers = {
    "Content-Type": "text/event-stream",
    Connection: "keep-alive",
    "Cache-Control": "no-cache",
  };
  response.writeHead(200, headers);

  const data = `data: ${JSON.stringify("opa")}\n\n`;

  response.write(data);

  if (interfaceClient) {
    interfaceClient.end();
    console.warn("A interfaceClient has been forcefully disconnected");
  }
  interfaceClient = response;

  // lost connection:
  request.on("close", () => {
    interfaceClient = undefined;
    console.log("Client disconnected");
  });
});

app.listen(port, () => {
  console.log(`Transmitter app listening on http://localhost:${port}`);
});
