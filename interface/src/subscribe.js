import { setChartBits } from "./chart";








/**
 * @param {{
 *      type: "connected",
 *      startEncoding: string
 *    }
 *  | {
 *      type: "text";
 *      content: string;
 *    }
 *  | {
 *      type: "bits";
 *      content: string;
 *    }
 *  | {
 *      type: "encoding";
 *      content: string;
 *  }} data
 **/
function listenToMessage(data, name) {
  console.warn("warning: ", data);
  const { type, content, startEncoding } = data;

  if (type === "connected") {
    setEncoding(name, startEncoding);
  }
  if (type === "text") setText(name, content);
  if (type === "bits") setBits(name, content);
  if (type === "encoding") setEncoding(name, content);
}

/**
 * Subscribe to the event source at `uri` with exponential backoff reconnect.
 * @param {string} uri
 * @param {"transmitter" | "receptor"} name
 **/
export function subscribe(uri, name) {
  var retryTime = 1;

  function connect(uri) {
    const events = new EventSource(uri);

    events.addEventListener("message", (ev) =>
      listenToMessage(JSON.parse(ev.data), name)
    );

    events.addEventListener("open", () => {
      setConnectedStatus(name, true);
      console.log(`connected to event stream at ${uri} by ${name}`);
      retryTime = 1;
    });

    events.addEventListener("error", () => {
      setConnectedStatus(name, false);
      events.close();

      let timeout = retryTime;
      retryTime = Math.min(64, retryTime * 2);
      setTimerValue(name, timeout);
      setTimeout(() => connect(uri), timeout * 1000);
    });
  }

  connect(uri);
}

/**
 * @param {"transmitter" | "receptor"} name
 **/
function setTimerValue(name, value) {
  document
    .querySelector(`#${name}-connected-status`)
    .querySelector("[data-name='timer']").innerHTML = value;
}

/**
 * @param {"transmitter" | "receptor"} name
 * @param {string} content
 **/
function setText(name, content) {
  document.querySelector(`#${name}-text`).innerHTML = content;
}

/**
 * @param {"transmitter" | "receptor"} name
 * @param {string} content
 **/
function setEncoding(name, content) {
  document.querySelector(`#${name}-encoding`).innerHTML = content;
}

/**
 * @param {"transmitter" | "receptor"} name
 * @param {string} content
 **/
function setBits(name, content) {
  if (name === "transmitter") setChartBits(content);

  document.querySelector(`#${name}-bits`).innerHTML = content;
}

/**
 * @param {"transmitter" | "receptor"} name
 * @param {boolean} isConnected
 **/
function setConnectedStatus(name, isConnected) {
  document
    .querySelector(`#${name}-connected-status`)
    .setAttribute("data-connected", isConnected);
}
