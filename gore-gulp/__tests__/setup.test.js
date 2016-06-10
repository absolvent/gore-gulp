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
const noop = require('lodash/noop');
const path = require('path');
const sinon = require('sinon');
const test = require('lookly-preset-ava/test');

const fixtureLibraryPath = path.resolve(__dirname, '..', '__fixtures__', 'test-library-1');
let previousNodeEnv;

function doTestWebpackSetup(environment, taskName) {
  const gulpInstance = new Gulp();

  process.env.NODE_ENV = environment;

  gg(fixtureLibraryPath).setup(gulpInstance);

  return new Promise(function (resolve) {
    gulpInstance.task(taskName, resolve);
    gulpInstance.start('webpack');
  });
}

test.afterEach(function () {
  process.env.NODE_ENV = previousNodeEnv;
});

test.beforeEach(function () {
  previousNodeEnv = process.env.NODE_ENV;
});

test('sets up gulp instance using development settings', function () {
  return doTestWebpackSetup('development', 'webpack.development');
});

test('sets up gulp instance using production settings', function () {
  return doTestWebpackSetup('production', 'webpack.production');
});

test('provides the default task', function (t) {
  const gulpInstance = new Gulp();

  gg(fixtureLibraryPath).setup(gulpInstance);

  t.true(gulpInstance.hasTask('default'));
});

test('provides package dependencies', function (t) {
  const gulpInstance = new Gulp();
  const spy = sinon.spy();

  gg({
    baseDir: fixtureLibraryPath,
    dependencies: [
      'my-custom-dependency',
    ],
  }).plugin({
    dependencies: [],
    factory: noop,
    name: 'my-test-plugin',
  }).setup(gulpInstance);

  gulpInstance.task('my-custom-dependency', spy);
  gulpInstance.start('my-test-plugin');

  t.true(spy.calledOnce);
});
