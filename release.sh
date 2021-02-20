#!/usr/bin/env bash
echo "Tagging a release..."
#get highest tag number
VERSION=`node -e "console.log(require('./package.json').version);"`

#replace . with space so can split into an array
VERSION_BITS=(${VERSION//./ })

#get number parts and increase last one by 1
VNUM1=${VERSION_BITS[0]}
VNUM2=${VERSION_BITS[1]}
VNUM2=$((VNUM2+1))

#create new tag
NEW_TAG="$VNUM1.$VNUM2.0"

#get current hash and see if it already has a tag
GIT_COMMIT=`git rev-parse HEAD`
NEEDS_TAG=`git describe --contains ${GIT_COMMIT} 2>/dev/null`

#only tag if no tag already
if [[ -z "$NEEDS_TAG" ]]; then
    npm version ${NEW_TAG}
    echo "Tagged with $NEW_TAG"
    git push --tags
else
    echo "FAILED: No change for a release. (There is already a tag on the last commit)"
    exit 1
fi
rm -rf ./dist/*
npm run build
npm run typedecs

echo "Publishing to npm..."
npm publish