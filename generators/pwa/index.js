'use strict';
/**
 * Generate pwa required files etc
 * This is too small to create a generator on it's own
 * so we included here, could call directly or copy over
 * to new generator
 * @TODO create a stock list icons to incorporate into the project
 * {
 *  "src": "launcher-icon-1x.png",
 *  "type": "image/png",
 *  "sizes": "48x48"
 * }
 */
const Generator = require('../../lib/index.js');
const glob = require('glob');
const _ = require('lodash');
const path = require('path');

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

  initializing() {
    if (this._checkIfAlreadyInstalled()) {
      this.foundImages = [];
      glob(
        path.join(this.destinationRoot(), this.baseConfig.iconsDir, '**', '*.*'),
        (err, files) => {
          if (!err) {
            this.foundImages = files;
          }
        }
      );
    }
  }

  /**
   * Need to ask for a cacheName
   * for cacheFiles we just read into the folder for a list?
   */
  prompting() {
    const prompts = [
      {
        name: 'cacheName',
        message: 'Provide a cache name',
        default: this.baseConfig.pkgName + '-cache'
      },
      {
        name: 'cacheDescription',
        message: 'Your cache manifest description',
        default: this.t('This is the cache manifest for ' + this.baseConfig.pkgName)
      },
      {
        name: 'startUrl',
        message: 'Your start up url for PWA',
        default: 'index.html?start=pwa'
      },
      // Extended info for manifest.json
      {
        name: 'displayStyle',
        message: 'Display style',
        type: 'list',
        choices: ['standalone', 'browser'],
        default: 'standalone'
      },
      {
        name: 'orientation',
        message: 'Default orientation',
        type: 'list',
        choices: ['portrait', 'landscape'],
        default: 'portrait'
      },
      {
        name: 'setColorAttr',
        message: 'Do you want to setup color attributes?',
        type: 'confirm',
        default: false
      },
      {
        name: 'backgroundColor',
        message: 'Background color',
        when: this.props.setColorAttr
      },
      {
        name: 'themeColor',
        message: 'Theme color',
        when: this.props.setColorAttr
      }
    ];
    // @TODO ask where their icons files are stored?
    // @TODO search for list of files to cache?

    return this.prompt(prompts).then(props => {
      this.props = _.merge(this.props, props);
      this.props.iconsList = false; // For the time being
      this.props.cacheFiles = '';
    });
  }

  /**
   * Generate and copy over the files based on the templates
   */
  writing() {
    // @TODO add lighthouse to the dependencies
    // @TODO add the scripts task to the package.json "./lighthouse http://localhost:8000"
    // The above the parameter should be pass via the options parameters

    // @TODO inject into their index.html file
    // const includeLink = `<link rel="manifest" href="/manifest.json">`;
    // @TODO iconsList --> image folder
    // @TODO cacheFiles
    // console.log(this.templatePath('manifest.json.tpl'));

    this._copyTpl(
      'manifest.json.tpl',
      [this.options.generateInto, this.baseConfig.appDir, 'manifest.json'],
      this.props
    );

    this._copyTpl(
      'service-worker.js.tpl',
      [this.options.generateInto, this.baseConfig.scriptDir, 'service-worker.js'],
      this.props
    );
  }
};
