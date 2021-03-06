# dashdev-website

A  website created using the Node.js Metalsmith static site generator.

## Installation

Please ensure [Node.js](https://nodejs.org/) and [Git](https://git-scm.com/) are installed on your system.

Download the demonstration code and switch to directory:

```bash
git clone git@github.com:dashdev-suite/dashdev-website.git
cd dashdev-website
```

Install dependencies:

```bash
npm install
```

## Build the static site

To build and launch the site using [Browsersync](https://www.browsersync.io/):

```bash
npm start
```

(Stop the server with `Ctrl+C`.)

To build the site for production and compress HTML files:

```bash
npm run production
```

on windows command line (not powershell, not vscode terminal):

```bash
npm run production-win
```

The site is built in the `/build` folder.

To deploy the contents of the `/build` folder to Github Pages, run the appropriate production build command, then:

```bash
npm run deploy
```

## Further information
 
The [built site](https://rawgit.com/dashdev-suite/dashdev-website/master/build/) provides further information about site files and settings.
