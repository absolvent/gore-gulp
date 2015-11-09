/**
 * Copyright (c) 2015-present, goreutils
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

"use strict";

/* global describe: false, it: false */

var gg = require("../../../index"),
    Gulp = require("gulp").Gulp,
    path = require("path"),
    request = require("request");

describe.skip("webpack/hmr", function () {
    it("runs hot module replacement server and serves compiled bundle", function (done) {
        var gulpInstance = new Gulp();

        this.timeout(0);

        gg({
            "baseDir": path.resolve(__dirname, "..", "..", "..", "..", "example", "hot-module-replacement"),
            "onStart": function (httpServer) {
                return request("http://localhost:3000/static/example.index.min.js", function (err) {
                    console.log(arguments);

                    if (err) {
                        done(err);
                    } else {
                        httpServer.listen("close", done);
                    }

                    // httpServer.close();
                });
            }
        }).setup(gulpInstance);

        gulpInstance.on("err", done);
        gulpInstance.start("hmr");
    });
});
