/**
 * Copyright (c) 2016-present, goreutils
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const convertLibFilePathToDistFilePath = require('../convertLibFilePathToDistFilePath');
const test = require('lookly-preset-ava/test');
const config = {
  baseDir: '/Users/zangrafx/projects/gore-gulp',
};
const filename = '/Users/zangrafx/projects/gore-gulp/src/foo.js';

test('converts library file path to dist file path when dist is provided', t => {
  const pckg = {
    directories: { lib: 'src', dist: 'public' },
  };

  t.is(
    convertLibFilePathToDistFilePath(config, pckg, filename),
    '/Users/zangrafx/projects/gore-gulp/public/foo.js'
  );
});

test('converts library file path to dist file path when defaults to dist', t => {
  const pckg = {
    directories: { lib: 'src' },
  };

  t.is(
    convertLibFilePathToDistFilePath(config, pckg, filename),
    '/Users/zangrafx/projects/gore-gulp/dist/foo.js'
  );
});
