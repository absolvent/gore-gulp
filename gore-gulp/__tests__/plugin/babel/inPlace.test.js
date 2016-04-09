/**
 * Copyright (c) 2016-present, goreutils
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

"use strict";

/* global after: false, before: false, describe: false, it: false */

const babel = require("../../../plugin/babel");
const config = require("../../config");
const fs = require("fs-extra");
const path = require("path");
const Promise = require("bluebird");
const rimraf = require("rimraf");
const tmp = require("tmp");

describe("babel/inPlace", function () {
    var distDir;

    this.timeout(config.timeout);

    after(function (done) {
        rimraf(distDir, done);
    });

    before(function () {
        return Promise.fromCallback(tmp.dir).then(createdPath => {
            distDir = createdPath;
        });
    });

    it("transforms js file in place and generates source map", function () {
        const src = path.resolve(__dirname, "../lint/__fixtures__/ecmaFeatures.jsx");
        const dest = path.resolve(distDir, "ecmaFeatures.jsx");

        return Promise.fromCallback(done => fs.copy(src, dest, done))
            .then(() => babel.inPlace(dest))
        ;
    });
});
