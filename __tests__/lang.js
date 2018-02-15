'use strict';
/**
 * This one will be passing the --lang=cn option to test whether it works or not
 * and one more additonal thing need to check which is the .yo-rc file created or not
 */
const _ = require('lodash');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');
const packageName = 'generator-nodex';

jest.setTimeout(10000);

const appDescription = `A node generator with extended features by NEWBRAN.CH`;

describe('nodex:app', () => {
  beforeEach(() => {
    jest.mock('npm-name', () => {
      return () => Promise.resolve(true);
    });

    jest.mock('github-username', () => {
      return () => Promise.resolve('unicornUser');
    });

    jest.mock('generator-license/app', () => {
      const helpers = require('yeoman-test');
      return helpers.createDummyGenerator();
    });
  });

  describe('running on new project', () => {
    test('scaffold a full project', () => {
      const answers = {
        name: packageName,
        description: appDescription,
        homepage: 'http://yeoman.io',
        githubAccount: 'yeoman',
        installer: 'yarnInstall',
        authorName: 'The Yeoman Team',
        authorEmail: 'hi@yeoman.io',
        authorUrl: 'http://yeoman.io',
        keywords: ['foo', 'bar'],
        setupTravis: true,
        includeCoveralls: true,
        setupNginx: false
      };
      return helpers
        .run(require.resolve('../generators/app'))
        .withOptions({
          lang: 'cn'
        })
        .withPrompts(answers)
        .then(() => {
          assert.file([
            '.travis.yml',
            '.editorconfig',
            '.gitignore',
            '.gitattributes',
            'README.md',
            'lib/index.js',
            'lib/__tests__/generatorNodex.test.js'
          ]);

          assert.file('package.json');
          assert.jsonFileContent('package.json', {
            name: packageName,
            version: '0.0.0',
            description: answers.description,
            homepage: answers.homepage,
            repository: 'yeoman/' + packageName,
            author: {
              name: answers.authorName,
              email: answers.authorEmail,
              url: answers.authorUrl
            },
            files: ['lib'],
            keywords: answers.keywords,
            main: 'lib/index.js'
          });

          assert.file('README.md');
          assert.fileContent(
            'README.md',
            `const generatorNodex = require('${packageName}');`
          );
          assert.fileContent('README.md', `> ${appDescription}`);
          assert.fileContent('README.md', `$ npm install --save ${packageName}`);
          assert.fileContent('README.md', '© [The Yeoman Team](http://yeoman.io)');
          assert.fileContent(
            'README.md',
            `[travis-image]: https://travis-ci.org/yeoman/${packageName}.svg?branch=master`
          );
          assert.fileContent('README.md', 'coveralls');
          assert.fileContent('.travis.yml', '| coveralls');
          // New code check if the .yo-rc exist or not
          assert.file('.yo-rc.json');
          // Then check if the language and the installer is correct or not
          assert.fileContent('.yo-rc.json', 'yarnInstall');
        });
    });
  });

  describe('running on existing project', () => {
    test('Keeps current Readme and extend package.json fields', () => {
      const pkg = {
        version: '1.0.34',
        description: 'lots of fun',
        homepage: 'http://yeoman.io',
        repository: 'yeoman/' + packageName,
        author: 'The Yeoman Team',
        files: ['lib'],
        keywords: ['bar']
      };
      return helpers
        .run(require.resolve('../generators/app'))
        .withPrompts({ name: packageName })
        .on('ready', gen => {
          gen.fs.writeJSON(gen.destinationPath('package.json'), pkg);
          gen.fs.write(gen.destinationPath('README.md'), 'foo');
        })
        .then(() => {
          const newPkg = _.extend({ name: packageName }, pkg);
          assert.jsonFileContent('package.json', newPkg);
          assert.fileContent('README.md', 'foo');
        });
    });
  });

  describe('--no-travis', () => {
    test('skip .travis.yml', () => {
      return helpers
        .run(require.resolve('../generators/app'))
        .withOptions({ travis: false })
        .then(() => assert.noFile('.travis.yml'));
    });
  });

  describe('--projectRoot', () => {
    test('include the raw files', () => {
      return helpers
        .run(require.resolve('../generators/app'))
        .withOptions({ projectRoot: 'generators' })
        .then(() => {
          assert.jsonFileContent('package.json', {
            files: ['generators'],
            main: 'generators/index.js'
          });
        });
    });
  });

  describe('--no-editorconfig', () => {
    test('include the raw files', () => {
      return helpers
        .run(require.resolve('../generators/app'))
        .withOptions({ editorconfig: false })
        .then(() => assert.noFile('.editorconfig'));
    });
  });
});
