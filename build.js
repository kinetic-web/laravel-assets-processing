'use strict';
const path = require('path');

const child_process = require('child_process');
const execSync = child_process.execSync;

const CScriptsGetterFactory = require('./ScriptsGetter/CScriptsGetterFactory');

/** @member IScriptsGetter */
let objScriptsGetter = CScriptsGetterFactory.BuildScriptsGetter();

const TYPE_DEV   = '--dev';
const TYPE_WATCH = '--watch';
const TYPE_PROD  = '--prod';

let buildType = null;

process.argv.forEach(function (val) {
    if ((val === TYPE_DEV) || (val === TYPE_WATCH) || (val === TYPE_PROD)){
        if (buildType === null)
            buildType = val;
        else
            throw new Error('необходимо указывать только один тип сборки');
    }
});

if (buildType === null)
    throw new Error('Необходимо указать тип сборки');

switch (buildType){
    case TYPE_DEV:
        execSync(objScriptsGetter.GetDevScript(), {
            stdio: 'inherit'
        });
        break;
    case TYPE_WATCH:
        execSync(objScriptsGetter.GetWatchScript(), {
            stdio: 'inherit'
        });
        break;
    case TYPE_PROD:
        execSync(objScriptsGetter.GetProdScript(), {
            stdio: 'inherit'
        });
        break;
}

let postBuildScriptPath = path.join(__dirname, 'post_build.js');
execSync('node '+postBuildScriptPath, {
    stdio: 'inherit'
});
