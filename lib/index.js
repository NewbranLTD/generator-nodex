/* eslint one-var: 0 */
/**
 * no-mixed-requires, one-var
 * Reusable class based on yeoman-generator
 */
const Generator = require('./installer.js');
const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
/**
 * Put the repeatly use method in this class and let the other extends from this one
 */
const join = path.join;

// Class defintion
module.exports = class extends Generator {
  /**
   * Class constructor
   * @param {array} args arguments
   * @param {object} opts options
   */
  constructor(args, opts) {
    super(args, opts);
    // This.debugLog(chalk.yellow('<index start>'));
    // Init the props for later use
    if (!this.props) {
      this.props = {};
    }
    // Setup some default options here
    // this.props = _.merge(this.props, {installer: 'npmInstall'});
    this.option('baseconfig', {
      required: false,
      default: false,
      desc: 'baseconfig'
    });
    this.option('langpath', {
      required: false,
      default: false,
      desc: 'langpath'
    });
  }

  /**
   * Make sure it construct a callback method
   * @param {mixed} callback function
   * @return {function} cb
   */
  _cb(callback) {
    return typeof callback === 'function' ? callback : function() {};
  }

  /**
   * Manually create the template path
   * @param {string} src source
   * @return {string} path
   */
  _templatePath(src) {
    return join(this.sourceRoot(), src);
  }

  /**
   * Manually create the dest path
   * @param {string} dest destination
   * @return {string} path
   */
  _destinationPath(dest) {
    return join(this.destinationRoot(), dest);
  }

  /**
   * Copy from src to dest
   * @param {string} src source
   * @param {string} dest (optional)
   * @return {undefined} undefined
   */
  _copy(src, dest = null) {
    const _dest = dest || src;
    return this.fs.copy(this._templatePath(src), this._destinationPath(_dest));
  }

  /**
   * @TODO _copyTpl(...args) {}
   * @param {mixed} src source
   * @param {mixed} dest destination
   * @param {object} params (optional)
   *  @return {undefined} undefined
   */
  _copyTpl(src, dest, params = {}) {
    // Save some typing
    const _dest = dest || src;
    return this.fs.copyTpl(
      this._templatePath(this._getPathFor(src)),
      this._destinationPath(this._getPathFor(_dest)),
      params
    );
  }

  /**
   * Compare the previous two methods into one
   * @param {mixed} p array or string
   * @return {string} path to where to go
   */
  _getPathFor(p) {
    return Array.isArray(p) ? Reflect.apply(join, path, _.reject(p, _.isEmpty)) : p;
  }

  /**
   * CamelCase to camel-case
   * @param {string} s name
   * @return {string} name
   */
  _camelToDash(s) {
    const min = 0;
    return s.replace(
      /([A-Z])/g,
      ($1, p1, pos) => (pos > min ? '-' : '') + $1.toLowerCase()
    );
  }

  /**
   * "some thing like this" to someThingLikeThis
   * @param {string} s name
   * @return {string} name
   */
  _toCamel(s) {
    return s.replace(/([-_][a-z])/g, $1 => $1.toUpperCase().replace(/[-_]/, ''));
  }

  /**
   * String input to ClassName
   * @param {string} s name
   * @return {string} name
   */
  _toClassName(s) {
    const start = 0,
      end = 1,
      cc = this._toCamel(s);
    return cc.substr(start, end).toUpperCase() + cc.substr(end, cc.length - end);
  }

  /**
   * String input to dash-style-case
   * @param {string} s name
   * @return {string} name dashed
   */
  _toDash(s) {
    return s
      .toLowerCase()
      .replace(/\W/g, '-')
      .replace(/\s+/g, '-');
  }

  /**
   * @TODO read the local yo-rc.json to get the previous install lang option
   */

  /**
   * @TODO ask if they want to set a global language option? or check the os to decide for them
   */

  /*
   * @TODO if this is monorepo then need to inject the extra path as well
   * @param {object} opts options
   * @return {undefined} or nothing
   */
  _checkModulePathExist(opts) {
    this.ModuleDir = false;
    const module = opts.m || opts.module;
    if (module) {
      // Const componentDir = join(config.appPath, 'scripts', 'components', component);
      const moduleDir = join(this.modulePath, module);
      fs.stat(this._destinationPath(moduleDir), (err, stats) => {
        if (err) {
          this.log(chalk.red(this.t('ERR_MODULE_NOT_FOUND', { module })));
          return false;
        }
        if (stats.isDirectory()) {
          this.moduleDir = moduleDir;
          // 30-08-2017 add test directory
          this.moduleTestDir = join(this.testPath, moduleDir);
        }
      });
    }
  }
};

// -- EOF --
