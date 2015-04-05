/**
 * Copyright (c) 2015-present, goreutils
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

"use strict";

/*eslint no-sync: 0 */
/*global beforeEach: false, describe: false, it: false */

var path = require("path"),
    assert = require("chai").assert,
    defaults = require(path.join(__dirname, "..", "..", "defaults")),
    fs = require("fs"),
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
        webpack.full(defaults, path.join(__dirname, "__fixtures__"))()
            .then(function () {
                var distDir = path.join(tmpDir, "dist");

                assert.ok(fs.statSync(path.join(distDir, "test-fixture-example.common.min.js")).isFile());
                assert.ok(fs.statSync(path.join(distDir, "test-fixture-example.common.min.js.map")).isFile());
                assert.ok(fs.statSync(path.join(distDir, "test-fixture-example.module.min.js")).isFile());
                assert.ok(fs.statSync(path.join(distDir, "test-fixture-example.module.min.js.map")).isFile());
                assert.ok(fs.statSync(path.join(distDir, "test-fixture-example.test.min.js")).isFile());
                assert.ok(fs.statSync(path.join(distDir, "test-fixture-example.test.min.js.map")).isFile());

                done();
            })
            .catch(done);
    });
});
