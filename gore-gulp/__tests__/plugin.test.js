/**
 * Copyright (c) 2015-present, goreutils
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

"use strict";

/* global describe: false, it: false */

const config = require("./config");
const gg = require("../index");
const Gulp = require("gulp").Gulp;
const noop = require("lodash/noop");
const path = require("path");

describe("plugin", function () {
    this.timeout(config.timeout);

    it("allows to attach a custom plugin", function (done) {
        const gulpInstance = new Gulp();

        gg(path.resolve(__dirname, "..", "__fixtures__", "test-library-8"))
            .plugin({
                "dependencies": [],
                "factory": function () {
                    return function () {
                        done();
                    };
                },
                "name": "custom"
            })
            .setup(gulpInstance);

        gulpInstance.start("custom");
    });

    it("is chainable", function (done) {
        const gulpInstance = new Gulp();

        gg(path.resolve(__dirname, "..", "__fixtures__", "test-library-8"))
            .plugin({
                "dependencies": [],
                "factory": function () {
                    return function () {
                        done();
                    };
                },
                "name": "first"
            })
            .plugin({
                "dependencies": ["first"],
                "factory": function () {
                    return noop;
                },
                "name": "second"
            })
            .setup(gulpInstance);

        gulpInstance.start("second");
    });
});
