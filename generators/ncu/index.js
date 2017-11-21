'use strict';
/**
 * Allow you to perform upgrade on your packages
 * @20171117 - the softUpgrade method is not working that is the problem with
 * the npm-check-updates unable to work with virtual file system
 */
const Generator = require('../../lib/index.js');
const ncu = require('npm-check-updates');
const fsExtra = require('fs-extra');
const chalk = require('chalk');
const _ = require('lodash');
// Export
module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
    this.option('generateInto', {
      type: String,
      required: false,
      defaults: '',
      desc: 'generateInto'
    });
    this.option('upgrade', {
      type: Boolean,
      required: false,
      default: true,
      alias: 'u',
      desc: 'ncu-upgrade'
    });
    this.option('silent', {
      type: Boolean,
      required: false,
      default: false,
      alias: 's',
      desc: 'ncu-silent'
    });
    this.option('json', {
      type: String,
      required: false,
      default: './package.json',
      desc: 'ncu-package'
    });
    this.option('installing', {
      type: Boolean,
      required: false,
      default: false,
      desc: 'Interval flag to change behavior'
    });
    // This will overwrite the upgrade option
    // so you don't have to do upgrade=0
    this.option('checkonly', {
      type: Boolean,
      required: false,
      desc: 'Over write the upgrade'
    });
    // If set this flag then after the update will call the installer
    this.option('auto', {
      type: Boolean,
      required: false,
      default: false,
      desc: 'Run the installer after the upgrade'
    });
  }

  /**
   * Show what has been updated
   * @param {object} upgraded packages
   * @param {object} oldVersions packages
   * @param {boolean} toUpgrade or not (default true)
   * @return {undefined}
   */
  __displayUpgradeMsg(upgraded, oldVersions, toUpgrade = true) {
    if (process.env.NODE_ENV !== 'testing') {
      this.log(
        toUpgrade
          ? chalk.cyan('Dependencies upgraded')
          : chalk.yellow('Dependencies can upgrade')
      );
      _.forEach(upgraded, (value, key) => {
        let rows = [key];
        if (toUpgrade) {
          rows = rows.concat(chalk.gray(oldVersions[key]), '-->');
        }
        rows.push(chalk.yellow(value));
        Reflect.apply(this.log, this, rows);
      });
    }
  }

  /**
   * Once the update package return it doesn't tell me which belong to where
   * so we need to find out
   * @param {object} pkg existing one
   * @param {object} upgraded the upgraded packages
   * @return {object} pkg, curVersion
   */
  __getDependecies(pkg, upgraded) {
    let curVersion = {};
    _.forEach(pkg.dependencies, (value, key) => {
      if (upgraded[key]) {
        curVersion[key] = value;
        pkg.dependencies[key] = upgraded[key];
      }
    });
    _.forEach(pkg.devDependencies, (value, key) => {
      if (upgraded[key]) {
        curVersion[key] = value;
        pkg.devDependencies[key] = upgraded[key];
      }
    });
    return { pkg, curVersion };
  }

  /**
   * Take the overwrite method out
   * @param {object} packages existing one
   * @param {object} upgraded packages
   * @param {boolean} toUpgrade or not
   * @param {string} pkgFile
   * @return {undefined}
   */
  __forceOverwrite(packages, upgraded, pkgFile, toUpgrade) {
    if (toUpgrade) {
      const { pkg, curVersion } = this.__getDependecies(packages, upgraded);
      // Show what has been updated
      this.__displayUpgradeMsg(upgraded, curVersion, toUpgrade);
      // This will produce the same conflict error message which is fine
      // @BUG this is broken on mac just can't select the options
      // so instead we use the fs-extra to just force overwrite it
      // this.fs.writeJSON(this.options.json, pkg);
      return fsExtra
        .writeJson(pkgFile, pkg)
        .then(() => {
          this.log(chalk.yellow(this.t('package.json updated!')));
          return true;
        })
        .catch(err => {
          this.log(chalk.red(err));
          return false;
        });
    }
    return Promise.resolve(false);
  }

  /**
   * Soft update during the installation
   * @param {object} packages existing one
   * @param {object} upgraded packages
   * @param {string} pkgFile where the package.json is
   * @return {undefined}
   */
  __softUpgrade(packages, upgraded, pkgFile) {
    const { pkg, curVersion } = this.__getDependecies(packages, upgraded);
    // How to detect if there is an error?
    this.fs.extendJSON(pkgFile, pkg);
    this.__displayUpgradeMsg(upgraded, curVersion);
  }

  /**
   * The perfect use case for default hook
   */
  default() {
    const pkgFile = this.options.installing
      ? this.destinationPath(this.options.generateInto, 'package.json')
      : this.options.json;
    const packages = this.fs.readJSON(pkgFile);
    const toUpgrade = this.options.checkonly ? false : this.options.upgrade;
    // There is an undocumented property packageData that can pass raw data to it
    // this.log(packages);
    return ncu
      .run({
        // Always specify the path to the package file
        // packageData: packages,
        packageFile: pkgFile,
        // Any command-line option can be specified here.
        upgrade: toUpgrade,
        // These are set by default:
        silent: this.options.silent,
        jsonUpgraded: true // We always want this
      })
      .then(upgraded => {
        this.__forceOverwrite(packages, upgraded, pkgFile, toUpgrade).then(install => {
          if (install === true && this.options.auto === true) {
            // Call the installer
            this.installerInstallDependencies();
          }
        });
      });
  }
};
