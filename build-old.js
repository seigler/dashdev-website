#!/usr/bin/env node

/*
Metalsmith build file
Build site with `node ./build.js` or `npm start`
Build production site with `npm run production`
*/


'use strict';

var
  // defaults
  consoleLog = false, // set true for metalsmith file and meta content logging
  devBuild = ((process.env.NODE_ENV || '').trim().toLowerCase() !== 'production'),
  pkg = require('./package.json'),

  // main directories
  dir = {
    base: __dirname + '/',
    lib: __dirname + '/lib/',
    source: './src/',
    dest: './build/'
  },

  // modules
  metalsmith = require('metalsmith'),
  markdown = require('metalsmith-markdown'),
  publish = require('metalsmith-publish'),
  wordcount = require("metalsmith-word-count"),
  collections = require('metalsmith-collections'),
  permalinks = require('metalsmith-permalinks'),
  // jstransformer = require('metalsmith-jstransformer'),
  inplace = require('metalsmith-in-place'),
  layouts = require('metalsmith-layouts'),
  sitemap = require('metalsmith-mapsite'),
  rssfeed = require('metalsmith-feed'),
  assets = require('metalsmith-assets'),
  htmlmin = devBuild ? null : require('metalsmith-html-minifier'),
  browsersync = devBuild ? require('metalsmith-browser-sync') : null,
  // handlebars = require('jstransformer')(require('jstransformer-handlebars')),

  // custom plugins
  setdate = require(dir.lib + 'metalsmith-setdate'),
  moremeta = require(dir.lib + 'metalsmith-moremeta'),
  debug = consoleLog ? require(dir.lib + 'metalsmith-debug') : null,

  siteMeta = {
    devBuild: devBuild,
    version: pkg.version,
    name: 'dashdev-website',
    desc: 'metalsmith website', 
    author: 'dashdevs',
    contact: 'https://chat.dashdevs.org',
    domain: devBuild ? 'http://127.0.0.1' : 'https://rawgit.com', // set domain
    rootpath: devBuild ? null : '/dashdev-suite/dashdev-website/master/build/' // set absolute path (null for relative)
  },

  templateConfig = {
    engine: 'handlebars',
    directory: 'template/',
    partials: 'partials/',
    default: 'page.html'
  };

console.log((devBuild ? 'Development' : 'Production'), 'build, version', pkg.version);

var ms = metalsmith(dir.base)
  .clean(!devBuild) // clean folder before a production build
  .source(dir.source + 'html/') // source folder (src/html/)
  .destination(dir.dest) // build folder (build/)
  .metadata(siteMeta) // add meta data to every page
  .use(publish()) // draft, private, future-dated
  .use(setdate()) // set date on every page if not set in front-matter
  .use(collections({ // determine page collection/taxonomy
    page: {
      pattern: '**/index.*',
      sortBy: 'priority',
      reverse: true,
      refer: false
    },
    start: {
      pattern: 'start/**/*',
      sortBy: 'priority',
      reverse: true,
      refer: true,
      metadata: {
        layout: 'article.html'
      }
    },
    article: {
      pattern: 'article/**/*',
      sortBy: 'date',
      reverse: true,
      refer: true,
      limit: 50,
      metadata: {
        layout: 'article.html'
      }
    }
  }))
  .use(markdown()) // convert markdown
  .use(permalinks({ // generate permalinks
    pattern: ':mainCollection/:title'
  }))
  .use(wordcount({
    raw: true
  })) // word count
  .use(moremeta()) // determine root paths and navigation
  // .use(jstransformer({
  //   'pattern': '**',
  //   'layoutPattern': './src/html/**',
  //   'defaultLayout': null
  // }))
  .use(inplace(templateConfig)) // in-page templating
  .use(layouts(templateConfig)); // layout templating

if (htmlmin) ms.use(htmlmin()); // minify production HTML

if (debug) ms.use(debug()); // output page debugging information

if (browsersync) ms.use(browsersync({ // start test server
  server: dir.dest,
  files: [dir.source + '**/*']
}));

ms
  .use(sitemap({ // generate sitemap.xml
    hostname: siteMeta.domain + (siteMeta.rootpath || ''),
    omitIndex: true
  }))
  .use(rssfeed({ // generate RSS feed for articles
    collection: 'article',
    site_url: siteMeta.domain + (siteMeta.rootpath || ''),
    title: siteMeta.name,
    description: siteMeta.desc
  }))
  .use(assets({ // copy assets: CSS, images etc.
    source: dir.source + 'assets/',
    destination: './'
  }))
  .build(function (err) { // build
    if (err) throw err;
  });
