# Yo Generator nodex [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]

This generator is based on the [`generator-node`](https://github.com/yeoman/generator-node) with many extended features.

`generator-nodex`  creates a base template to start a new Node.js module, with extended features.

It is also easily composed into your own generators so you can only target your efforts at your generator's specific features.

This `generator-nodex` can also use as a parent class and create your own generator (instead of subclass directly from `yeoman-generator`)

```javascript
const Generator  = require('generator-nodex/lib');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
  }
}

```

We are currently working on finishing the last feature before we start putting the full documentation together.

---

## Different between [`generator-node`](https://github.com/yeoman/generator-node) and [`generator-nodex`](https://github.com/NewbranLTD/generator-nodex)

1. Added language option, currently support English (default) and Simplify Chinese. Pass `--lang=cn` flag will enable it.
2. You can import this and, use in your own generator (more detail in the wiki soon).
3. There are several additional sub generators, more detail below.
  * nginx - this is incorporated into the nodex generator  
  * systemd - this is stand alone, you can call it via `yo nodex:systemd`
  * ncu - npm-check-updates integrate into the generator
  * webhook - create poort man webhook ci support github, gitee or gitlab

You can run `yo nodex:help` to see the full list of sub generators available.

---

## Install

```
$ npm install --global generator-nodex
```

## Usage

```
$ yo nodex
```

*Note that this template will generate files in the current directory, so be sure to change to a new directory first if you don't want to overwrite existing files.*

That'll generate a project with all the common tools setup. This includes:

- Filled `package.json` file
- [jest](https://facebook.github.io/jest/) unit test and code coverage (optionally tracked on [Coveralls](https://coveralls.io/))
- [ESLint](http://eslint.org/) linting and code style checking
- [nsp](https://nodesecurity.io/) known vulnerability check
- [Travis CI](https://travis-ci.org/) continuous integration (optional)
- [License](https://spdx.org/licenses/)


### Running tests

Once the project is scaffolded, inside the project folder run:

```
$ npm test
```

You can also directly use jest to run test on single files:

```
$ npm -g install jest-cli
$ jest --watch
```


### Publishing your code

Once your tests are passing (ideally with a Travis CI green run), you might be ready to publish your code to npm. We recommend you using [npm version](https://docs.npmjs.com/cli/version) to tag release correctly.

```
$ npm version major
$ git push --follow-tags
# ATTENTION: There is no turning back here.
$ npm publish
```

## Extend this generator

First of all, make sure you're comfortable with [Yeoman composability](http://yeoman.io/authoring/composability.html) feature. Then in your own generator:

```js
var Generator = require('yeoman-generator');

module.exports = class extends Generator({
  default() {
    this.composeWith(require.resolve('generator-nodex/generators/app'), {
      /* provide the options you want */
    });
  }
});
```

### Options

Here's a list of our supported options:

- `boilerplate` (Boolean, default true) include or not the boilerplate files (`lib/index.js`, `test/index.js`).
- `cli` (Boolean, default false) include or not a `lib/cli.js` file.
- `editorconfig` (Boolean, default true) include or not a `.editorconfig` file.
- `git` (Boolean, default true) include or not the git files (`.gitattributes`, `.gitignore`).
- `license` (Boolean, default true) include or not a `LICENSE` file.
- `travis` (Boolean, default true) include or not a `.travis.yml` file.
- `githubAccount` (String) Account name for GitHub repo location.
- `readme` (String) content of the `README.md` file. Given this option, generator-nodex will still generate the title (with badges) and the license section.

### Sub generators

If you don't need all the features provided by the main generator, you can still use a limited set of features by composing with our sub generators directly.

Remember you can see the options of each sub generators by running `yo nodex:sub --help`.

- `nodex:boilerplate`
- `nodex:cli`
- `nodex:editorconfig`
- `nodex:eslint`
- `nodex:git`
- `nodex:nsp`
- `nodex:readme`
- `nodex:systemd`
- `nodex:webhook`
- `nodex:nginx`


## License

MIT © Yeoman team (http://yeoman.io)

[NEWBRAN.CH](https://newbran.ch)


[npm-image]: https://badge.fury.io/js/generator-nodex.svg
[npm-url]: https://npmjs.org/package/generator-nodex
[travis-image]: https://travis-ci.org/NewbranLTD/generator-nodex.svg?branch=master
[travis-url]: https://travis-ci.org/NewbranLTD/generator-nodex
[daviddm-image]: https://david-dm.org/NewbranLTD/generator-nodex.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/NewbranLTD/generator-nodex
