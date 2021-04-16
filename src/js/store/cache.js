import { createStore } from 'framework7';
import axios from 'axios';
import { saveConfig } from '../config';
import config from '../config';

const store = createStore({
    state: {
        loading: false,
        logs: [],
        token: config.token
    },
    actions: {
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
        createToken({ state }) {
            state.loading = true;
            axios
                .post('http://webservices.ceykod.com/pera-swarm/login/', {
                    user: window.username,
                    pass: window.password,
                    host: config.server,
                    port: config.port,
                    path: config.path
                })
                .then(
                    (response) => {
                        console.log(response);
                        // TODO:
                        // const token = response.data.token;
                        // saveConfig(token);
                        // localStorage.setItem(
                        //     document.location.origin + `.cache`,
                        //     JSON.stringify([])
                        // );
                        state.loading = false;
                    },
                    (error) => {
                        console.log(error);
                        state.loading = false;
                    }
                );
        }
    },
    getters: {
        loading({ state }) {
            return state.loading;
        },
        logs({ state }) {
            return state.logs;
        },
        token({ state }) {
            return state.token;
        }
    }
});

export default store;
