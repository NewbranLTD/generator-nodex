'use strict';
const Generator = require('../../lib/index.js');
const rootPkg = require('../../package.json');

module.exports = class extends Generator {
  constructor(args, options) {
    super(args, options);

    this.option('generateInto', {
      type: String,
      required: false,
      default: '',
      desc: 'generateInto'
    });
  }

  writing() {
    const pkgJson = {
      devDependencies: {
        eslint: rootPkg.devDependencies.eslint,
        prettier: rootPkg.devDependencies.prettier,
        husky: rootPkg.devDependencies.husky,
        'lint-staged': rootPkg.devDependencies['lint-staged'],
        'eslint-config-prettier': rootPkg.devDependencies['eslint-config-prettier'],
        'eslint-plugin-prettier': rootPkg.devDependencies['eslint-plugin-prettier'],
        'eslint-config-xo': rootPkg.devDependencies['eslint-config-xo']
      },
      'lint-staged': rootPkg['lint-staged'],
      eslintConfig: rootPkg.eslintConfig,
      scripts: {
        pretest: rootPkg.scripts.pretest,
        precommit: rootPkg.scripts.precommit
      }
    };

    this.fs.extendJSON(
      this.destinationPath(this.options.generateInto, 'package.json'),
      pkgJson
    );

    this.fs.copy(
      this.templatePath('eslintignore'),
      this.destinationPath(this.options.generateInto, '.eslintignore')
    );
  }
};
