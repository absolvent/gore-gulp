/**
 * Copyright (c) 2015-present, goreutils
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const ConfigBuilder = require('./ConfigBuilder');
const fs = require('fs');
const GulpManager = require('./GulpManager');
const normalizeConfig = require('./normalizeConfig');
const path = require('path');
const Promise = require('bluebird');

module.exports = function createGulpManager(config) {
  const configBuilder = new ConfigBuilder(normalizeConfig(config)).addArgv(process.argv.slice(2));
  const pckgPath = path.resolve(configBuilder.config.get('baseDir'), 'package.json');
  const pckgPromise = Promise
    .fromCallback(cb => fs.readFile(pckgPath, cb))
    .then(pckg => JSON.parse(pckg))
    .then(pckg => configBuilder.config.get('override')(pckg))
  ;

  return new GulpManager(configBuilder, pckgPromise);
};
