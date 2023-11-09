import express from "express";
import cors from "cors";
import { z } from "zod";
import { sendDataToInterface, subscribeInterface } from "./interfaceComms";
import { encodingSchema, encode } from "./encode";
import { sendDataToReceptor } from "./sendDataToReceptor";

// config:
const port = 3001;
const receptorBaseUrl = "http://localhost:3002";
const defaultEncoding = "hamming";

// setup:
const app = express();
app.use(express.json());
app.use(cors());

const bodySchema = z.object({
  text: z.string(),
  encoding: encodingSchema.optional(),
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
    data: { encoding, text },
  } = result;
  sendDataToInterface({ type: "text", content: text });

  const encodedData = encode(text, encoding ?? defaultEncoding);
  sendDataToInterface({ type: "bits", content: encodedData });

  // ye
  sendDataToReceptor(
    { bits: encodedData, encoding: encoding ?? defaultEncoding },
    receptorBaseUrl
  );
  // yay
  res.status(200).send({ message: "yay" });
});

// endpoint for interface to be an observer and get updates
app.get("/subscribe-interface", subscribeInterface);

app.listen(port, () => {
  console.log(`Transmitter app listening on http://localhost:${port}`);
});
