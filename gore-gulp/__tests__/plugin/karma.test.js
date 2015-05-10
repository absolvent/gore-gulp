/**
 * Copyright (c) 2015-present, goreutils
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

"use strict";

/*global describe: false, it: false */

var path = require("path"),
    gg = require(path.resolve(__dirname, "..", "..", "index")),
    Gulp = require("gulp").Gulp;

describe("karma", function () {
    it("starts karma server", function (done) {
        gg(path.resolve(__dirname, "..", "..", "__fixtures__", "test-library-10"))
            .plugins["karma.server"].task(new Gulp())()
            .then(function () {
                done();
            })
            .catch(done);
    });
});
