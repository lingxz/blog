#!/bin/bash
set -x
cd public
git init
git remote add origin 'ssh://git@165.22.255.104/home/git/blog.git'
git config user.name "Travis CI"
git config user.email "lingyihuu+travisCI@gmail.com"
git add .
git commit -am "new version $(date)" --allow-empty
git push origin --mirror
