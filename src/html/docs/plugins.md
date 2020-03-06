---
title: Custom plugins
description: The custom plugins used to create this website.
priority: 0.3
---

The `build.js` file defines how the site is built using Metalsmith and various plugins.

Several custom plugins have been created specifically for this site:

* `lib/metalsmith-debug.js`: output debugging information to the console.
* `lib/metalsmith-setdate.js`: ensure each page has a date. If a `date` is not defined in the page's front-matter, it is presumed to be the publish or file creation date.
* `lib/metalsmith-moremeta.js`: applies further metadata to each page including the root folder, a default layout, primary and secondary navigation.
