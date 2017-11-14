/* eslint no-mixed-requires:0, one-var: 0 */
/**
 * Move the basement further down
 */
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const path = require('path');
const _ = require('lodash');
// Other import
const join = path.join;
const debugging = process.env.NODE_ENV === 'debugging';
const config = require(join(__dirname, 'config.json'));
const skipParams = {
  skipInstall: true // This one works
};
// Export class
module.exports = class extends Generator {
  constructor(args, opts) {
    // Force the installer to stop!
    super(args, _.merge(opts, skipParams));
    // If someone pass an external config
    this.baseConfig = this._getBaseConfigOption(opts);
    // This.debugLog(chalk.yellow('<base start>'));
  }

  /**
   * Check if they pass --base-config=path_to_config_json
   * @param {object} opts options pass by external call
   * @return {object}
   */
  _getBaseConfigOption(opts) {
    // Read the package.json and grab the name of the generator
    const pkg = this.fs.readJSON(
      path.resolve(path.join(__dirname, '..', 'package.json'))
    );
    // Setup the baseline config object
    const _config = _.extend({}, config, { pkgName: pkg.name });
    // External language file
    const langConfig = {};
    if (opts.langpath) {
      langConfig.langPath = path.resolve(opts.langpath);
      this.debugLog(chalk.yellow('received external lang path'), langConfig.langPath);
    }
    if (opts.baseconfig) {
      this.debugLog(chalk.yellow('received external base config'), opts.baseconfig);
      try {
        const extConfig = this.fs.readJSON(path.resolve(opts.baseconfig));
        // Couldn't pass it via the config so need to hack it like this
        // Just surpress the error if the file not found!
        return _.merge(_config, extConfig, langConfig);
      } catch (e) {
        this.debugLog(chalk.red('baseconfig error'), opts.baseconfig, e);
      }
    }
    return _.merge(_config, langConfig);
  }

  /**
   * Simple debugging log to switch it off when it's not NODE_ENV===debugging
   * @params {mixed} args
   */
  debugLog(...args) {
    if (debugging) {
      this.log(...args);
    }
  }
};
