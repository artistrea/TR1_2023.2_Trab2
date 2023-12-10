import Plotly from "plotly.js-dist-min";
import { modulation } from "../CamadaFisica/modulator";

const chartDivs = {
  ASK: document.getElementById("ASK-chart"),
  FSK: document.getElementById("FSK-chart"),
  // can't start id with number
  QAM8: document.getElementById("QAM8-chart"),
};

let chartBits = "101100001000010011110111";
let chartTypes = ["QAM8", "ASK", "FSK"];

/**
 * @param {string} data - bit sequence in string
 */
export function setChartBits(data) {
  // [TODO]:
  chartBits = data;
  chartTypes.map((type) => replotFor(type));
}

/**
 * @param {"ASK" | "FSK" | "QAM8"} type
 */
function replotFor(type) {
  const chartDataDiv = document.querySelector(`#${type}-chart-data`);
  chartDataDiv.innerHTML = chartBits;

  const { x, y } = modulation(chartBits, type);
  Plotly.newPlot(
    chartDivs[type],
    [
      {
        x,
        y,
      },
    ],
    {
      title: `Modulação em ${type}`,
      plot_bgcolor: "rgb(15 23 42 / 0.5)",
      paper_bgcolor: "rgb(15 23 42 / 0.5)",
      colorway: ["rgb(239 246 255)"],
      margin: { t: 0 },
      modebar: {
        color: "rgb(239 246 255 / 0.6)",
        remove: ["zoomIn2d", "autoScale2d", "toImage"],
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
