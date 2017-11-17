/**
 * Allow you to perform upgrade on your packages
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
  }

  /**
   * The perfect use case for default hook
   */
  default() {
    const pkgFile = this.options.installing
      ? this.destinationPath('package.json')
      : this.options.json;
    const toUpgrade = this.options.checkonly ? true : this.options.upgrade;
    // There is an undocumented property packageData that can pass raw data to it
    return ncu
      .run({
        // Always specify the path to the package file
        packageFile: pkgFile,
        // Any command-line option can be specified here.
        upgrade: toUpgrade,
        // These are set by default:
        silent: this.options.silent,
        jsonUpgraded: true // We always want this
      })
      .then(upgraded => {
        let oldVersions = {};
        const toUpgrade = this.options.upgrade;
        if (toUpgrade) {
          const pkg = this.fs.readJSON(this.options.json);
          // There is a problem that the return don't tell us whether its a dependencies or devDependencies
          // so we need to run through it to check the upgrade and put it there!
          _.forEach(pkg.dependencies, (value, key) => {
            if (upgraded[key]) {
              oldVersions[key] = value;
              pkg.dependencies[key] = upgraded[key];
            }
          });
          _.forEach(pkg.devDependencies, (value, key) => {
            if (upgraded[key]) {
              oldVersions[key] = value;
              pkg.devDependencies[key] = upgraded[key];
            }
          });
          // This will produce the same conflict error message which is fine
          // this is broken on mac just can't select the options
          // so instead we use the fs-extra to just force overwrite it
          // this.fs.writeJSON(this.options.json, pkg);
          fsExtra
            .writeJson(this.options.json, pkg)
            .then(() => {
              this.log(chalk.yellow(this.t('package.json updated!')));
            })
            .catch(err => {
              this.log(chalk.red(err));
            });
        }
        // No output when it's in the test
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
      });
  }
};
