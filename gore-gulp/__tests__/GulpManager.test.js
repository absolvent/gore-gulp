/**
 * Copyright (c) 2015-present, goreutils
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const gg = require('..');
const Gulp = require('gulp').Gulp;
const path = require('path');
const test = require('lookly-preset-ava/test');

const fixtureLibraryPath = path.resolve(__dirname, '..', '__fixtures__', 'test-library-1');

test('provides the default task', t => {
  const gulpInstance = new Gulp();

  gg({
    baseDir: fixtureLibraryPath,
    silent: true,
  }).setup(gulpInstance);

  t.true(gulpInstance.hasTask('default'));
});
