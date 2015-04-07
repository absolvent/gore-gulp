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
    gg = require(path.join(__dirname, "..", "..", "index")),
    gulp = require("gulp"),
    Q = require("q"),
    tmp = require("tmp");

describe("webpack", function () {
    var tmpDir;

    function runDirectory(baseDir) {
        var distDir;

        return gg(baseDir)
            .webpack
            .full(gulp, function (pckg) {
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
        runDirectory(path.join(__dirname, "__fixtures__", "test-library-1"))
            .then(function (distDir) {
                var paths;

                paths = [
                    path.join(distDir, "test-library-1.common.min.js"),
                    path.join(distDir, "test-library-1.common.min.js.map"),
                    path.join(distDir, "test-library-1.module.min.js"),
                    path.join(distDir, "test-library-1.module.min.js.map"),
                    path.join(distDir, "test-library-1.test.min.js"),
                    path.join(distDir, "test-library-1.test.min.js.map")
                ].map(function (pth) {
                    return FS.isFile(pth).then(function (isFile) {
                        assert.ok(isFile, pth);
                    });
                });

                return Q.all(paths);
            })
            .then(_.noop)
            .then(done)
            .catch(done);
    });

    it("uses library location specified in package configuration", function (done) {
        runDirectory(path.join(__dirname, "__fixtures__", "test-library-2"))
            .then(function (distDir) {
                var paths;

                paths = [
                    path.join(distDir, "test-library-2.common.min.js"),
                    path.join(distDir, "test-library-2.common.min.js.map"),
                    path.join(distDir, "test-library-2.true.min.js"),
                    path.join(distDir, "test-library-2.true.min.js.map")
                ].map(function (pth) {
                    return FS.isFile(pth).then(function (isFile) {
                        assert.ok(isFile, pth);
                    });
                });

                paths = paths.concat([
                    path.join(distDir, "test-library-2.not-an.min.js"),
                    path.join(distDir, "test-library-2.not-an.min.js.map")
                ].map(function (pth) {
                    return FS.isFile(pth).then(function (isFile) {
                        assert.notOk(isFile, pth);
                    });
                }));

                return Q.all(paths);
            })
            .then(_.noop)
            .then(done)
            .catch(done);
    });

    it("uses vendor libraries configuration field", function (done) {
        runDirectory(path.join(__dirname, "__fixtures__", "test-library-3"))
            .then(function (distDir) {
                var paths;

                paths = [
                    path.join(distDir, "test-library-3.common.min.js"),
                    path.join(distDir, "test-library-3.common.min.js.map"),
                    path.join(distDir, "test-library-3.index.min.js"),
                    path.join(distDir, "test-library-3.index.min.js.map")
                ].map(function (pth) {
                    return FS.isFile(pth).then(function (isFile) {
                        assert.ok(isFile, pth);
                    });
                });

                return Q.all(paths);
            })
            .then(_.noop)
            .then(done)
            .catch(done);
    });

    it("resolves nested modules paths", function (done) {
        runDirectory(path.join(__dirname, "__fixtures__", "test-library-4"))
            .then(function (distDir) {
                var paths;

                paths = [
                    path.join(distDir, "test-library-4.common.min.js"),
                    path.join(distDir, "test-library-4.common.min.js.map"),
                    path.join(distDir, "test-library-4.index.min.js"),
                    path.join(distDir, "test-library-4.index.min.js.map")
                ].map(function (pth) {
                    return FS.isFile(pth).then(function (isFile) {
                        assert.ok(isFile, pth);
                    });
                });

                return Q.all(paths);
            })
            .then(_.noop)
            .then(done)
            .catch(done);
    });

    it("resolves node_modules paths", function (done) {
        runDirectory(path.join(__dirname, "__fixtures__", "test-library-5"))
            .then(function (distDir) {
                var paths;

                paths = [
                    path.join(distDir, "test-library-5.common.min.js"),
                    path.join(distDir, "test-library-5.common.min.js.map"),
                    path.join(distDir, "test-library-5.fake-module-holder.min.js"),
                    path.join(distDir, "test-library-5.fake-module-holder.min.js.map")
                ].map(function (pth) {
                    return FS.isFile(pth).then(function (isFile) {
                        assert.ok(isFile, pth);
                    });
                });

                return Q.all(paths);
            })
            .then(_.noop)
            .then(done)
            .catch(done);
    });

    it("uses externals settings", function (done) {
        runDirectory(path.join(__dirname, "__fixtures__", "test-library-6"))
            .then(function (distDir) {
                var paths;

                paths = [
                    path.join(distDir, "test-library-6.common.min.js"),
                    path.join(distDir, "test-library-6.common.min.js.map"),
                    path.join(distDir, "test-library-6.index.min.js"),
                    path.join(distDir, "test-library-6.index.min.js.map")
                ].map(function (pth) {
                    return FS.isFile(pth).then(function (isFile) {
                        assert.ok(isFile, pth);
                    });
                });

                return Q.all(paths);
            })
            .then(_.noop)
            .then(done)
            .catch(done);
    });
});
