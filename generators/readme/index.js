'use strict';
const _ = require('lodash');
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

    this.option('name', {
      type: String,
      required: true,
      desc: 'PROJECT_NAME'
    });

    this.option('description', {
      type: String,
      required: true,
      desc: 'projectDesc'
    });

    this.option('githubAccount', {
      type: String,
      required: true,
      desc: 'githubUser'
    });

    this.option('authorName', {
      type: String,
      required: true,
      desc: 'authorName'
    });

    this.option('authorUrl', {
      type: String,
      required: true,
      desc: 'authorUrl'
    });

    this.option('coveralls', {
      type: Boolean,
      required: true,
      desc: 'coveralls'
    });

    this.option('content', {
      type: String,
      required: false,
      desc: 'content'
    });
  }

  writing() {
    const pkg = this.fs.readJSON(
      this.destinationPath(this.options.generateInto, 'package.json'),
      {}
    );
    this.fs.copyTpl(
      this.templatePath('README.md'),
      this.destinationPath(this.options.generateInto, 'README.md'),
      {
        projectName: this.options.name,
        safeProjectName: _.camelCase(this.options.name),
        description: this.options.description,
        githubAccount: this.options.githubAccount,
        author: {
          name: this.options.authorName,
          url: this.options.authorUrl
        },
        license: pkg.license,
        includeCoveralls: this.options.coveralls,
        content: this.options.content
      }
    );
  }
};
