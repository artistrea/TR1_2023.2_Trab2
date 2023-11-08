import { subscribe } from "./subscribe";
import Plotly from "plotly.js-dist-min";

const transmitterBaseUrl = "http://localhost:3001";

subscribe(`${transmitterBaseUrl}/subscribe-interface`, "transmitter");
subscribe("http://localhost:3002/subscribe-interface", "receptor");

const textInput = document.querySelector("input#text-to-send");

document.querySelector("form#send-text-form").onsubmit = (e) => {
  e.preventDefault();
  fetch(`${transmitterBaseUrl}/`, {
    method: "POST",
    body: JSON.stringify({ text: textInput.value }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then((response) => response.json())

    // Displaying results to console
    .then((json) => console.log(json));
};

const TESTER = document.getElementById("tester");

function genCosUntil(n) {
  const x = [];
  const y = [];
  for (let i = 0; i < n; i++) {
    x.push(i / n);
    y.push(Math.cos((i * 2 * Math.PI) / n));
  }

  return { x, y };
}

const { x, y } = genCosUntil(300);

Plotly.newPlot(
  TESTER,
  [
    {
      x,
      y,
    },
  ],
  {
    plot_bgcolor: "rgb(15 23 42 / 0.5)",
    paper_bgcolor: "rgb(15 23 42 / 0.5)",
    colorway: ["rgb(239 246 255)"],
    margin: { t: 0 },
    modebar: {
      color: "rgb(239 246 255 / 0.6)",
      remove: ["zoomIn2d", "zoomOut2d", "autoScale2d", "toImage"],
    },
    font: {
      color: "rgb(148 163 184)",
    },
    dragmode: "pan",
  },
  {
    displaylogo: false,
  }
);
