/**
 * Copyright (c) 2015-present, goreutils
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

"use strict";

var app,
    compiler,
    path = require("path"),
    express = require("express"),
    webpack = require("webpack"),
    config = require("./webpack.config.dev");

app = express();
compiler = webpack(config);

app.use(require("webpack-dev-middleware")(compiler, {
    "noInfo": true,
    "publicPath": config.output.publicPath
}));

app.use(require("webpack-hot-middleware")(compiler));

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(3000, "localhost", function (err) {
    if (err) {
        console.log(err);
        return;
    }

    console.log("Listening at http://localhost:3000");
});
