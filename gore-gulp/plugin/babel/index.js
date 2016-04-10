/**
 * Copyright (c) 2016-present, goreutils
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

"use strict";

const babel = require("babel-core");
const config = require("./config");
const fs = require("fs");
const Promise = require("bluebird");

function transformFile(filename) {
    return Promise.fromCallback(done => {
        return babel.transformFile(filename, config.create(), done);
    });
}

function inPlace(filename) {
    return transformFile(filename).then(function (result) {
        // const mapFilename = filename;
        return Promise.all([
            Promise.fromCallback(done => fs.writeFile(filename, result.code, done))
            // Promise.fromCallback(done => fs.writeFile(mapFilename, result.map, done))
        ]);
    });
}

module.exports = {
    inPlace: inPlace,
    transformFile: transformFile
};
