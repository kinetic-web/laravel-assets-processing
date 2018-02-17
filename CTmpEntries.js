"use strict";

const processing_list = require('./processing_list.js');
const arEntries = processing_list.arEntries;
const arProvidedVariables = processing_list.arProvidedVariables;

const fs = require('fs');
const os = require('os');
const path = require('path');
const srcPath = require('./GetSrcPath');

class CTmpEntries{
    static __RecursiveRmDir(strDirPath) {
        if (fs.existsSync(strDirPath)) {
            let arFileNames = fs.readdirSync(strDirPath);

            for (let index in arFileNames) if (arFileNames.hasOwnProperty(index)) {
                let strFilePath = path.join(strDirPath, arFileNames[index]);
                let fileStat = fs.statSync(strFilePath);

                if (fileStat.isDirectory())
                    CTmpEntries.__RecursiveRmDir(strFilePath);
                else
                    fs.unlinkSync(strFilePath)
            }

            fs.rmdirSync(strDirPath);
        }
    };

    static GetTmpEntriesList(){
        let result = {};

        let tmpDirPath = path.join(srcPath, 'resources', 'assets', 'build_tmp');
        if (!fs.existsSync(tmpDirPath))
            fs.mkdirSync(tmpDirPath);

        for (let entriesIndex in arEntries) if (arEntries.hasOwnProperty(entriesIndex)){
            let arSections = arEntries[entriesIndex].split('.');
            let strSectionsAsPath = '';

            let levelsCount = 0;
            let currentLevel = tmpDirPath;

            for (let sectionsIndex in arSections) if (arSections.hasOwnProperty(sectionsIndex)){
                levelsCount++;

                strSectionsAsPath = path.join(strSectionsAsPath, arSections[sectionsIndex]);

                currentLevel = path.join(currentLevel, arSections[sectionsIndex]);
                if (!fs.existsSync(currentLevel))
                    fs.mkdirSync(currentLevel);
            }

            let cssEntryPath = path.join('css', strSectionsAsPath, 'entry.js');
            let jsEntryPath  = path.join('js',  strSectionsAsPath, 'entry.js');
            for (levelsCount += 1; levelsCount > 0; levelsCount--){
                cssEntryPath = path.join('..', cssEntryPath);
                jsEntryPath = path.join('..', jsEntryPath);
            }

            let webpackEntryName = arSections.join('_');
            result[webpackEntryName] = '.' + path.sep + path.join('build_tmp', strSectionsAsPath, 'index.js');

            let filePath = path.join(currentLevel, 'index.js');
            let file = fs.openSync(filePath, 'w');
            fs.writeSync(file, 'require("' + cssEntryPath + '");' + os.EOL);
            fs.writeSync(file, 'require("' + jsEntryPath  + '");' + os.EOL);
            fs.closeSync(file);
        }

        return result;
    }

    static GetProvidedVariables(){
        return arProvidedVariables;
    }

    static FreeTmpEntries(){
        let tmpDirPath = path.join(srcPath, 'resources', 'assets', 'build_tmp');
        CTmpEntries.__RecursiveRmDir(tmpDirPath);
    }
}

module.exports = CTmpEntries;