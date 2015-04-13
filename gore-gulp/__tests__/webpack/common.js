/**
 * Copyright (c) 2015-present, goreutils
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

"use strict";

/*global beforeEach: false, it: false */

var path = require("path"),
    _ = require("lodash"),
    assert = require("chai").assert,
    defaults = require(path.join(__dirname, "..", "..", "defaults")),
    fs = require("fs"),
    gg = require(path.join(__dirname, "..", "..", "index")),
    gulp = require("gulp"),
    Promise = require("bluebird"),
    tmp = require("tmp");

module.exports = function (variant) {
    var fixtureDir = path.join(__dirname, "..", "..", "__fixtures__"),
        tmpDir;

    function doFiles(paths, cb) {
        var stat = Promise.promisify(fs.stat);

        return function (distDir) {
            paths = paths.map(function (pth) {
                return stat(path.join(distDir, pth))
                    .then(function (stats) {
                        return cb(stats.isFile(), pth);
                    })
                    .catch(function (err) {
                        if ("ENOENT" === err.code) {
                            return cb(false, pth);
                        }

                        throw err;
                    });
            });

            return Promise.all(paths).then(_.noop);
        };
    }

    function expectFiles(paths) {
        return doFiles(paths, assert.ok);
    }

    function notExpectFiles(paths) {
        return doFiles(paths, assert.notOk);
    }

    function runDirectory(baseDir) {
        var distDir;

        return gg(baseDir)
            .webpack[variant](gulp, function (pckg) {
                distDir = path.join(tmpDir, pckg.directories.dist);

                return _.merge(pckg, {
                    "directories": {
                        "dist": distDir
                    }
                });
            })()
            .then(function () {
                return distDir;
            });
    }

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
        runDirectory(path.join(fixtureDir, "test-library-1"))
            .then(expectFiles([
                "test-library-1.common.min.js",
                "test-library-1.common.min.js.map",
                "test-library-1.module.min.js",
                "test-library-1.module.min.js.map",
                "test-library-1.test.min.js",
                "test-library-1.test.min.js.map"
            ]))
            .then(done)
            .catch(done);
    });

    it("uses library location specified in package configuration", function (done) {
        var distDir;

        runDirectory(path.join(fixtureDir, "test-library-2"))
            .then(function (dd) {
                distDir = dd;

                return dd;
            })
            .then(expectFiles([
                "test-library-2.common.min.js",
                "test-library-2.common.min.js.map",
                "test-library-2.true.min.js",
                "test-library-2.true.min.js.map"
            ]))
            .then(function () {
                return distDir;
            })
            .then(notExpectFiles([
                "test-library-2.not-an.min.js",
                "test-library-2.not-an.min.js.map"
            ]))
            .then(done)
            .catch(done);
    });

    it("uses vendor libraries configuration field", function (done) {
        runDirectory(path.join(fixtureDir, "test-library-3"))
            .then(expectFiles([
                "test-library-3.common.min.js",
                "test-library-3.common.min.js.map",
                "test-library-3.index.min.js",
                "test-library-3.index.min.js.map"
            ]))
            .then(done)
            .catch(done);
    });

    it("resolves nested modules paths", function (done) {
        runDirectory(path.join(fixtureDir, "test-library-4"))
            .then(expectFiles([
                "test-library-4.common.min.js",
                "test-library-4.common.min.js.map",
                "test-library-4.index.min.js",
                "test-library-4.index.min.js.map"
            ]))
            .then(done)
            .catch(done);
    });

    it("resolves node_modules paths", function (done) {
        runDirectory(path.join(fixtureDir, "test-library-5"))
            .then(expectFiles([
                "test-library-5.common.min.js",
                "test-library-5.common.min.js.map",
                "test-library-5.fake-module-holder.min.js",
                "test-library-5.fake-module-holder.min.js.map"
            ]))
            .then(done)
            .catch(done);
    });

    it("uses externals settings", function (done) {
        runDirectory(path.join(fixtureDir, "test-library-6"))
            .then(expectFiles([
                "test-library-6.common.min.js",
                "test-library-6.common.min.js.map",
                "test-library-6.index.min.js",
                "test-library-6.index.min.js.map"
            ]))
            .then(done)
            .catch(done);
    });

    it("resolves multiple entry points", function (done) {
        runDirectory(path.join(fixtureDir, "test-library-7"))
            .then(expectFiles([
                "test-library-7.common.min.js",
                "test-library-7.common.min.js.map",
                "test-library-7.first-pointof.min.js",
                "test-library-7.second-pointof.min.js.map",
                "test-library-7.third-nested-pointof.min.js.map"
            ]))
            .then(done)
            .catch(done);
    });
};
