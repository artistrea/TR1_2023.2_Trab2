import express from "express";
import cors from "cors";
import { z } from "zod";
import { sendDataToInterface, subscribeInterface } from "./interfaceComms";
import { encodingSchema, encode, type EncodingType } from "./encode";
import { sendDataToReceptor } from "./sendDataToReceptor";
import { bitsFromText } from "./bitsFromText";
import { ErrorControlType, addEDC, hamming } from "./errorControl";

// config:
const port = 3001;
const receptorBaseUrl = "http://localhost:3002";
let encoding: EncodingType = "NRZ-Polar";
let errorControl: ErrorControlType = "CRC";

// setup:
const app = express();
app.use(express.json());
app.use(cors());

const bodySchema = z.object({
  text: z
    .string()
    .regex(/^[\x00-\xFF]*$/, "Extended ascii only (1 byte chars only)"),
});

// endpoint for interface to ask text to be sent
app.post("/", (req, res) => {
  const result = bodySchema.safeParse(req.body);

  if (!result.success) {
    const { error } = result;
    res.status(400).send({ message: error.flatten() });
    return;
  }

  const {
    data: { text },
  } = result;
  sendDataToInterface({ type: "encoding", content: encoding });

  sendDataToInterface({ type: "text", content: text });

  const bits = bitsFromText(text);
  // const data = addEDC(bits, errorControl);
  const data = hamming(bits);
  
  sendDataToInterface({ type: "bits", content: data });



  const encodedData = encode(bits, encoding);
  sendDataToInterface({ type: "encoded-bits", content: encodedData });

  // ye
  sendDataToReceptor(
    { bits: encodedData, encoding: encoding },
    receptorBaseUrl
  );
  // yay
  res.status(200).send({ message: "yay" });
});

// endpoint for interface to be an observer and get updates

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
});

app.listen(port, () => {
  console.log(`Transmitter app listening on http://localhost:${port}`);
});
