import { subscribe } from "./subscribe";

const transmitterBaseUrl = "http://localhost:3001";

subscribe(`${transmitterBaseUrl}/subscribe-interface`, "transmitter");
// subscribe("http://localhost:3002/subscribe-interface", "receptor");

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
