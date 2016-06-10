/**
 * Copyright (c) 2016-present, goreutils
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const esformatter = require('lookly-preset-esformatter');
const getCliOptions = require('../getCliOptions');

module.exports = function (config, pckg) {
  const options = getCliOptions(config, pckg, process.argv.slice(2));

  return esformatter.formatGlob(options.glob);
};
