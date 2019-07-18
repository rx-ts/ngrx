#!/bin/sh

set -e

git remote set-url origin https://user:$GH_TOKEN@github.com/rx-ts/ngrx.git
npm set //registry.npmjs.org/:_authToken $NPM_TOKEN

git fetch origin master:master
git checkout release
git rebase master
yarn run standard-version -a
git push --follow-tags origin release:master

cd dist
npm publish --access=public
