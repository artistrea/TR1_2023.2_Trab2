import express from "express";
import cors from "cors";
import { sendDataToInterface, subscribeInterface } from "./interfaceComms";
import { type EncodingType, decode, encodingSchema } from "./decode";
import { z } from "zod";
import { onReceivedText } from "./onReceivedText";

// config
const port = 3002;
let encoding: EncodingType = "NRZ-Polar";
let gBits: string | undefined;

// setup
const app = express();
app.use(express.json());
app.use(cors());

const bodySchema = z.object({
  bits: z.string().regex(/^(0|1)+$/, "String should contain only 1's and 0's"),
});

app.post("/", (req, res) => {
  const result = bodySchema.safeParse(req.body);

  if (!result.success) {
    const { error } = result;
    res.status(400).send({ message: error.flatten() });
    return;
  }

  const {
    data: { bits },
  } = result;
  gBits = bits;

  sendDataToInterface({ type: "bits", content: bits });

  const text = decode(bits, encoding);

  sendDataToInterface({ type: "text", content: text });

  // do something with decoded text.
  onReceivedText(text);

  res.status(200).send({ message: "yay" });
});

app.get("/subscribe-interface", (req, res) =>
  subscribeInterface(req, res, encoding)
);

app.post("/change-encoding", (req, res) => {
  const result = z.object({ encoding: encodingSchema }).safeParse(req.body);

  if (!result.success) {
    const { error } = result;
    res.status(400).send({ message: error.flatten() });
    return;
  }

  encoding = result.data.encoding;

  res.status(200).send();

  sendDataToInterface({ type: "encoding", content: encoding });

  if (gBits) {
    const text = decode(gBits, encoding);

    sendDataToInterface({ type: "text", content: text });
  }
});

app.listen(port, () => {
  console.log(`Receptor app listening on http://localhost:${port}`);
});
