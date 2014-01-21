#!/bin/bash

tmpdir=tmp
rootdir=`pwd`
basedir=`dirname $0`

rm -rf $tmpdir
mkdir -p $tmpdir

if ! test -d $tmpdir ; then
	echo "Invalid tmpdir! $tmpdir."
	exit 1
fi

$DART_SDK/bin/dart bin/analyzerexample.dart
$DART_SDK/bin/pub build

if ! test -f $basedir/build/index.html ; then
	echo "Unable to find build/index.html - in $basedir ?!"
	exit 1
fi

git clone -b gh-pages git@github.com:hpoul/timeline_charter_example.git $tmpdir/gh-pages

export GIT_WORK_TREE=$tmpdir/gh-pages/
export GIT_DIR=$tmpdir/gh-pages/.git
rm -rf $tmpdir/gh-pages/examples
mkdir -p $tmpdir/gh-pages/examples

#cp -r $basedir/out/web/packages $tmpdir/gh-pages/examples/
cp -a -L $basedir/build/* $tmpdir/gh-pages/examples/
cp latestdata.json $tmpdir/gh-pages/examples/

git add -A

git commit -m "fresh publish run. `date`"
git push
