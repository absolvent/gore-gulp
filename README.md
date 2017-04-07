![gore-gulp](https://cdn.rawgit.com/goreutils/goreutils.github.io/e0ee67e872580d23c27a9eb5f9ab3e8cf3ed72ed/assets/gore-gulp.png)

# gore-gulp

## What does this package contain?

**gore-gulp** is a simple and universal Gulp configuration boilerplate for
JavaScript projects.

**gore-gulp** supports React, React Native and Webpack based projects
especially well.

It currently provides a set of predefined gulp tasks that suit most JavaScript projects. Instead of manually configuring gulp, you can just
setup your project with **gore-gulp** using this one-liner (this would be your
entire gulpfile.js if you do not need any non-js build steps. You'll have to
handle those on your own):

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
$ gulp publish # transpiles your code to ES5 to make it publish ready
$ gulp update-snapshots # updates shapshots created by ava
```

**gore-gulp** takes advantage of [package.json's "directories"](https://docs.npmjs.com/files/package.json#directorieslib)
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
`*.entry.coffee` files inside `./my-package` and output
production-ready to the `./dist` directory. For `lib` you can also configure multiple sources by placing an array of directories.

It would also make `publish` task to look fo all `*.js`, `*.jsx` files inside `./my-package` and output
ES5 transpiled versions to the ./dist` directory keeping folder structure. This is usefull when your project is a JS library and you want it to be easily consumable from public repository.

## Why is gore-gulp so special?

**gore-gulp** is not like any traditional boilerplate. I
maintain nearly 10 production websites and I find copying and pasting configuration
files or even generating project stubs with tools like [yeoman](http://yeoman.io/) really painful (respect to
[yeoman](http://yeoman.io/), scaffolding just does not suit my needs). What I
intend to achieve is to unite JavaScript tools and frameworks such as Webpack and React, and
keep them in a package that requires no configuration.

If you want to use **gore-gulp**, all you need to do is to add this package
to the `devDependencies` of your `package.json`.

```bash
$ npm install --save-dev gore-gulp
```


Feel free to open an issue if you’d like to see any changes.

## Features

### Vendor (non-NPM) libraries support

To support libraries from sources other than NPM—bower, for example—you need to
specify an `alias` key in your `package.json`.

For example if you need to use bower edition of
[RxJS](https://github.com/Reactive-Extensions/RxJS) (for some strange reason)
you can configure your project like this:

```JSON
{
    "alias": {
        "rxjs": "bower_components/rxjs/dist/rx.all"
    },
    "directories": {
        "dist": "my-output-folder",
        "lib": "library-with-bower-components"
    },
    "name": "my-library-with-bower-components"
}
```

And then use it like this:

```JavaScript
// library-with-bower-components/index.entry.js

import Rx from "rxjs";
```

Internally, `alias` key is an exposed
[webpack configuration field](http://webpack.github.io/docs/configuration.html#resolve-alias).
Aliased paths are processed by **gore-gulp** before passing them to `webpack`
to ensure that they are relative to base package directory (the one that holds
`package.json`).

## Examples

### How to start a project with gore-gulp?

1. Add `directories.dist` and `directories.lib` sections to your `package.json`.
2. Setup your `gulpfile.js` with **gore-gulp**:

    ```JavaScript
    var gg = require("gore-gulp"),
        gulp = require("gulp");

    gg(__dirname).setup(gulp);
    ```

3. Generate code using `gulp webpack` (use `NODE_ENV=production` for more
optimizations).

#### Complete example

Visit the [example](example) directory for preconfigured project.

### How can I use my local configuration file?

Currently it is only possible to override
[eslint](https://github.com/eslint/eslint) settings by placing your `.eslintrc`
file into the base project directory (the one that holds your `package.json`).

### How can I integrate gore-gulp into my editor?

Please check
[goreutils/gore-gulp-sublime-text](https://github.com/goreutils/gore-gulp-sublime-text)
for instruction on how to integrate **gore-gulp** with **Sublime Text** and
benefit from global linter settings.

### Can I still use plain gulp tasks?

Of course!

```JavaScript
// gulpfile.js

gg(__dirname).setup(gulp);

gulp.task("sass", function () {
   return gulp.src("*.sass")
        .pipe(sass())
        .pipe(gulp.dest("assets"));
});
```

### How to specify gore-gulp tasks dependencies?

```JavaScript
// gulpfile.js

const setup = gg(__dirname);

setup.setup(gulp);

gulp.task("my-dependency", function () {
    // this tasks is going to start before linter
});

gulp.task("lint", ["my-dependency"], setup.tasks.lint);
```

### Can I autoload dependencies?

Sure, use package.json's `provide` key (it will also satisfy linter for the given variable):

```JSON
// package.json

{
    "dependencies": {
        "bluebird": "2.x"
    },
    "provide": {
        "Promise": "bluebird"
    }
}
```

```JavaScript
// index.entry.js

new Promise(function () {
    // no errors in this file
    // Promise is automatically included
});
```

### How to run a subset of tests?

You can use the `glob` switch:

```bash
$ gulp test --glob ./mylibrary/__tests__/subdir/*.test.js
```

### How to create snapshot tests?

You can leverage built in [AVA](https://github.com/avajs/ava) features.

First make sure to enable AVA by `useAva` switch:

```JavaScript
// gulpfile.js

gg({
  baseDir: __dirname,
  useAva: true,
}).setup(gulp);
```

Than follow instructions of AVA's [snapshot testing](https://github.com/avajs/ava#snapshot-testing)

And then run tests as usual:

```bash
$ gulp test
```

To update snapshot files there is another task:

```bash
$ gulp update-snapshots
```

## Summary

The goal of this package is to provide a one-liner gulp configuration that enables the programmer to quickly start coding with the best practices of modern JavaScript.

---

[![Build Status](http://img.shields.io/travis/goreutils/gore-gulp.svg?style=flat)](https://travis-ci.org/goreutils/gore-gulp)
[![Code Climate](http://img.shields.io/codeclimate/github/goreutils/gore-gulp.svg?style=flat)](https://codeclimate.com/github/goreutils/gore-gulp)
[![Dependency Status](http://img.shields.io/david/goreutils/gore-gulp.svg?style=flat)](https://david-dm.org/goreutils/gore-gulp)
