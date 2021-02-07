
import HomePage from '../pages/home.f7.html';
import AboutPage from '../pages/about.f7.html';
import FormPage from '../pages/form.f7.html';
import CatalogPage from '../pages/catalog.f7.html';
import ProductPage from '../pages/product.f7.html';
import SettingsPage from '../pages/settings.f7.html';

import RobotPage from '../pages/sandbox_pages/robot.f7.html';
import CommunicationPage from '../pages/sandbox_pages/communication.f7.html';
import DistanceSensorPage from '../pages/sandbox_pages/distanceSensor.f7.html';

import DynamicRoutePage from '../pages/dynamic-route.f7.html';
import RequestAndLoad from '../pages/request-and-load.f7.html';
import NotFoundPage from '../pages/404.f7.html';

var routes = [

    {
        path: '/',
        component: HomePage,
    },
    {
        path: '/about/',
        component: AboutPage,
    },
    {
        name: 'robot',
        path: '/robot/',
        component: RobotPage,
    },
    {
        path: '/communication/',
        component: CommunicationPage,
    },
    {
        path: '/sensors/distance/',
        component: DistanceSensorPage,
    },
    {
        path: '/catalog/',
        component: CatalogPage,
    },
    {
        path: '/product/:id/',
        component: ProductPage,
    },
    {
        path: '/settings/',
        component: SettingsPage,
    },

    {
        path: '/dynamic-route/blog/:blogId/post/:postId/',
        component: DynamicRoutePage,
    },
    {
        path: '(.*)',
        component: NotFoundPage,
    },
];

export default routes;
