/**
 * Copyright (c) 2015-present, goreutils
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const ecmaScriptFileExtensions = require('./ecmaScriptFileExtensions');
const filter = require('lodash/filter');

function ecmaScriptFileExtensionsGlobPattern(pckg) {
  const ecmaScriptFileExtensionsList = ecmaScriptFileExtensions(pckg);
  const notEmptyExtensions = filter(ecmaScriptFileExtensionsList);

  return `{${notEmptyExtensions.join(',')}}`;
}

module.exports = ecmaScriptFileExtensionsGlobPattern;
