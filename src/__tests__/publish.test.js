/**
 * Copyright (c) 2015-present, goreutils
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const common = require('./webpack/common');
const path = require('path');
const test = require('lookly-preset-ava/test');

test('tests example basic package', t => (
  common.runDirectory(
    path.resolve(__dirname, '..', '..', 'example', 'basic'), 'publish'
  ).then(common.expectFiles(t, [
    'a.entry.js',
    'b.entry.jsx',
    'c.js',
  ]))
));
