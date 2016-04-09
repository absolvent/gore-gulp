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
const replaceExt = require("replace-ext");

function inPlace(filename) {
    return Promise.fromCallback(done => {
        return babel.transformFile(filename, config, done);
    }).then(function (result) {
        const mapFilename = replaceExt(filename, ".map.min.js");

        return Promise.all([
            Promise.fromCallback(done => fs.writeFile(filename, result.code, done)),
            Promise.fromCallback(done => fs.writeFile(mapFilename, result.map, done))
        ]);
    });
}

module.exports = {
    inPlace: inPlace
};
