VERSION=$1

echo "Applying version ${VERSION} to manifests"

cd public

jq ".version = \"${VERSION}\"" manifest.webapp > tmp.json && mv tmp.json manifest.webapp
jq ".b2g_features.version = \"${VERSION}\"" manifest.webmanifest > tmp.json && mv tmp.json manifest.webmanifest
jq ".b2g_features.version = \"${VERSION}\"" manifest.en-US.webmanifest > tmp.json && mv tmp.json manifest.en-US.webmanifest

cd -

echo "Done"
