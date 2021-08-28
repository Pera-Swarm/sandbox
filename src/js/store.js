import { createStore } from 'framework7';
import axios from 'axios';
import config, { saveConfig } from './config';

const defaultConfig = {
    server: 'webservices.ceykod.com',
    port: 8883,
    path: '/mqtt',
    channel: 'v1',
    token: undefined
};

const storedConfig = JSON.parse(
    localStorage.getItem(document.location.origin + '.config')
);

console.log(storedConfig);

const store = createStore({
    state: {
        loading: false,
        logs: [],
        token: config.token,
        config:
            storedConfig !== null && storedConfig !== undefined
                ? storedConfig
                : defaultConfig
    },
    actions: {
        saveConfig({ state }, data) {
            state.loading = true;
            setTimeout(() => {
                localStorage.setItem(
                    document.location.origin + `.config`,
                    JSON.stringify(
                        !!data
                            ? { ...state.config, ...data, path: '/mqtt' }
                            : defaultConfig
                    )
                );
                state.loading = false;
            }, 1000);
        },
        resetConfig({ state }) {
            state.loading = true;
            setTimeout(() => {
                localStorage.setItem(
                    document.location.origin + `.config`,
                    JSON.stringify(defaultConfig)
                );
                state.loading = false;
            }, 1000);
        },
        getLogs({ state }) {
            state.loading = true;
            setTimeout(() => {
                state.logs = JSON.parse(
                    localStorage.getItem(document.location.origin + `.cache`)
                );
                state.loading = false;
            }, 1000);
        },
        clearLogs({ state }) {
            state.loading = true;
            setTimeout(() => {
                localStorage.setItem(
                    document.location.origin + `.cache`,
                    JSON.stringify([])
                );
                state.loading = false;
            }, 1000);
        },
        createToken({ state, dispatch }) {
            state.loading = true;
            if (!(window.username === undefined || window.password === undefined)) {
                axios
                    .post(
                        'https://webservices.ceykod.com/pera-swarm/login/',
                        {
                            user: window.username,
                            pass: window.password,
                            host: config.server,
                            port: config.port,
                            path: config.path
                        },
                        {
                            headers: {
                                'Access-Control-Allow-Origin': true
                            }
                        }
                    )
                    .then(
                        (response) => {
                            console.log(response);
                            const token = response.data.token.toString();
                            dispatch('saveConfig', { token });
                            state.loading = false;
                        },
                        (error) => {
                            console.log(error);
                            state.loading = false;
                            localStorage.setItem(
                                document.location.origin + '.isAuthenticated',
                                JSON.stringify(false)
                            );
                            window.isAuthenticated = false;
                        }
                    );
            } else {
                localStorage.setItem(
                    document.location.origin + '.isAuthenticated',
                    JSON.stringify(false)
                );
                window.isAuthenticated = false;
            }
        }
    },
    getters: {
        loading({ state }) {
            return state.loading;
        },
        logs({ state }) {
            return state.logs;
        },
        config({ state }) {
            return state.config;
        },
        token({ state }) {
            return state.token;
        }
    }
});

export default store;
