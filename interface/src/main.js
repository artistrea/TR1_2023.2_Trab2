const indicadorConexaoTransmissor = document.querySelector(
  "#indicador-conexao-transmissor"
);

// Subscribe to the event source at `uri` with exponential backoff reconnect.
function subscribe(uri, name) {
  // name: transmitter | receptor
  var retryTime = 1;

  function connect(uri) {
    const events = new EventSource(uri);

    events.addEventListener("message", (ev) => {
      console.log("raw data", JSON.stringify(ev.data));
      console.log("decoded data", JSON.stringify(JSON.parse(ev.data)));
      const msg = JSON.parse(ev.data);
      if (!"message" in msg || !"room" in msg || !"username" in msg) return;
      addMessage(msg.room, msg.username, msg.message, true);
    });

    events.addEventListener("open", () => {
      setConnectedStatus(name, true);
      console.log(`connected to event stream at ${uri}`);
      retryTime = 1;
    });

    events.addEventListener("error", () => {
      setConnectedStatus(name, false);
      events.close();

      let timeout = retryTime;
      retryTime = Math.min(64, retryTime * 2);
      console.log(`connection lost. attempting to reconnect in ${timeout}s`);
      setTimerValue(name, timeout);
      setTimeout(() => connect(uri), (() => timeout * 1000)());
    });
  }

  connect(uri);
}

function setTimerValue(name, value) {
  document
    .querySelector(`#${name}-connected-status`)
    .querySelector("[data-name='timer']").innerHTML = value;
}

function setConnectedStatus(name, isConnected) {
  // name: transmitter | receptor
  document
    .querySelector(`#${name}-connected-status`)
    .setAttribute("data-connected", isConnected);
}
// subscribe("/events", "transmitter");
