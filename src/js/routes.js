import HomePage from "../pages/home.f7.html";

import RobotPage from "../pages/sandbox_pages/robot.f7.html";
import CommunicationPage from "../pages/sandbox_pages/communication.f7.html";
import DistanceSensorPage from "../pages/sandbox_pages/distanceSensor.f7.html";

import ColorSensorPage from "../pages/sandbox_pages/colorSensor.f7.html";
import EnvironmentPage from "../pages/sandbox_pages/environment.f7.html";
import NeoPixelPage from "../pages/sandbox_pages/neoPixel.f7.html";

import NotFoundPage from "../pages/404.f7.html";

var routes = [
  {
    path: "/",
    component: HomePage,
  },
  {
    name: "robot",
    path: "/robot/",
    component: RobotPage,
  },
  {
    path: "/communication/",
    component: CommunicationPage,
  },
  {
    path: "/neoPixel/",
    component: NeoPixelPage,
  },
  {
    path: "/environment/",
    component: EnvironmentPage,
  },
  {
    path: "/sensors/distance/",
    component: DistanceSensorPage,
  },
  {
    path: "/sensors/color/",
    component: ColorSensorPage,
  },
  {
    path: "(.*)",
    component: NotFoundPage,
  },
];

export default routes;
