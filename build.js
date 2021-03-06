#!/usr/bin/env node

// defaults
var consoleLog = false; // set true for metalsmith file and meta content logging
var devBuild = ((process.env.NODE_ENV || '').trim().toLowerCase() !== 'production');
var pkg = require('./package.json');

// main directories
dir = {
    base: __dirname + '/',
    lib: __dirname + '/lib/',
    source: './src/',
    dest: './build/'
};

siteMeta = {
    devBuild: devBuild,
    version: pkg.version,
    name: 'dashdevs-suite',
    desc: 'dashdevs-suite metalsmith website',
    author: 'dashdevs',
    contact: 'https://chat.dashdevs.org',
    domain: devBuild ? 'http://127.0.0.1' : 'https://dashdev-suite.github.io', // set domain
    // rootpath: devBuild ? null : '/dashdev-website/build/' // set absolute path (null for relative)
    // for gh-pages npm package usage without "build/" dir:
    rootpath: devBuild ? null : '/dashdev-website/' // set absolute path (null for relative)

};

templateConfig = {
    engine: 'handlebars',
    directory: 'template/',
    partials: 'partials/',
    default: 'page.html'
};

// metalsmith
var Metalsmith = require('metalsmith');

// plugins
var markdown = require('metalsmith-markdown');
var markdownPrecompiler = require('metalsmith-markdown-precompiler');
var collections = require('metalsmith-collections');
var permalinks = require('metalsmith-permalinks');
var publish = require('metalsmith-publish');
var layouts = require('metalsmith-layouts');
var discoverPartials = require('metalsmith-discover-partials');
var paths = require('metalsmith-paths');
var sitemap = require('metalsmith-sitemap');
var rssfeed = require('metalsmith-feed');
var assets = require('metalsmith-assets');
var wordcount = require("metalsmith-word-count");

// plugins dependend on devbuild- or production-build
var htmlmin = devBuild ? null : require('metalsmith-html-minifier');
var browsersync = devBuild ? require('metalsmith-browser-sync') : null;

// custom plugins
var setdate = require(dir.lib + 'metalsmith-setdate');
var moremeta = require(dir.lib + 'metalsmith-moremeta');
var debug = consoleLog ? require(dir.lib + 'metalsmith-debug') : null;

console.log((devBuild ? 'Development' : 'Production'), 'build, version', pkg.version);


//  instantiate
var metalsmith = Metalsmith(__dirname)
    .clean(true) // clean folder before a production build
    .source(dir.source + 'html/') // source folder (src/)
    .destination(dir.dest) // build folder (build/)
    .metadata(siteMeta) // add meta data to every page
    .use(publish()) // draft, private, future-dated
    .use(discoverPartials({ // needed for markdownPrecompiler
        directory: 'partials',
        pattern: /\.hbs$/ // original partials .html but exactly these parameters work 
    }))
    // .use(json_to_files({
    //   source_path: './box/'
    // }))
    .use(paths())
    .use(setdate()) // set date on every page if not set in front-matter
    .use(collections({ // determine page collection/taxonomy
        page: {
            pattern: '**/index.*',
            sortBy: 'priority',
            reverse: true,
            refer: false
        },
        frontpage: {
            pattern: 'index.*',
            sortBy: 'priority',
            reverse: true,
            refer: false,
            metadata: {
                layout: './../src/layouts/frontpage.hbs' // default is <root>/layouts
            }
        },
        docs: {
            pattern: 'docs/**/*',
            sortBy: 'priority',
            reverse: true,
            refer: true,
            metadata: {
                layout: './../src/layouts/docs.hbs' // default is <root>/layouts
            }
        },
        blog: {
            pattern: 'blog/**/*',
            sortBy: 'date',
            reverse: true,
            refer: true,
            limit: 50,
            metadata: {
                layout: './../src/layouts/blog.hbs'
            }
        },
        tutorials: {
            pattern: 'tutorials/**/*',
            sortBy: 'priority',
            reverse: true,
            refer: true,
            limit: 50,
            metadata: {
                layout: './../src/layouts/tutorials.hbs'
            }
        },
        boxes: {
            pattern: 'boxes/**/*',
            sortBy: 'date',
            reverse: true,
            refer: true,
            limit: 50,
            metadata: {
                layout: './../src/layouts/boxes.hbs'
            }
        }
    }))
    .use(markdownPrecompiler({ // convert {{> navmain}} in header.html
        engine: "handlebars",
        pattern: /\.md$/, // regex; no idea why .md works, check discoverPartials above
        partialsPath: './../partials',
        partials: ['navmain', 'navsub', 'footer', 'header', 'meta', 'pagelist', 'pagelist-docs']
    }))
    .use(markdown()) // convert markdown
    .use(permalinks({ // generate permalinks
        pattern: ':mainCollection/:title'
    }))
    .use(wordcount({ // word count
        raw: true
    }))
    .use(moremeta()) // determine root paths and navigation, TODO check remove
    // .use(inplace({
    //   //engineOptions:  {},
    //   pattern: `partials.hbs/**`
    // }))
    // define default (add additional rules in collections plugin )
    .use(layouts({
        //engineOptions:  {},
        pattern: `**/index.*`,
        default: './../src/layouts/page.hbs'
    }))
    // .use(layouts({
    //   //engineOptions:  {},
    //   pattern: `article/**`,
    //   default: 'article.hbs'
    // }))

if (htmlmin) metalsmith.use(htmlmin()); // minify production HTML

if (debug) metalsmith.use(debug()); // output page debugging information

if (browsersync) metalsmith.use(browsersync({ // start test server
    server: dir.dest,
    files: [dir.source + '**/*']
}));

metalsmith
    .use(sitemap({ // generate sitemap.xml
        hostname: siteMeta.domain + (siteMeta.rootpath || ''),
        omitIndex: true // replace any paths ending in index.html with ''. Useful when you're using metalsmith-permalinks.
    }))
    .use(rssfeed({ // generate RSS feed for articles (update: now blog)
        collection: 'blog',
        site_url: siteMeta.domain + (siteMeta.rootpath || ''),
        title: siteMeta.name,
        description: siteMeta.desc
    }))
    .use(assets({ // copy assets: CSS, images etc.
        source: dir.source + 'assets/',
        destination: './'
    }))

.build(function(err) {
    if (err) throw err;
});