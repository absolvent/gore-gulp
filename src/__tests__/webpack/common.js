/**
 * Copyright (c) 2015-present, goreutils
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const fixtureDir = '../../../__fixtures__';
const fs = require('fs');
const gg = require('../../../index');
const Gulp = require('gulp').Gulp;
const merge = require('lodash/merge');
const noop = require('lodash/noop');
const path = require('path');
const Promise = require('bluebird');
const test = require('lookly-preset-ava/test');
const tmp = require('tmp');

function doFiles(t, paths, assertion) {
  return function awaitFiles(distDir) {
    const promises = paths.map(pth => (
      Promise.fromCallback(statCb => fs.stat(path.resolve(distDir, pth), statCb))
      .then(stats => t[assertion](stats.isFile(), pth))
      .catch(err => {
        if (err.code === 'ENOENT') {
          return t[assertion](false, pth);
        }

        throw err;
      })
    ));

    return Promise.all(promises).then(noop);
  };
}

function expectFiles(t, paths) {
  return doFiles(t, paths, 'true');
}

function notExpectFiles(t, paths) {
  return doFiles(t, paths, 'false');
}

function runDirectory(baseDir, variant) {
  const gulpInstance = new Gulp();
  let distDir;

  gg({
    baseDir,
    override(pckg) {
      return Promise.fromCallback(tmp.dir).then(tmpDir => {
        distDir = path.resolve(tmpDir, pckg.directories.dist);

        return merge(pckg, {
          directories: {
            dist: distDir,
          },
        });
      });
    },
    silent: true,
  }).setup(gulpInstance);

  return new Promise((resolve, reject) => {
    gulpInstance.on('err', err => reject(err.err));
    gulpInstance.on('stop', resolve);

    gulpInstance.start(variant);
  }).then(() => distDir);
}

function setup(variant) {
  [
    {
      expectFiles: [
        'test-library-1.module.min.js',
        'test-library-1.test.min.js',
      ],
      fixture: 'test-library-1',
      name: 'generates output using .entry files',
      notExpectFiles: [],
    },
    {
      expectFiles: [
        'test-library-2.true.min.js',
      ],
      fixture: 'test-library-2',
      name: 'uses library location specified in package configuration',
      notExpectFiles: [
        'test-library-2.not-an.min.js',
      ],
    },
    {
      expectFiles: [
        'test-library-3.index.min.js',
      ],
      fixture: 'test-library-3',
      name: 'uses vendor libraries configuration field',
      notExpectFiles: [],
    },
    {
      expectFiles: [
        'test-library-4.index.min.js',
      ],
      fixture: 'test-library-4',
      name: 'resolves nested modules paths',
      notExpectFiles: [],
    },
    {
      expectFiles: [
        'test-library-5.fake-module-holder.min.js',
      ],
      fixture: 'test-library-5',
      name: 'resolves node_modules paths',
      notExpectFiles: [],
    },
    {
      expectFiles: [
        'test-library-6.index.min.js',
      ],
      fixture: 'test-library-6',
      name: 'uses externals settings',
      notExpectFiles: [],
    },
    {
      expectFiles: [
        'test-library-7.first-pointof.min.js',
      ],
      fixture: 'test-library-7',
      name: 'resolves multiple entry points',
      notExpectFiles: [],
    },
    {
      expectFiles: [
        'test-library-9.index.min.js',
      ],
      fixture: 'test-library-9',
      name: "uses 'provide' plugin",
      notExpectFiles: [],
    },
    {
      expectFiles: [
        'test-library-11.symfony.min.js',
      ],
      fixture: 'test-library-11',
      name: 'symfony package directory structure',
      notExpectFiles: [],
    },
    {
      expectFiles: [
        'test-library-13.first.min.js',
      ],
      fixture: 'test-library-13',
      name: 'multiple library paths',
      notExpectFiles: [],
    },
    {
      expectFiles: [
        'test-library-14.index.min.js',
      ],
      fixture: 'test-library-14',
      name: 'uses ES6 decorators',
      notExpectFiles: [],
    },
  ].forEach(testData => {
    test(testData.name, t => {
      let distDir;

      return runDirectory(path.resolve(__dirname, fixtureDir, testData.fixture), variant)
        .then(dd => {
          distDir = dd;

          return dd;
        })
        .then(expectFiles(t, testData.expectFiles))
        .then(() => distDir)
        .then(notExpectFiles(t, testData.notExpectFiles));
    });
  });
}

module.exports = {
  expectFiles,
  runDirectory,
  setup,
};
