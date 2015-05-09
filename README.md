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
production-ready to the `./dist` directory.

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

### Can I attach my own plugin and why should I do that?

The goal of **gore-gulp** is to provide a configuration-less (!) development
environment. But a centralized configuration is also easy to set up.
If your organization uses common patterns among projects, you can create an
NPM package with **gore-gulp** plugin and instead of configuring each project
via copy-pasting you can attach your plugin.

The minimal plugin is a factory function that returns a gulp task.

```JavaScript
// my-plugin.js

module.exports = {
    "dependencies": [],
    "factory": function (config, pckgPromise, gulpInstance) {
        return function () {
            // this function is going to be passed to the gulp.task call
            // config.baseDir is a directory of the host project (the one that uses gore-gulp)
            // pckgPromise resolves to host project's package.json contents
            // gulpInstance is the host project's gulp
        };
    },
    "name": "task-name"
};
```

```JavaScript
// gulpfile.js

var myPlugin = require("my-plugin");

gg(__dirname).plugin(myPlugin).setup(gulp)
```

Invoking with CLI:

```
$ gulp task-name
```

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

gg({
    "baseDir": __dirname,
    "dependencies": [
        "my-dependency"
    ]
}).setup(gulp);

gulp.task("my-dependency", function () {
    // this tasks is going to start before others
});
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


## Summary

The goal of this package is to provide a one-liner gulp configuration that enables the programmer to quickly start coding with the best practices of modern JavaScript.

---

[![Build Status](http://img.shields.io/travis/goreutils/gore-gulp.svg?style=flat)](https://travis-ci.org/goreutils/gore-gulp)
[![Code Climate](http://img.shields.io/codeclimate/github/goreutils/gore-gulp.svg?style=flat)](https://codeclimate.com/github/goreutils/gore-gulp)
[![Dependency Status](http://img.shields.io/david/goreutils/gore-gulp.svg?style=flat)](https://david-dm.org/goreutils/gore-gulp)
