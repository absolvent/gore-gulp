/**
 * Copyright (c) 2016-present, goreutils
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const getCliOptions = require('./getCliOptions');
const Immutable = require('immutable');

class ConfigBuilder {
  constructor(baseConfig) {
    /* eslint-disable new-cap */
    this.config = Immutable.Map(baseConfig);
    /* eslint-enable new-cap */
  }

  addArgv(argv) {
    if (!this.config.has('argv')) {
      return new ConfigBuilder(this.config.set('argv', argv));
    }

    return this;
  }

  addPckg(pckg) {
    const cliOptions = getCliOptions(this.config.toJS(), pckg);

    return new ConfigBuilder(this.config.mergeDeep({
      glob: cliOptions.glob,
      silent: cliOptions.silent,
    }));
  }
}

module.exports = ConfigBuilder;
