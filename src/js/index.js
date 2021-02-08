import $ from "jquery";

import MQTTClient from "./mqttClient.js";

// Common to all pages
var channel = "v1";

$(document).ready(function () {
  window.$ = $;
  $(".channel").text(channel);

  // Disable all buttons by default
  $(".btn").prop("disabled", true);
});

export function init() {
  $(".channel").text(channel);

  // Disable all buttons by default
  $(".btn").prop("disabled", true);
}
