#!/usr/bin/env bash
echo "Tagging a release..."
#get highest tag number
VERSION=`git describe --abbrev=0 --tags`

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
    git tag ${NEW_TAG}
    echo "Tagged with $NEW_TAG"
    git push --tags
else
    NEW_TAG="$VERSION"
    echo "Already a tag on this commit"
fi

echo "Publishing to npm..."
rm -rf ./dist/*
npm run build