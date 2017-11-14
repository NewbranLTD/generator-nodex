'use strict';
const Generator = require('../../lib/index.js');

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

  initializing() {
    this.fs.copy(
      this.templatePath('editorconfig'),
      this.destinationPath(this.options.generateInto, '.editorconfig')
    );
  }
};
