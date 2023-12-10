import express from "express";
import cors from "cors";
import { sendDataToInterface, subscribeInterface } from "./interfaceComms";
import { type EncodingType, decode, encodingSchema } from "./Física/decode";
import { z } from "zod";
import { onReceivedText } from "./onReceivedText";
import { textFromBits } from "./Física/textFromBits";
import { checkEDC, checkHamming } from "./Enlace/checkErrorControl";
import {
  checkBitCount,
  checkCharCount,
  checkWordCount,
} from "./Enlace/checkBitCounting";

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
    .regex(/^(0|1|v|V|M)+$/, "String should contain only 1,0,v and V"),
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

  const decodedbits = decode(bits, encoding);

  //let data = checkBitCount(decodedbits);
  // let data = checkCharCount(decodedbits);
  let data = checkWordCount(decodedbits);

  // !!!SIMULAÇÂo DE RUIDO PARA HAMMING!!!
  
  // const noisePosition = 20;
  // data = data.slice(0,noisePosition-1)+
  //       ((data.slice(noisePosition-1,noisePosition)==='0')? "1":"0")+
  //       data.slice(noisePosition)

  //data = checkEDC(data, "CRC");
  data = checkHamming(data);

  sendDataToInterface({ type: "bits", content: decodedbits });
  // sendDataToInterface({ type: "bits", content: data });

  const text = textFromBits(data);

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
