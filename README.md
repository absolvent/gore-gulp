# gore-gulp

Simple and univesal Gulp configuration boilerplate for managing all your
projects with the same and only configuration file.

## What does this package contain?

**gore-gulp** aims to be simple and univesal Gulp configuration boilerplate for
JavaScript projects.

I (the package maintainer) am the React.js fanatic so it is most probable that
**gore-gulp** will support React, React Native and Webpack based projects
especially well.

Currently it provides set of predefined gulp tasks that suit (hopefully) most
of typical web JavaScript projects. Instead of configuring **gulp** on your own
you can just setup your project using **gore-gulp** using this one-liner (this
would be your entire `gulpfile.js` if you do not need some non-js build steps
because you have to handle them on your own):

```JavaScript
// gulpfile.js

var gg = require("gore-gulp"),
    gulp = require("gulp");

gg(__dirname).setup(gulp);
```

...and then use predefined **gulp** tasks:

```Bash
$ gulp lint # check your code using highly demading linter to prevent bugs
$ gulp test # perform regression tests to refactor with confidence
$ gulp webpack # pack your code to make it production-ready
```

**gore-gulp** takes advantage of possibly not-used
[package.json#directories](https://docs.npmjs.com/files/package.json#directorieslib)
feature. If you configure your `package.json` like this:

```JSON
{
    "directories": {
        "dist": "./dist",
        "lib": "./my-package"
    }
}
```

It would make `webpack` task to look for all `*.entry.js`, `*.entry.jsx` and
`*.entry.coffee` files inside your `./my-package` directory and create
production-ready output files inside `./dist` directory.

## Why gore-gulp is so special?

**gore-gulp** is not the boilerplate in the classical meaning. At the current
point of my career I maintain almost 10 production websites and I find
copy-pasting configuration files or even generating project stubs with
generators like [yeoman](http://yeoman.io/) really painful (with all respect to
[yeoman](http://yeoman.io/), scaffolding just does not suit my needs).
What I intend to achieve is to collect best practices associated with
JavaScript, Webpack and popular frameworks (especially React family which I
really love) and keep them in one possibly zero-configuration package.

If you want to use **gore-gulp** all you need to do is to add this package
as your `package.json` `devDependency` and benefit from no-brainer predefined
tasks.

If you do not like my choice of features you can open an issue and
convince me that I made a bad decision somewhere.

## Summary

The goal of this package is to provide a one-liner that configures your
gulpfile to instantly jump into coding using up-to-date best JavaScript
practices.

---

[![Build Status](http://img.shields.io/travis/goreutils/gore-gulp.svg?style=flat)](https://travis-ci.org/goreutils/gore-gulp)
[![Code Climate](http://img.shields.io/codeclimate/github/goreutils/gore-gulp.svg?style=flat)](https://codeclimate.com/github/goreutils/gore-gulp)
[![Dependency Status](http://img.shields.io/david/goreutils/gore-gulp.svg?style=flat)](https://david-dm.org/goreutils/gore-gulp)
