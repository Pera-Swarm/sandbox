import HomePage from '../pages/home.f7.html';
import LoginPage from '../pages/login.f7.html';

import RobotPage from '../pages/sandbox_pages/robot.f7.html';
import CommunicationPage from '../pages/sandbox_pages/communication.f7.html';
import DistanceSensorPage from '../pages/sandbox_pages/distanceSensor.f7.html';

import ColorSensorPage from '../pages/sandbox_pages/colorSensor.f7.html';
import EnvironmentPage from '../pages/sandbox_pages/environment.f7.html';
import NeoPixelPage from '../pages/sandbox_pages/neoPixel.f7.html';

import NotFoundPage from '../pages/404.f7.html';

function checkAuth({ to, from, resolve, reject }) {
    console.log('checkAuth');
    /* some condition to check user is logged in */
    if (JSON.parse(localStorage.getItem('isAuthenticated')) !== null) {
        resolve();
    } else {
        reject();
    }
}

function checkPermission({ to, from, resolve, reject }) {
    console.log('checkPermission');
    /* some condition to check user edit permission */
    if (JSON.parse(localStorage.getItem('isAuthenticated')) !== null) {
        resolve();
    } else {
        reject();
    }
}

var routes = [
    {
        name: 'home',
        path: '/',
        component: HomePage
        // beforeEnter: checkAuth,
        // redirect: function ({ to, resolve, reject }) {
        //     // if we have "user" query parameter
        //     console.log('redirect');
        //     if (to.query.user) {
        //         // redirect to such url
        //         resolve('/login' + to.query.user);
        //     }
        //     // otherwise do nothing
        //     else reject();
        // }
    },
    // {
    //     name: 'login',
    //     path: '/login',
    //     component: LoginPage
    // },
    {
        name: 'robot',
        path: '/robot/',
        component: RobotPage
    },
    {
        path: '/communication/',
        component: CommunicationPage
    },
    {
        path: '/neoPixel/',
        component: NeoPixelPage
    },
    {
        path: '/environment/',
        component: EnvironmentPage
    },
    {
        path: '/sensors/distance/',
        component: DistanceSensorPage
    },
    {
        path: '/sensors/color/',
        component: ColorSensorPage
    },
    {
        path: '(.*)',
        component: NotFoundPage
    }
];

export default routes;
