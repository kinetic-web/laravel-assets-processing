"use strict";

const path = require('path');
const srcPath = require('./GetSrcPath');

class CFileLoaderName{
    static GetNameFromPath(filePath){
        let neededPathPart = '';

        let pos = filePath.indexOf('node_modules');
        if (pos >= 0)
            neededPathPart = path.join('vendor', filePath.substr(pos + 'node_modules'.length + 1));
        else {
            let assetsDirPath = path.resolve(srcPath, 'resources', 'assets');
            pos = filePath.indexOf(assetsDirPath);

            if (pos === 0)
                neededPathPart = filePath.substr(assetsDirPath.length + 1);
            else
                throw new Error('Неизвестное расположение ассета: '+filePath);
        }

        let arPathChunks = neededPathPart.split(path.sep);

        return path.join(path.sep, 'assets', arPathChunks.join(path.sep));
    }
}

module.exports = CFileLoaderName;