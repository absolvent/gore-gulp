/**
 * Copyright (c) 2016-present, goreutils
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const MissingBabelPluginErrorHandle = require('../../../webpack/MissingBabelPluginErrorHandle');
const test = require('lookly-preset-ava/test');

const missingPluginError = {
  message: 'ModuleBuildError: Module build failed: ReferenceError: '
    + 'Unknown plugin "add-module-exports" specified in',
};
const notMissingPluginError = {
  message: 'FooError:',
};

test('recognizes module build error', t => {
  t.true(MissingBabelPluginErrorHandle.isMissingPluginError(missingPluginError));
});

test('rejects module build error', t => {
  t.false(MissingBabelPluginErrorHandle.isMissingPluginError(notMissingPluginError));
});

test('logs missing plugin', t => (
  new MissingBabelPluginErrorHandle(missingPluginError)
    .createMissingPluginMessage()
    .then(msg => t.truthy(msg))
));
