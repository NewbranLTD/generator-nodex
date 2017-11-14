'use strict';
const Generator = require('../../lib/index.js');
const rootPkg = require('../../package.json');

module.exports = class extends Generator {
  constructor(args, options) {
    super(args, options);

    this.option('generateInto', {
      type: String,
      required: false,
      defaults: '',
      desc: 'generateInto'
    });
  }

  writing() {
    this.fs.extendJSON(this.destinationPath(this.options.generateInto, 'package.json'), {
      devDependencies: {
        nsp: rootPkg.devDependencies.nsp
      },
      scripts: {
        prepublishOnly: 'nsp check'
      }
    });
  }
};
