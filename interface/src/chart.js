import Plotly from "plotly.js-dist-min";

const graphDiv = document.getElementById("graph");

function cossine(precision, freq=1) {
  const xt = [];
  const yt = [];
  for (let i = 0; i < precision; i++) {
    xt.push(i / precision);
    yt.push(Math.cos((i * 2 * Math.PI * freq) / precision));
  }

  return { xt, yt };
}

function sine(precision, freq=1) {
  const xt = [];
  const yt = [];
  for (let i = 0; i < precision; i++) {
    xt.push(i / precision);
    yt.push(Math.sin((i * 2 * Math.PI * freq) / precision));
  }
  return { xt, yt };
}

function modulation(graphBits = "10110001", graphType="FSK") {
  const { xt, yt } = sine(300);
  const {xt: xt_05, yt: yt_05} = sine(300,2);
  const x = []
  const y = []
  switch(graphType) {
    case("ASK"):
    for (let i = 0; i < graphBits.length; i++) {
      x.push(...xt.map((x)=>x+i))
      y.push(...yt.map((y)=> graphBits[i] === '1' ? y : y))
    }
    break;
    case("FSK"):
    for (let i = 0; i < graphBits.length; i++) {
        x.push(...(graphBits[i] === '1' ? xt_05 : xt).map((x)=>x+i))
        y.push(...(graphBits[i] === '1' ? yt_05 : yt))
      }
    break;
    case("8QAM"):
      while(graphBits.length % 3 != 0) graphBits += 0 // garantir que temos simbolos completos
      for (let i = 0; i < graphBits.length; i+=3) {
        switch(graphBits.slice(i,i+3)){
          case("000"):
          x.push(...xt.map((x)=>x+i))
          y.push(...yt.map((y)=>y/2))
          break;
        }
      }
    break;


  }

  return { x, y }
}

let graphBits = "10110001";
let graphType = "8QAM";

/**
 * @param {string} data - bit sequence in string
 */
export function setGraphBits(data) {
  graphBits = data;
  replot();
}

/**
 * @param {"ASK" | "FSK" | "8QAM"} type
 */
export function setGraphType(type) {
  graphType = type;
  replot();
}

function replot() {
  const {x, y} = modulation()
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
