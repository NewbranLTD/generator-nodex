# <%= projectName %> [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]<%
if (includeCoveralls) { %> [![Coverage percentage][coveralls-image]][coveralls-url]<% } -%>

> <%= description %>

<% if (!content) { -%>
## Installation

```sh
  $ npm install --save <%= projectName %>
```

or

```sh
  $ yarn add <%= projectName %>
```

## Usage

```js
const <%= safeProjectName %> = require('<%= projectName %>');

<%= safeProjectName %>('Magic');
```
<% } else { -%>
<%= content %>
<% } -%>
## License

<%= license %> © [<%= author.name %>](<%= author.url %>)


[npm-image]: https://badge.fury.io/js/<%= projectName %>.svg
[npm-url]: https://npmjs.org/package/<%= projectName %>
[travis-image]: https://travis-ci.org/<%= githubAccount %>/<%= projectName %>.svg?branch=master
[travis-url]: https://travis-ci.org/<%= githubAccount %>/<%= projectName %>
[daviddm-image]: https://david-dm.org/<%= githubAccount %>/<%= projectName %>.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/<%= githubAccount %>/<%= projectName %>
<% if (includeCoveralls) { -%>
[coveralls-image]: https://coveralls.io/repos/<%= githubAccount %>/<%= projectName %>/badge.svg
[coveralls-url]: https://coveralls.io/r/<%= githubAccount %>/<%= projectName %>
<% } -%>
