import Plotly from "plotly.js-dist-min";

const graphDiv = document.getElementById("graph");

function genCosUntil(n) {
  const x = [];
  const y = [];
  for (let i = 0; i < n; i++) {
    x.push(i / n);
    y.push(Math.cos((i * 2 * Math.PI) / n));
  }

  return { x, y };
}

let graphBits = "11110000";
let graphType = "8QAM";

/**
 * @param {string} data - bit sequence in string
 */
export function setGraphBits(data) {
  graphBits = data;
  replot();
}

/**
 * @param {"8QAM" | "outro la" | "o ultimo"} type
 */
export function setGraphType(type) {
  graphType = type;
  replot();
}

function replot() {
  const { x, y } = genCosUntil(300);

  Plotly.newPlot(
    graphDiv,
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
      yaxis: {
        fixedrange: true,
      },
    },
    {
      displaylogo: false,
    }
  );
}
