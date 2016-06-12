/**
 * Copyright (c) 2016-present, goreutils
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const test = require('lookly-preset-ava/test');
const webpackGetOutputFilename = require('../../../plugin/webpack/webpackGetOutputFilename');

test('normalizes filename', t => {
  const outputFilename = webpackGetOutputFilename({
    output: {
      filename: 'foo.[name].min.js',
      path: '/baz',
    },
  }, 'bar');

  t.is(outputFilename, '/baz/foo.bar.min.js');
});
