"use strict";

const fs = require('fs');
const os = require('os');
const path = require('path');
const md5File = require('md5-file');

class CVersioner{
    constructor(strManifestFilePath, strAssetsDirPath, strPublicPath){
        if (!fs.existsSync(path.dirname(strManifestFilePath)) ||
            !fs.existsSync(strAssetsDirPath) ||
            !fs.statSync(strAssetsDirPath).isDirectory() ||
            !fs.existsSync(strPublicPath) ||
            !fs.statSync(strPublicPath).isDirectory())
        {
            throw new Error('Некорректно задан путь к манифесту или к папке с ассетами или к папке public');
        }

        this.strManifestFilePath = strManifestFilePath;
        this.strAssetsDirPath = strAssetsDirPath;
        this.strPublicPath = strPublicPath;
    }

    __ProcessFile(strFilePath, objManifest){
        let hash = md5File.sync(strFilePath).substr(0, 16);

        if (strFilePath.indexOf(this.strPublicPath) !== 0)
            throw new Error('Несоответствие папки с ассетами и папки public');

        let fileUrl = strFilePath.substr(this.strPublicPath.length);
        let versionUrl = fileUrl+'?'+hash;

        objManifest[fileUrl] = versionUrl;
    }

    __ProcessDir(strDirPath, objManifest){
        let arFileNames = fs.readdirSync(strDirPath);

        for (let index in arFileNames) if (arFileNames.hasOwnProperty(index)) {
            let currentFileName = path.join(strDirPath, arFileNames[index]);

            if (fs.statSync(currentFileName).isDirectory())
                this.__ProcessDir(currentFileName, objManifest);
            else
                this.__ProcessFile(currentFileName, objManifest);
        }
    }

    __WriteManifest(objManifest){
        let file = fs.openSync(this.strManifestFilePath, 'w');

        fs.writeSync(file, '<?php'+os.EOL);
        fs.writeSync(file, 'return ['+os.EOL);

        for (let currentFileName in objManifest) if (objManifest.hasOwnProperty(currentFileName)){
            let fileNameWithParam = objManifest[currentFileName];

            fs.writeSync(file, "'"+currentFileName+"' => '"+fileNameWithParam+"',"+os.EOL);
        }

        fs.writeSync(file, '];');

        fs.closeSync(file, file);
    }

    CreateVersionManifest(){
        let objManifest = {};
        this.__ProcessDir(this.strAssetsDirPath, objManifest);

        this.__WriteManifest(objManifest);
    }
}

module.exports = CVersioner;