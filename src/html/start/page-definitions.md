---
title: Page definitions
description: How pages are defined in the source folder.
priority: 0.35
---

Each sub-folder in `src/html` is a website section. Pages named `index.md` are the default page in section. File paths are translated to permalinks, e.g.

	src/html/article/mypage.md

is rendered to:

	build/article/mypage/index.html

Pages use YAML front-matter defined at the top. This can be referenced in templates or during the build process, e.g.

	---
	title: My page title
	description: A description of this page for meta tags and page lists.
	layout: page.html
	priority: 0.9
	publish: 2016-06-01
	date: 2016-06-01
	---

All items are optional. Note:

* `layout` defaults to `page.html` unless `metadata.layout` is defined for the page collection (see the `use(collections({ ... })` code in `build.js`).
* `priority` is a number between 0 (low) and 1 (high) which is used to order menus and define XML sitemaps.
* `publish` can be set `draft`, `private` or a future date to ensure it is not published until required.
* `date` is the date of the article. If not set, a future `publish` date or the file creation date is used.

The page content is defined in markdown, HTML syntax or both below the front-matter section. The content can include [Handlebars](http://handlebarsjs.com/) partials from the `src/partials` folder, e.g.

	\{{> partialname }}

where `partialname` is the partial filename without its `.html` extension.
