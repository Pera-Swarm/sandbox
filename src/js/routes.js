import HomePage from '../pages/home.f7.html';

import App from '../pages/sandbox_pages/app.f7.html';
import RobotPage from '../pages/sandbox_pages/robot.f7.html';
import CommunicationPage from '../pages/sandbox_pages/communication.f7.html';
import DistanceSensorPage from '../pages/sandbox_pages/distanceSensor.f7.html';

import ColorSensorPage from '../pages/sandbox_pages/colorSensor.f7.html';
import EnvironmentPage from '../pages/sandbox_pages/environment.f7.html';
import NeoPixelPage from '../pages/sandbox_pages/neoPixel.f7.html';
import CachePage from '../pages/sandbox_pages/cache.f7.html';

import NotFoundPage from '../pages/404.f7.html';

function checkAuth({ resolve, reject }) {
    /* some condition to check user is logged in */
    const isAuthenticated =
        JSON.parse(localStorage.getItem(document.location.origin + '.isAuthenticated')) ||
        window.mqtt.client.isConnected() ||
        false;
    console.log(
        'checkAuth',
        isAuthenticated,
        window.mqtt,
        window.mqtt.client.isConnected()
    );
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
        name: 'home',
        redirect: function ({ app, resolve, reject, from }) {
            let notificationToast;
            // check authentication
            if (checkAuth({ resolve, reject })) {
                // redirect to settings route
                notificationToast = app.toast.create({
                    text:
                        'You are currently connected to a session and be carefult if you wish to change settings while in a session!',
                    closeTimeout: 2000
                });
                notificationToast.open();
                resolve('/app');
            } else {
                // otherwise display not connected alert!
                notificationToast = app.toast.create({
                    text:
                        'You are not connected to a session! Please make sure to enter the credentials to start a session.',
                    closeTimeout: 2000
                });
                notificationToast.open();
                resolve('/app');
            }
        }
    },
    {
        path: '/',
        name: 'settings',
        component: HomePage
    },
    {
        path: '/app',
        name: 'app',
        component: App
    },
    {
        path: '/robot/',
        name: 'robot',
        component: RobotPage,
        beforeEnter: function ({ resolve, reject }) {
            if (checkAuth({ resolve, reject })) {
                resolve();
            } else {
                // don't allow to visit this page for unauthenticated users
                reject();
            }
        }
    },
    {
        path: '/communication/',
        component: CommunicationPage,
        beforeEnter: function ({ resolve, reject }) {
            if (checkAuth({ resolve, reject })) {
                resolve();
            } else {
                // don't allow to visit this page for unauthenticated users
                reject();
            }
        }
    },
    {
        path: '/neoPixel/',
        component: NeoPixelPage,
        beforeEnter: function ({ resolve, reject }) {
            if (checkAuth({ resolve, reject })) {
                resolve();
            } else {
                // don't allow to visit this page for unauthenticated users
                reject();
            }
        }
    },
    {
        path: '/environment/',
        component: EnvironmentPage,
        beforeEnter: function ({ resolve, reject }) {
            if (checkAuth({ resolve, reject })) {
                resolve();
            } else {
                // don't allow to visit this page for unauthenticated users
                reject();
            }
        }
    },
    {
        path: '/sensors/distance/',
        component: DistanceSensorPage,
        beforeEnter: function ({ resolve, reject }) {
            if (checkAuth({ resolve, reject })) {
                resolve();
            } else {
                // don't allow to visit this page for unauthenticated users
                reject();
            }
        }
    },
    {
        path: '/sensors/color/',
        component: ColorSensorPage,
        beforeEnter: function ({ resolve, reject }) {
            if (checkAuth({ resolve, reject })) {
                resolve();
            } else {
                // don't allow to visit this page for unauthenticated users
                reject();
            }
        }
    },
    {
        path: '/cache/',
        component: CachePage
    },
    {
        path: '(.*)',
        component: NotFoundPage
    }
];

export default routes;
