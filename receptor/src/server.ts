import express from "express";
import cors from "cors";
import { sendDataToInterface, subscribeInterface } from "./interfaceComms";
import { type EncodingType, decode, encodingSchema } from "./decode";
import { z } from "zod";
import { onReceivedText } from "./onReceivedText";
import { textFromBits } from "./textFromBits";

// config
const port = 3002;
let encoding: EncodingType = "NRZ-Polar";

// setup
const app = express();
app.use(express.json());
app.use(cors());

const bodySchema = z.object({
  bits: z
    .string()
    .regex(/^(0|1|v|V)+$/, "String should contain only 1,0,v and V"),
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

  sendDataToInterface({ type: "encoding", content: encoding });

  sendDataToInterface({ type: "encoded-bits", content: bits });


  let data = bits.slice(7,71);//slice(78,142)...
  //cuidado que nao esta verificando se o header esta certo
  //slice(0,6).parseToNumber() == Math.ceil(slice(7,71) / 32)

  

  const decodedbits = decode(data, encoding);

  sendDataToInterface({ type: "bits", content: decodedbits });

  const text = textFromBits(decodedbits);

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
});

app.listen(port, () => {
  console.log(`Receptor app listening on http://localhost:${port}`);
});
