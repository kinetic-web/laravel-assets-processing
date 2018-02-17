'use strict';

const CLinuxScriptsGetter   = require('./CLinuxScriptsGetter');
const CWindowsScriptsGetter = require('./CWindowsScriptsGetter');

class CScriptsGetterFactory{
    static BuildScriptsGetter(){
        switch (process.platform){
            case 'linux':
                return new CLinuxScriptsGetter();
            case 'win32':
                return new CWindowsScriptsGetter();
            default:
                throw new Error('Неизвестная платформа');
        }
    }
}

module.exports = CScriptsGetterFactory;