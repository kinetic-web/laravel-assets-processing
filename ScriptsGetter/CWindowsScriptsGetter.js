'use strict';

const IScriptsGetter = require('./IScriptsGetter');

class CWindowsScriptsGetter extends IScriptsGetter{
    GetDevScript(){
        return 'set NODE_ENV=development && webpack --display-modules --display-reasons'
    }

    GetWatchScript(){
        return 'set NODE_ENV=development-watch && webpack --display-modules --display-reasons'
    }

    GetProdScript(){
        return 'set NODE_ENV=production && webpack --json > stats.json'
    }
}

module.exports = CWindowsScriptsGetter;