/**
 * Copyright (c) 2015-present, goreutils
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

"use strict";

/*global beforeEach: false, describe: false, it: false */

var path = require("path"),
    _ = require("lodash"),
    assert = require("chai").assert,
    defaults = require(path.join(__dirname, "..", "..", "defaults")),
    FS = require("q-io/fs"),
    Q = require("q"),
    tmp = require("tmp"),
    webpack = require(path.join(__dirname, "..", "..", "webpack"));

describe("webpack", function () {
    var tmpDir;

    beforeEach(function (done) {
        tmp.dir(function (err, generatedTmpDir) {
            if (err) {
                done(err);
            } else {
                tmpDir = generatedTmpDir;

                done();
            }
        });
    });

    it("generates output using .entry." + defaults.ecmaScriptFileExtensionsGlobPattern + " files", function (done) {
        var baseDir = path.join(__dirname, "__fixtures__", "test-library-1"),
            distDir = path.join(tmpDir, "dist"),
            pckgPromise;

        pckgPromise = FS.read(path.join(baseDir, "package.json"))
            .then(function (pckgContents) {
                return JSON.parse(pckgContents);
            })
            .then(function (pckg) {
                return _.merge(pckg, {
                    "directories": {
                        "dist": distDir
                    }
                });
            });

        webpack.full(baseDir, pckgPromise)()
            .then(function () {
                var paths;

                paths = [
                    path.join(distDir, "test-fixture-example.common.min.js"),
                    path.join(distDir, "test-fixture-example.common.min.js.map"),
                    path.join(distDir, "test-fixture-example.module.min.js"),
                    path.join(distDir, "test-fixture-example.module.min.js.map"),
                    path.join(distDir, "test-fixture-example.test.min.js"),
                    path.join(distDir, "test-fixture-example.test.min.js.map")
                ].map(function (pth) {
                    return FS.isFile(pth).then(function (isFile) {
                        assert.ok(isFile, pth);
                    });
                });

                return Q.all(paths);
            })
            .then(function () {
                done();
            })
            .catch(done);
    });
});
