/**
 * Copyright (c) 2015-present, goreutils
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const ava = require('./plugin/ava');
const format = require('./plugin/format');
const fs = require('fs');
const lint = require('./plugin/lint');
const normalizeConfig = require('./normalizeConfig');
const normalizeConfigWithPckg = require('./normalizeConfigWithPckg');
const path = require('path');
const Promise = require('bluebird');
const test = require('./plugin/test');
const webpack = require('./plugin/webpack');

function setupTask(config, pckgPromise, factory) {
  return function () {
    return pckgPromise.then(pckg => Promise.props({
      config: normalizeConfigWithPckg(config, pckg),
      pckg,
    })).then(params => factory(params.config, params.pckg));
  };
}

module.exports = function (config) {
  const normalizedConfig = normalizeConfig(config, process.argv.slice(2));
  const pckgPath = path.resolve(normalizedConfig.baseDir, 'package.json');
  const pckgPromise = Promise
    .fromCallback(cb => fs.readFile(pckgPath, cb))
    .then(pckg => JSON.parse(pckg))
    .then(pckg => normalizedConfig.override(pckg))
  ;

  const tasks = {
    ava: setupTask(normalizedConfig, pckgPromise, ava),
    format: setupTask(normalizedConfig, pckgPromise, format),
    lint: setupTask(normalizedConfig, pckgPromise, lint),
    test: setupTask(normalizedConfig, pckgPromise, test),
    'webpack.development': setupTask(normalizedConfig, pckgPromise, webpack.development),
    'webpack.production': setupTask(normalizedConfig, pckgPromise, webpack.production),
  };

  return {
    tasks,
    setup(gulp) {
      gulp.task('format', tasks.format);
      gulp.task('lint', tasks.lint);
      gulp.task('ava', ['lint'], tasks.ava);
      gulp.task('test', ['lint'], tasks.test);
      gulp.task('webpack.development', ['test'], tasks['webpack.development']);
      gulp.task('webpack.production', ['test'], tasks['webpack.production']);
      gulp.task('webpack', tasks['webpack.development']);
      gulp.task('default', ['webpack']);
    },
  };
};
