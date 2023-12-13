import { subscribe } from "../subscribe";

const transmitterBaseUrl =
  "https://6c7433451d78dd131024f093795f2976.serveo.net";
const receptorBaseUrl = "https://65b9bd9c22d030a7f77f89bb879f6840.serveo.net";

subscribe(`${transmitterBaseUrl}/subscribe-interface`, "transmitter");
subscribe(`${receptorBaseUrl}/subscribe-interface`, "receptor");

const textInput = document.querySelector("input#text-to-send");

document.querySelector("form#send-text-form").onsubmit = (e) => {
  e.preventDefault();
  fetch(`${transmitterBaseUrl}/`, {
    method: "POST",
    body: JSON.stringify({ text: textInput.value }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  });
};

// initial value by subscribe()
const encodingInput = document.querySelector("select#encoding-to-send");

encodingInput.onchange = (e) => {
  fetch(`${transmitterBaseUrl}/change-encoding`, {
    method: "POST",
    body: JSON.stringify({ encoding: e.target.value }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  });

  fetch(`${receptorBaseUrl}/change-encoding`, {
    method: "POST",
    body: JSON.stringify({ encoding: e.target.value }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  });
};
