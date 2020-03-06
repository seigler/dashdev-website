---
title: Build
description: How to build the static site using Metalsmith.
priority: 0.45
---

To build and launch the site in a test server using [Browsersync](https://www.browsersync.io/):

	npm start

(Stop the server with `Ctrl+C`.)

To build the site for production and compress HTML files:

	npm run production

The site is built in the `/build` folder.

Note you may want to change the `siteMeta.domain` and `siteMeta.rootpath` on lines 52 and 53 of `./build.js`.
