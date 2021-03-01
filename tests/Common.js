
global.localStorage = {
    setItem(key, val) { this[key] = val + ''; },
    getItem(key) { return this[key]; }
}

global.fetch = async (requestInfo, init) => ({
    ok: !requestInfo.endsWith('/notOk'),
    async json() {
        return {
            requestInfo,
            init
        };
    }
});

global.window = {
    location: {
        href: ''
    }
}