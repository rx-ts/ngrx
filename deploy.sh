#!/bin/sh

set -e

git remote set-url origin https://user:$GH_TOKEN@github.com/rx-ts/ngrx.git
npm set //registry.npmjs.org/:_authToken $NPM_TOKEN

yarn run standard-version -a
git push --follow-tags origin release:master

cd dist
npm publish --access=public
