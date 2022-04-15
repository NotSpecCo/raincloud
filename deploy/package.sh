VERSION=$1

echo "Packaging version ${VERSION}"

cd public && zip -r ../RainCloud_v${VERSION}.zip * && cd ..