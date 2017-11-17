'use strict';
const _ = require('lodash');
const path = require('path');
const chalk = require('chalk');
const parseAuthor = require('parse-author');
// Const cmdExist = require('command-exists');
const extend = _.merge;
const Generator = require('../../lib');
const pkgJson = require('../../package.json');
const inTest = process.env.NODE_ENV === 'test';
// Export
module.exports = class extends Generator {
  constructor(args, options) {
    super(args, options);
    // To turn this off use --no-travis
    this.option('travis', {
      type: Boolean,
      required: false,
      default: true,
      desc: 'travis'
    });

    this.option('boilerplate', {
      type: Boolean,
      required: false,
      default: true,
      desc: 'boilerplate'
    });

    this.option('cli', {
      type: Boolean,
      required: false,
      default: false,
      desc: 'cli'
    });

    this.option('coveralls', {
      type: Boolean,
      required: false,
      desc: 'coveralls'
    });

    this.option('editorconfig', {
      type: Boolean,
      required: false,
      default: true,
      desc: 'editorconfig'
    });

    this.option('license', {
      type: Boolean,
      required: false,
      default: true,
      desc: 'license'
    });

    this.option('name', {
      type: String,
      required: false,
      desc: 'PROJECT_NAME'
    });

    this.option('githubAccount', {
      type: String,
      required: false,
      desc: 'githubAccount'
    });

    this.option('projectRoot', {
      type: String,
      required: false,
      default: 'lib',
      desc: 'projectRoot'
    });

    this.option('readme', {
      type: String,
      required: false,
      desc: 'readme'
    });
    // We might want to skip the install when use inside another generator
    this.option('skip-nodex-install', {
      type: Boolean,
      required: false,
      default: false,
      desc: 'skip-install'
    });
    // If this option pass then we know it's an webapp
    this.option('use-pwa', {
      type: Boolean,
      required: false,
      default: false,
      desc: 'use-pwa'
    });
  }

  initializing() {
    this.pkg = this.fs.readJSON(this.destinationPath('package.json'), {});
    // Just to tell the user what the hack they are running
    if (!inTest && !this.options['skip-package-name-message']) {
      this.log(chalk.yellow(pkgJson.name) + '@' + chalk.yellow(pkgJson.version));
    }
    // Pre set the default props from the information we have at this point
    this.props = {
      name: this.pkg.name,
      description: this.pkg.description,
      version: this.pkg.version,
      homepage: this.pkg.homepage
    };
    if (_.isObject(this.pkg.author)) {
      this.props.authorName = this.pkg.author.name;
      this.props.authorEmail = this.pkg.author.email;
      this.props.authorUrl = this.pkg.author.url;
    } else if (_.isString(this.pkg.author)) {
      const info = parseAuthor(this.pkg.author);
      this.props.authorName = info.name;
      this.props.authorEmail = info.email;
      this.props.authorUrl = info.url;
    }
  }

  _askFor() {
    const prompts = [
      {
        name: 'description',
        message: 'description',
        when: !this.props.description
      },
      {
        name: 'homepage',
        message: 'homepage',
        when: !this.props.homepage
      },
      {
        name: 'authorName',
        message: 'authorName',
        when: !this.props.authorName,
        default: this.user.git.name(),
        store: true
      },
      {
        name: 'authorEmail',
        message: 'authorEmail',
        when: !this.props.authorEmail,
        default: this.user.git.email(),
        store: true
      },
      {
        name: 'authorUrl',
        message: 'authorUrl',
        when: !this.props.authorUrl,
        store: true
      },
      {
        name: 'keywords',
        message: 'keywords',
        when: !this.pkg.keywords,
        filter(words) {
          return words.split(/\s*,\s*/g);
        }
      },
      {
        name: 'includeCoveralls',
        type: 'confirm',
        message: 'includeCoveralls',
        when: this.options.coveralls === undefined
      }
    ];
    return this.prompt(prompts).then(props => {
      this.props = extend(this.props, props);
    });
  }

  /**
   * Execute the prompt
   */
  prompting() {
    return (
      this.installerAskForModuleName()
        .then(this._askFor.bind(this))
        .then(this.installerAskForGithubAccount.bind(this))
        // .then(this.installerAskForNginxOption.bind(this))
        .then(this.installerAskForInstaller.bind(this))
    );
  }

  /**
   * Writing files to disk
   */
  writing() {
    // Re-read the content at this point because a composed generator might modify it.
    const currentPkg = this.fs.readJSON(this.destinationPath('package.json'), {});

    const pkg = extend(
      {
        name: _.kebabCase(this.props.name),
        version: '0.0.0',
        description: this.props.description,
        homepage: this.props.homepage,
        author: {
          name: this.props.authorName,
          email: this.props.authorEmail,
          url: this.props.authorUrl
        },
        files: [this.options.projectRoot],
        main: path.join(this.options.projectRoot, 'index.js').replace(/\\/g, '/'),
        keywords: [],
        devDependencies: {}
      },
      currentPkg
    );

    if (this.props.includeCoveralls) {
      pkg.devDependencies.coveralls = pkgJson.devDependencies.coveralls;
    }
    // Combine the keywords
    if (this.props.keywords && this.props.keywords.length) {
      pkg.keywords = _.uniq(this.props.keywords.concat(pkg.keywords));
    }
    // Additonal package require for performing the ncu checks
    // @TODO to add swiss army knife
    /*
    if (!cmdExist('ncu')) {
      pkg.devDependencies['npm-check-updates'] = '*';
    }
    */
    // Let's extend package.json so we're not overwriting user previous fields
    this.fs.writeJSON(this.destinationPath('package.json'), pkg);
  }

  default() {
    if (this.options.travis) {
      let options = { config: {} };
      if (this.props.includeCoveralls) {
        options.config.after_script = 'cat ./coverage/lcov.info | coveralls'; // eslint-disable-line camelcase
      }
      this.composeWith(require.resolve('generator-travis/generators/app'), options);
    }

    if (this.options.editorconfig) {
      this.composeWith(require.resolve('../editorconfig'));
    }

    this.composeWith(require.resolve('../nsp'));
    this.composeWith(require.resolve('../eslint'));
    // Setup git
    this.composeWith(require.resolve('../git'), {
      name: this.props.name,
      githubAccount: this.props.githubAccount
    });
    // Setup jest
    // @TODO should let the user choose between Mocha/Chai or Jest
    /*
    HOW TO:
    yo jest:test path/to/file-to-test.js

    # (optional) You can specifically define your component name
    yo jest:test path/to/file-to-test.js --componentName=useThisName
    */
    this.composeWith(require.resolve('generator-jest/generators/app'), {
      filepath: this.destinationPath(),
      testEnvironment: this.options['use-pwa'] ? 'jsdom' : 'node',
      coveralls: this.props.includeCoveralls
    });

    if (this.options.boilerplate) {
      this.composeWith(require.resolve('../boilerplate'), {
        name: this.props.name
      });
    }
    // @TODO this could be putting into the first question
    // if they want to create module / webapp or cli ?
    if (this.options.cli) {
      this.composeWith(require.resolve('../cli'));
    }
    // Here is where the questions coming from
    // https://github.com/jozefizso/generator-license
    if (this.options.license && !this.pkg.license) {
      this.composeWith(require.resolve('generator-license/app'), {
        name: this.props.authorName,
        email: this.props.authorEmail,
        website: this.props.authorUrl,
        licensePrompt: this.t('Which license do you want to use?')
      });
    }

    if (!this.fs.exists(this.destinationPath('README.md'))) {
      this.composeWith(require.resolve('../readme'), {
        name: this.props.name,
        description: this.props.description,
        githubAccount: this.props.githubAccount,
        authorName: this.props.authorName,
        authorUrl: this.props.authorUrl,
        coveralls: this.props.includeCoveralls,
        content: this.options.readme
      });
    }
    // Perform an upgrade on the deps
    // the problem is the package.json is not create here yet ...
    // this.composeWith(require.resolve('../ncu'));
  }

  /**
   * Run the installer
   */
  install() {
    if (!this.options['skip-nodex-install']) {
      this.installerInstallDependencies();
    }
  }

  /**
   * Finish
   */
  end() {
    if (!this.options['skip-nodex-install']) {
      this.log(this.t('thankyou', { generator: this.baseConfig.pkgName }));
    }
    // @TODO add gitlab cli option
    if (this.options.travis) {
      let travisUrl = chalk.cyan(
        `https://travis-ci.org/profile/${this.props.githubAccount || ''}`
      );
      this.log(this.t('travisUrl', { travisUrl }));
    }

    if (this.props.includeCoveralls) {
      let coverallsUrl = chalk.cyan('https://coveralls.io/repos/new');
      this.log(this.t('coverallsUrl', { coverallsUrl }));
    }
    // Make sure everything save into yo-rc.json
    this.config.set(_.extend(this.props, { lang: this.lang }));
    // Finally tell the user how to use ncu
    if (!this.options['skip-nodex-install']) {
      this.log(
        chalk.yellow(
          this.t(
            'Now you can run `yo nodex:ncu` to check if your packages are all up to date'
          )
        )
      );
      this.log(
        chalk.green(
          this.t(
            'You can also checkout the `yo nodex:nginx` & `yo nodex:systemd` sub generator'
          )
        )
      );
    }
  }
};
