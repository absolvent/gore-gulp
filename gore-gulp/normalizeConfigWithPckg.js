/**
 * Copyright (c) 2016-present, goreutils
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const getCliOptions = require('./getCliOptions');

function normalizeConfigWithPckg(config, pckg) {
  const cliOptions = getCliOptions(config, pckg);

  return {
    baseDir: config.baseDir,
    glob: cliOptions.glob,
    override: config.override,
    silent: cliOptions.silent,
  };
}

module.exports = normalizeConfigWithPckg;
