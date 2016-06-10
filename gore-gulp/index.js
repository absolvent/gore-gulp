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
const identity = require('lodash/identity');
const isEmpty = require('lodash/isEmpty');
const lint = require('./plugin/lint');
const merge = require('lodash/merge');
const noop = require('lodash/noop');
const path = require('path');
const Promise = require('bluebird');
const test = require('./plugin/test');
const webpack = require('./plugin/webpack');

function setup(options, pckgPromise, plugins, gulp) {
  for (const name in plugins) {
    if (plugins.hasOwnProperty(name)) {
      gulp.task(name, plugins[name].dependencies, plugins[name].task(gulp));
    }
  }
}

function setupDependencies(config, dependencies) {
  if (!isEmpty(config.dependencies)) {
    return config.dependencies.concat(dependencies);
  }

  return dependencies;
}

function setupTask(config, pckgPromise, factory) {
  return function (gulp, override) {
    const normalizedPromise = override ? (
      pckgPromise.then(override)
    ) : (
      pckgPromise
    );

    return factory(config, normalizedPromise, gulp);
  };
}

module.exports = function (config) {
  const plugins = {};
  let normalizedConfig;
  let ret;

  if (typeof config === 'string') {
    normalizedConfig = {
      baseDir: config,
    };
  } else {
    normalizedConfig = config;
  }

  normalizedConfig = merge({
    dependencies: [],
    override: identity,
  }, normalizedConfig);

  const pckgPromise = Promise.fromNode(function (cb) {
    fs.readFile(path.resolve(normalizedConfig.baseDir, 'package.json'), cb);
  }).then(function (pckgContents) {
    return JSON.parse(pckgContents);
  }).then(normalizedConfig.override);

  function plugin(definition) {
    plugins[definition.name] = {
      dependencies: setupDependencies(normalizedConfig, definition.dependencies),
      task: setupTask(normalizedConfig, pckgPromise, definition.factory),
    };

    return ret;
  }

  ret = {
    plugin,
    plugins,
    setup(gulp) {
      return setup(normalizedConfig, pckgPromise, plugins, gulp);
    },
  };

  plugin({
    dependencies: [],
    factory: format,
    name: 'format',
  });
  plugin({
    dependencies: [],
    factory: lint,
    name: 'lint',
  });
  plugin({
    dependencies: [
      'lint',
    ],
    factory: ava,
    name: 'ava',
  });
  plugin({
    dependencies: [
      'lint',
    ],
    factory: test,
    name: 'test',
  });
  plugin({
    dependencies: [
      'test',
    ],
    factory: webpack.development,
    name: 'webpack.development',
  });
  plugin({
    dependencies: [
      'test',
    ],
    factory: webpack.production,
    name: 'webpack.production',
  });

  if (process.env.NODE_ENV === 'production') {
    plugin({
      dependencies: [
        'webpack.production',
      ],
      factory: noop,
      name: 'webpack',
    });
  } else {
    plugin({
      dependencies: [
        'webpack.development',
      ],
      factory: noop,
      name: 'webpack',
    });
  }

  plugin({
    dependencies: [
      'webpack',
    ],
    factory: noop,
    name: 'build',
  });

  plugin({
    dependencies: [
      'webpack',
    ],
    factory: noop,
    name: 'default',
  });

  return ret;
};
