/* eslint */
/**
 * no-mixed-requires one-var
 * Breaking out from the base class
 * @2017-10-21 new idea to overload instead of calling the method directly
 * This way, we don't even need a default (en.json) file and just add
 * other translation into the lang/ folder
 */
const Generator = require('./base.js');
const _ = require('lodash');
const path = require('path');
const chalk = require('chalk');
const yosay = require('yosay');
// No mix require and other statement bs
const join = path.join;
// Export generator
module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
    this.defaultLang = 'en';
    // This.debugLog(chalk.yellow('<translate start>'));
    this.langObj = {};
    // Locale().then( loc => this.log('locale', loc));
    // tested on the 20 Oct 2017 - my macbook return en_GB
    const installedLang = this._checkIfAlreadyInstalled();
    // Always allow to pass the --lang option to overwrite
    this.lang = opts.lang
      ? opts.lang.toLowerCase()
      : installedLang || this.baseConfig.lang || this.defaultLang;
    // Init the langObj
    this._loadLangFile(this.lang);
  }

  /**
   * Overloading `option` method
   * @param {string} name of the param
   * @param {object} params to pass
   * @return {undefined} nothing
   */
  option(name, params) {
    // We only intereted in the `desc` property in params
    params.desc = this.t(params.desc);
    // Call the parent
    return super.option(name, params);
  }

  /**
   * Overloading the prompt
   * @param {array} prompts questions
   * @return {object} prompise
   */
  prompt(prompts) {
    if (!Array.isArray(prompts)) {
      prompts = [prompts];
    }
    return super.prompt(
      prompts.map(p => {
        p.message = this.t(p.message);
        return p;
      })
    );
  }

  /**
   * Overload the yosay method to provide translate
   * @param {string} message the test message
   * @param {object} params the items to replace
   * @return {function} yosay translated
   */
  yosay(...args) {
    // Wrap this in the log so we don't have to later on
    return this.log(yosay(this.t(...args)));
  }

  /**
   * Overload the `help` method and see what happen
   */
  help(...args) {
    super.help(...args);
  }

  /**
   * Translate - if there is not found in object try to use the key as text
   * @param {string} key to search in json
   * @param {mixed} replace (optional) key value pair to replace
   * @return {string} result or just the key if not found
   */
  t(key, replace) {
    if (!key) {
      return '';
    }
    const text = this.langObj[key] || key;
    if (replace && typeof replace === 'object') {
      return _.template(text)(replace);
    }
    return text;
  }

  /**
   * Load default lang if none
   * @param {string} lang language
   * @return {undefined}
   */
  _loadLangFile(lang) {
    let extLangObj = {};
    const file = [lang, 'json'].join('.');
    const langPath = join(__dirname, 'lang', file);
    const baseLangObj = this._loadLangFileAction(langPath);
    if (this.baseConfig.langPath) {
      extLangObj = this._loadLangFileAction(join(this.baseConfig.langPath, file));
    }
    this.langObj = _.extend(baseLangObj, extLangObj);
    // This.debugLog(this.langObj);
    this.debugLog(extLangObj);
  }

  /**
   * Loading the language file
   * @param {string} langPath path to the json file
   * @return {object} fail on empty
   */
  _loadLangFileAction(langPath) {
    try {
      return this.fs.readJSON(langPath) || {};
    } catch (e) {
      if (this.lang !== this.defaultLang) {
        this.log(chalk.red('Fail to load language json file!', this.lang, langPath));
      }
      this.debugLog('fail to load file?', e);
    }
    return {};
  }
};
