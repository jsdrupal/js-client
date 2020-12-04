# js-client
![Sync git to drupal.org](https://github.com/jsdrupal/js-client/workflows/Sync%20git%20to%20drupal.org/badge.svg)
![CodeQL](https://github.com/jsdrupal/js-client/workflows/CodeQL/badge.svg)


This is a starter repository for the decoupled menus initiative. Not accepting pull requests currently as this will probably move to drupal.org.

## Structure

### client

This is the client that would ship to npm. Run `yarn build` to generate it at `client/index.js`.
Currently this is being automatically published to the GitHub npm package registry when you create a release (because we can delete it from GitHub, unlike npm :) ).

### docs

Next.js Docs site that's auto deployed to https://jsdrupal.justa.fish/

### example-node

An example node application using the client

## DX Demos

This is also for setting up example workflows for developer experience. Some of which is documented [here](https://github.com/jsdrupal/js-client/wiki/d.o-Wishlist).
