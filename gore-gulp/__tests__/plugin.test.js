/**
 * Copyright (c) 2015-present, goreutils
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const gg = require('../index');
const Gulp = require('gulp').Gulp;
const noop = require('lodash/noop');
const path = require('path');
const test = require('lookly-preset-ava/test');

test('allows to attach a custom plugin', function () {
  const gulpInstance = new Gulp();

  return new Promise(function (resolve) {
    gg(path.resolve(__dirname, '..', '__fixtures__', 'test-library-8'))
      .plugin({
        dependencies: [],
        factory: resolve,
        name: 'custom',
      })
      .setup(gulpInstance);

    gulpInstance.start('custom');
  });
});

test('is chainable', function () {
  const gulpInstance = new Gulp();

  return new Promise(function (resolve) {
    gg(path.resolve(__dirname, '..', '__fixtures__', 'test-library-8'))
      .plugin({
        dependencies: [],
        factory: resolve,
        name: 'first',
      })
      .plugin({
        dependencies: ['first'],
        factory: noop,
        name: 'second',
      })
      .setup(gulpInstance);

    gulpInstance.start('second');
  });
});
