'use strict';
const _ = require('lodash');
const Generator = require('../../lib/index.js');

module.exports = class extends Generator {
  constructor(args, options) {
    super(args, options);

    this.option('generateInto', {
      type: String,
      required: false,
      default: '',
      desc: 'generateInto'
    });

    this.option('name', {
      type: String,
      required: true,
      desc: 'newModuleName'
    });
  }

  writing() {
    const filepath = this.destinationPath(this.options.generateInto, 'lib/index.js');

    this.fs.copyTpl(this.templatePath('index.js'), filepath);

    this.composeWith(require.resolve('generator-jest/generators/test'), {
      arguments: [filepath],
      componentName: _.camelCase(this.options.name)
    });
  }
};
