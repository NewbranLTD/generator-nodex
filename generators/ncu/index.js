/**
 * Allow you to perform upgrade on your packages
 */
const Generator = require('../../lib/index.js');
const ncu = require('npm-check-updates');
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
  }

  /*
  Initializing() {
    console.log(this.options);
  }
*/
  writing() {
    // This.log(this.options.upgrade); @20171115 this is broken
    return ncu
      .run({
        // Always specify the path to the package file
        packageFile: this.options.json,
        // Any command-line option can be specified here.
        upgrade: this.options.upgrade,
        // These are set by default:
        silent: this.options.silent,
        jsonUpgraded: true
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
          this.fs.writeJSON(this.options.json, pkg);
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