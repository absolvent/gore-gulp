/**
 * Copyright (c) 2015-present, goreutils
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

"use strict";

import {assert} from "chai";
import Foo from "karma-library/React/Foo";
import React from "react/addons";

describe("test", function () {
    it("should run in karma environment only", function () {
        var foo = React.addons.TestUtils.renderIntoDocument(<Foo />);

        assert.strictEqual(React.findDOMNode(foo).textContent, ":)");
    });
});
