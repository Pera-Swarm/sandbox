import $ from "dom7";
import Framework7 from "framework7/bundle";

import App from "../app.f7.html";

// Import F7 Styles
import "framework7/framework7-bundle.css";
// import 'bootstrap';

import routes from "./routes.js";
import index from "./index.js";
import MQTTClient from "./mqttClient.js";

// Import Icons and App Custom Styles
import "../css/icons.css";
import "../css/app.css";
import { init } from "../css/index.css";

// Import Routes

window.mqtt = new MQTTClient(() => {
  // $("#status").text("Trying to connect...");

  // Import main app component
  var app = new Framework7({
    name: "PeraSwarm Sandbox", // App name
    theme: "auto", // Automatic theme detection
    el: "#app", // App root element
    component: App, // App main component

    // App routes
    routes: routes,
    // Register service worker
    serviceWorker: {
      path: "/service-worker.js",
    },
  });
});
