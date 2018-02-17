'use strict';

const IScriptsGetter = require('./IScriptsGetter');

class CLinuxScriptsGetter extends IScriptsGetter{
    GetDevScript(){
        return 'NODE_ENV=development webpack --display-modules --display-reasons'
    }

    GetWatchScript(){
        return 'NODE_ENV=development-watch webpack --display-modules --display-reasons'
    }

    GetProdScript(){
        return 'NODE_ENV=production webpack --json > stats.json'
    }
}

module.exports = CLinuxScriptsGetter;