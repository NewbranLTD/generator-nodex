'use strict';
/**
 * Simple qa to generator a nginx proxy config file
 */
const Generator = require('../../lib/index.js');
const _ = require('lodash');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
    // Default opts
    this.option('generateInto', {
      type: String,
      required: false,
      default: '',
      desc: 'generateInto'
    });

    // This.log(this.options.generateInto);
  }

  /**
   * Ask the required parameter to setup the nginx config
   */
  prompting() {
    const prompts = [
      {
        type: 'input',
        name: 'listenPortNumber',
        message: 'What port number is your server listening to?',
        default: 80
      },
      {
        type: 'input',
        name: 'serverName',
        message: `What's your server domain name?`,
        validate: input => input && input !== ''
      },
      {
        type: 'input',
        name: 'localhostName',
        message: `What's your localhost name (running nodejs app instance)?`,
        default: 'http://localhost'
      },
      {
        type: 'input',
        name: 'localhostPort',
        message: `What's the port number your nodejs app running from?`,
        default: 3000
      },
      {
        type: 'confirm',
        name: 'wwwDomain',
        message: 'Do you want to create a www.[your server name] domain entry?',
        default: false
      },
      {
        type: 'confirm',
        name: 'wwwForward',
        message:
          'Do you want to forward your www.[your server name] to your [server name]?',
        default: true,
        when: props => props.wwwDomain
      }
    ];
    return this.prompt(prompts).then(props => {
      this.props = _.extend(this.props, props);
    });
  }

  writing() {
    if (this.props.wwwDomain) {
      // They should be the same anyway
      this.props.subListenPortNumber = this.props.listenPortNumber;
      this.props.subDomainServerName = ['www', this.props.serverName].join('.');
    }

    this._copyTpl(
      'server.config.tpl',
      [this.options.generateInto, 'nginx.conf'],
      this.props
    );
  }
};
