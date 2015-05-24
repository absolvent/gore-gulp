/**
 * Copyright (c) 2015-present, goreutils
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

"use strict";

/*global describe: false, it: false */

var assert = require("chai").assert,
    path = require("path"),
    ecmaScriptTestFileExtensionsRegExp = require(path.resolve(__dirname, "..", "..", "pckg", "ecmaScriptTestFileExtensionsRegExp"));

describe("pckg/ecmaScriptTestFileExtensionsRegExp", function () {
    var regExp = ecmaScriptTestFileExtensionsRegExp({}, ".karma");

    it("should match karma files", function () {
        assert.ok(regExp.test("foo.karma.jsx"));
    });

    it("should not match fixtures", function () {
        assert.notOk(regExp.test("__fixtures__/foo.karma.jsx"));
    });
});
