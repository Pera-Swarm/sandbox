// default config
const config = {
    server: 'webservices.ceykod.com',
    port: 8883,
    path: '/mqtt',
    channel: 'v1',
    token: undefined
};

// check localstorage for updated config, if not use above config
const storedConfig = localStorage.getItem(document.location.origin + '.config');

window.isAuthenticated = localStorage.getItem(
    document.location.origim + 'isAuthenticated'
);
window.username = 'swarm_user';
window.password = 'swarm_usere15';

let resolvedConfig =
    storedConfig !== null && storedConfig !== undefined
        ? JSON.parse(storedConfig)
        : config;

// method to presist config data with localStorage
export const saveConfig = (data) => {
    localStorage.setItem(
        document.location.origin + '.config',
        JSON.stringify({ ...config, ...data })
    );
};

export function getCredentials() {
    const { token } = resolvedConfig;
    if (token !== undefined) {
        // decode the token
        return decodeKey(key);
    } else {
        return -1;
    }
}

export function saveCache(name, data) {
    const prevData = JSON.parse(
        localStorage.getItem(document.location.origin + `.${name}`)
    );
    if (prevData !== null && prevData !== undefined) {
        localStorage.setItem(
            document.location.origin + `.${name}`,
            JSON.stringify([...prevData, data])
        );
    } else {
        localStorage.setItem(
            document.location.origin + `.${name}`,
            JSON.stringify([data])
        );
    }
}

export default resolvedConfig;
