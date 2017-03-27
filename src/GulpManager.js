/**
 * Copyright (c) 2016-present, goreutils
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const ava = require('../ava');
const format = require('../format');
const publish = require('../publish');
const gutil = require('gulp-util');
const lint = require('../lint');
const prettyTime = require('pretty-hrtime');
const reduce = require('lodash/reduce');
const test = require('../test');
const webpack = require('../webpack');

function getMsgTail(start) {
  const time = process.hrtime(start);

  return `after ${gutil.colors.green(prettyTime(time))}`;
}

function callFactory(config, pckg, factory) {
  const msgBody = `'${gutil.colors.yellow('gore')}.${gutil.colors.yellow(factory.name)}'`;
  const start = process.hrtime();

  if (!config.silent) {
    gutil.log(`Starting ${msgBody}...`);
  }

  const ret = factory(config, pckg);

  if (config.silent) {
    return ret;
  }

  return ret.then(() => {
    gutil.log(`Finished ${msgBody} ${getMsgTail(start)}`);
  }).catch(err => {
    gutil.log(`${gutil.colors.red('Error')} reported by ${msgBody} ${getMsgTail(start)}`);

    throw err;
  });
}

function createTask(configBuilder, pckgPromise, factoryList) {
  return function gulpTask() {
    return pckgPromise.then(pckg => {
      const config = configBuilder.addPckg(pckg).config.toJS();

      return reduce(factoryList, (ret, factory) => (
        ret.then(() => callFactory(config, pckg, factory))
      ), Promise.resolve());
    });
  };
}

class GulpManager {
  constructor(configBuilder, pckgPromise) {
    const useAva = configBuilder.config.get('useAva');

    this.tasks = {
      format: createTask(configBuilder, pckgPromise, [
        format,
      ]),
      lint: createTask(configBuilder, pckgPromise, [
        lint,
      ]),
      test: createTask(configBuilder, pckgPromise, [
        lint,
        useAva ? ava : test,
      ]),
      publish: createTask(configBuilder, pckgPromise, [
        lint,
        useAva ? ava : test,
        publish,
      ]),
      'webpack.development': createTask(configBuilder, pckgPromise, [
        lint,
        useAva ? ava : test,
        webpack.development,
      ]),
      'webpack.production': createTask(configBuilder, pckgPromise, [
        lint,
        useAva ? ava : test,
        webpack.production,
      ]),
    };
  }

  setup(gulp) {
    gulp.task('format', [], this.tasks.format);
    gulp.task('lint', [], this.tasks.lint);
    gulp.task('ava', [], this.tasks.ava);
    gulp.task('test', [], this.tasks.test);
    gulp.task('publish', [], this.tasks.publish);
    gulp.task('webpack.development', [], this.tasks['webpack.development']);
    gulp.task('webpack.production', [], this.tasks['webpack.production']);
    gulp.task('webpack', ['webpack.development']);
    gulp.task('default', ['webpack']);

    return this;
  }
}

module.exports = GulpManager;
