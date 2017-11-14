'use strict';
/**
 * Simple qa to generator a nginx proxy config file
 */
const Generator = require('../../lib/index.js');
const fs = require('fs');
const _ = require('lodash');
const testing = process.env.NODE_ENV === 'test';

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
    this.answers = {
      consoleLog: this.t('Your answer is'),
      yes: this.t('yes'),
      no: this.t('no'),
      description: this.t('This is an example plop generator'),
      message: this.t('Yes or no?')
    };
    this.pkgFile = this.destinationPath('package.json');
  }

  /**
   * First check if there is a package.json file
   */
  initializing() {
    // Don't check if it's in test
    if (!testing) {
      if (!fs.existsSync(this.pkgFile)) {
        throw new Error(this.t('package.json not found!'));
      }
    }
  }

  /**
   * There is no question just write out the template file
   */
  writing() {
    this._copyTpl('plopfile.tpl', 'plopfile.js', this.answers);
    const pkg = this.fs.readJSON(this.pkgFile);
    const newPkg = {
      devDependencies: {
        plop: '^1.9.0'
      },
      scripts: {
        plop: 'node ./node_modules/plop/src/plop.js'
      }
    };
    this.fs.writeJSON(this.pkgFile, _.merge(pkg, newPkg));
  }

  /**
   * Add dependency to the package.json
   */
  installing() {
    if (!testing) {
      this._runInstaller();
    }
  }

  /**
   * Just a message to tell them how to use it
   */
  end() {
    if (!testing) {
      this.log(this.t('Just run `npm run plop`', { cmd: 'npm run' }));
    }
  }
};
