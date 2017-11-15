'use strict';
// Just re-export these to save on the deps map
const lodash = require('lodash');
const glob = require('glob');
const chalk = require('chalk');
const when = require('when');
const fsExtra = require('fs-extra');
// Export
module.exports = {
  app: require.resolve('./generators/app'),
  boilerplate: require.resolve('./generators/boilerplate'),
  cli: require.resolve('./generators/cli'),
  editorconfig: require.resolve('./generators/editorconfig'),
  eslint: require.resolve('./generators/eslint'),
  git: require.resolve('./generators/git'),
  nsp: require.resolve('./generators/nsp'),
  readme: require.resolve('./generators/readme'),
  // Extra mini generator
  nginx: require.resolve('./generators/nginx'),
  systemd: require.resolve('./generators/systemd'),
  ncu: require.resolve('./generators/ncu'),
  // Pwa: require.resolve('./generators/pwa'),
  // plop: require.resolve('./generators/plop'),
  ext: require.resolve('./generators/ext'),
  // To make it available to use in other generators
  ExtendedGenerator: require.resolve('./lib/index'),
  // Re-export some of the deps
  lodash: lodash,
  chalk: chalk,
  glob: glob,
  when: when,
  fsExtra: fsExtra
};
