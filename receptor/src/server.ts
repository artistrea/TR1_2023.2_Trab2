import express from "express";
import cors from "cors";
import { sendDataToInterface, subscribeInterface } from "./InterfaceGUI/interfaceComms";
import { type EncodingType, decode, encodingSchema } from "./CamadaFisica/decode";
import { z } from "zod";
import { onReceivedText } from "./InterfaceGUI/onReceivedText";
import { textFromBits } from "./CamadaFisica/textFromBits";
import { checkEDC, checkHamming } from "./CamadaEnlace/checkErrorControl";
import {
  getFramesByBitCount,
  getFramesByCharCount,
} from "./CamadaEnlace/checkBitCounting";
import { EDC, frameLimiter } from "./config";
import { getFramesByInsertionFlag } from "./CamadaEnlace/byteRemove";

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
  
  sendDataToInterface({ type: "bits", content: decodedbits });
  
  let frames: string[] 
  if (frameLimiter === "count") {
    frames = getFramesByCharCount(decodedbits);
  } else {
    frames = getFramesByInsertionFlag(decodedbits);
  }

  if (EDC !== "hamming") {
    let actualEDC = EDC; // MALDITO TYPESCRIPT ME OBRIGANDO A FAZER GAMBIARRA

    frames = frames.map((frame) =>  checkEDC(frame, actualEDC));
  } else {
    frames = frames.map((frame) =>  checkHamming(frame));
  }

  const text = textFromBits(frames.join(""));

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
