/**
 * Allow you to perform upgrade on your packages
 */
const Generator = require('../../lib/index.js');
const ncu = require('npm-check-updates');
const _ = require('lodash');
// Export
module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
    this.option('upgrade', {
      type: Boolean,
      required: false,
      default: true,
      desc: 'ncu-upgrade'
    });
    this.option('silent', {
      type: Boolean,
      required: false,
      default: false,
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
  default() {
    return ncu
      .run({
        // Always specify the path to the package file
        packageFile: this.options.json,
        // Any command-line option can be specified here.
        // These are set by default:
        silent: this.options.silent,
        jsonUpgraded: this.options.upgrade
      })
      .then(upgraded => {
        if (process.env.NODE_ENV !== 'testing') {
          this.log('dependencies to upgrade');
          _.forEach(upgraded, (value, key) => {
            this.log(key, value);
          });
        }
      });
  }
};
