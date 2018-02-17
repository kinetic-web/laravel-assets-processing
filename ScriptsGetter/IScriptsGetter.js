'use strict';

class IScriptsGetter{
    GetDevScript(){
        throw new Error('Попытка обратиться к интерфейсу IScriptsGetter');
    }

    GetWatchScript(){
        throw new Error('Попытка обратиться к интерфейсу IScriptsGetter');
    }

    GetProdScript(){
        throw new Error('Попытка обратиться к интерфейсу IScriptsGetter');
    }
}

module.exports = IScriptsGetter;