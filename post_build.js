'use strict';
const path = require('path');
const srcPath = require('./GetSrcPath');

const CTmpEntries = require('./CTmpEntries');
const CVersioner = require('./CVersioner');

CTmpEntries.FreeTmpEntries();

let manifestFilePath = path.resolve(srcPath, 'version_manifest.php');
let assetsDirPath = path.resolve(srcPath, 'public', 'assets');
let publicPath = path.resolve(srcPath, 'public');

let objVersioner = new CVersioner(manifestFilePath, assetsDirPath, publicPath);
objVersioner.CreateVersionManifest();