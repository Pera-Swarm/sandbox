import HomePage from '../pages/home.f7.html';
import LoginPage from '../pages/login.f7.html';

import RobotPage from '../pages/sandbox_pages/robot.f7.html';
import CommunicationPage from '../pages/sandbox_pages/communication.f7.html';
import DistanceSensorPage from '../pages/sandbox_pages/distanceSensor.f7.html';

import ColorSensorPage from '../pages/sandbox_pages/colorSensor.f7.html';
import EnvironmentPage from '../pages/sandbox_pages/environment.f7.html';
import NeoPixelPage from '../pages/sandbox_pages/neoPixel.f7.html';

import NotFoundPage from '../pages/404.f7.html';

function checkAuth({ to, resolve, reject }) {
    /* some condition to check user is logged in */
    const isAuthenticated = JSON.parse(localStorage.getItem('isAuthenticated'));
    console.log('checkAuth', to, isAuthenticated);
    if (isAuthenticated !== null && isAuthenticated) {
        // resolve(to.url);
        return true;
    } else {
        // reject();
        return false;
    }
}

function checkPermission({ to, from, resolve, reject }) {
    /* some condition to check user edit permission */
    const isAuthenticated = JSON.parse(localStorage.getItem('isAuthenticated'));
    console.log('checkPermission');
    if (isAuthenticated !== null && isAuthenticated) {
        resolve();
    } else {
        reject();
    }
}

var routes = [
    {
        path: '/',
        name: 'app',
        redirect: function ({ to, resolve, reject }) {
            // if we have "user" query parameter
            console.log('REDIRECT', to);
            // if (to.query.user) {
            if (checkAuth({ to, resolve, reject })) {
                // redirect to such url
                resolve('/settings');
            } else {
                // otherwise do nothing
                resolve('/login');
            }
        }
    },
    {
        path: '/settings',
        name: 'settings',
        component: HomePage
    },
    {
        path: '/login',
        name: 'login',
        component: LoginPage
    },
    {
        path: '/robot/',
        name: 'robot',
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
