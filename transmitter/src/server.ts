import express from "express";
import cors from "cors";
import { z } from "zod";
import {
  sendDataToInterface,
  subscribeInterface,
} from "./InterfaceGUI/interfaceComms";
import {
  encodingSchema,
  encode,
  type EncodingType,
} from "./CamadaFisica/encode";
import { sendDataToReceptor } from "./InterfaceGUI/sendDataToReceptor";
import { bitsFromText } from "./CamadaFisica/bitsFromText";
import { ErrorControlType, addEDC, hamming } from "./CamadaEnlace/errorControl";
import {
  addBitCount,
  addCharCount,
  addWordCount,
} from "./CamadaEnlace/bitCounting";
import { EDC, frameLimiter, frameSize } from "./config";
import { byteInsertion } from "./CamadaEnlace/byteInsertion";

// config:
const port = 3001;
const receptorBaseUrl = "http://localhost:3002";
let encoding: EncodingType = "NRZ-Polar";

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

  let bits = bitsFromText(text);

  const frameMatchingRegex = new RegExp(`.{1,${frameSize[EDC]}}`, "g");
  let frames: string[];

  if (EDC !== "hamming") {
    let actualEDC = EDC; // MALDITO TYPESCRIPT ME OBRIGANDO A FAZER GAMBIARRA

    frames =
      bits
        .match(frameMatchingRegex)
        ?.map((frame) =>
          addEDC(frame.padEnd(frameSize[EDC], "0"), actualEDC)
        ) || [];
  } else {
    frames =
      bits
        .match(frameMatchingRegex)
        ?.map((frame) => hamming(frame.padEnd(frameSize.hamming, "0"))) || [];
  }

  if (frameLimiter === "count") {
    frames = frames.map(addCharCount);
  } else {
    frames = frames.map(byteInsertion);
  }

  if (EDC === "hamming") {
    // !!!SIMULAÇÂO DE RUIDO PARA HAMMING!!!
    const noisePosition = 20;

    frames[0] =
      frames[0].slice(0, noisePosition - 1) +
      (frames[0].slice(noisePosition - 1, noisePosition) === "0" ? "1" : "0") +
      frames[0].slice(noisePosition);
  }

  bits = frames.join("");

  console.log("frames", frames);

  sendDataToInterface({ type: "bits", content: bits });

  const encodedData = encode(bits, encoding);
  sendDataToInterface({ type: "encoded-bits", content: encodedData });

  // ye
  sendDataToReceptor({ bits: encodedData }, receptorBaseUrl);
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
