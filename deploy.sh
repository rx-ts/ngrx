#!/bin/sh

set -e

git remote set-url origin https://user:$GH_TOKEN@github.com/$TRAVIS_REPO_SLUG.git
npm set //registry.npmjs.org/:_authToken $NPM_TOKEN

git fetch origin master:master
git checkout master
yarn run standard-version -a
git push --follow-tags origin master

cd dist
npm publish --access=public
