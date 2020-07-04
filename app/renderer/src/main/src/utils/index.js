const fs = window.require('fs')
const crypto = window.require('crypto');

export const caculateFileHash = (buffer) => {
    const fsHash = crypto.createHash('md5');
    fsHash.update(buffer.toString());
    const hash = fsHash.digest('hex');
    return hash;
}

export const isSpecificImage = (path) => {
    const idx = path.lastIndexOf('.');
    const imageReg = /\.(jpg|png)$/i;
    if (idx >= 0 && imageReg.test(path)) {
        return true;
    }
    return false;
}

export const dirExist = (path) => {
    return fs.existsSync(path)
}

export const isFolder = (path) => {
    const idx = path.lastIndexOf('.');
    return idx === -1;
}

export function generatorGetters(state) {
    const getters = {};
    if (typeof state !== 'object' || state instanceof Array) return {};
    for (const key in state) {
        if (Object.prototype.hasOwnProperty.call(state,key)) {
            const name = key.replace(/([A-Z])/g, '_$1').toUpperCase();
            getters[name] = function(state) {
                return state[key];
            };
        }
    }
    return getters;
}