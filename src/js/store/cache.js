import { createStore } from 'framework7';

const store = createStore({
  state: {
    loading: false,
    logs: [],
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
  },
  getters: {
    loading({ state }) {
      return state.loading;
    },
    logs({ state }) {
      return state.logs;
    },
  },
});

export default store;
