import express from "express";
import cors from "cors";
import { sendDataToInterface, subscribeInterface } from "./interfaceComms";
import { decode, encodingSchema } from "./decode";
import { z } from "zod";
import { onReceivedText } from "./onReceivedText";

// config
const port = 3002;
const defaultEncoding = "hamming";

// setup
const app = express();
app.use(express.json());
app.use(cors());

const bodySchema = z.object({
  bits: z.string(),
  encoding: encodingSchema.optional(),
});

app.post("/", (req, res) => {
  const result = bodySchema.safeParse(req.body);

  if (!result.success) {
    const { error } = result;
    res.status(400).send({ message: error.flatten() });
    return;
  }

  const {
    data: { encoding, bits },
  } = result;

  sendDataToInterface({ type: "bits", content: bits });

  const data = decode(bits, encoding ?? defaultEncoding);

  sendDataToInterface({ type: "text", content: data });

  // do something with decoded data.
  onReceivedText(data);

  res.status(200).send({ message: "yay" });
});

app.get("/subscribe-interface", subscribeInterface);

app.listen(port, () => {
  console.log(`Receptor app listening on http://localhost:${port}`);
});
