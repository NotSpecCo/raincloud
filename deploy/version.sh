VERSION=$1

echo "Applying version ${VERSION} to manifests"

jq ".version = \"${VERSION}\"" public/manifest.webapp > tmp.json && mv tmp.json manifest.webapp
jq ".b2g_features.version = \"${VERSION}\"" public/manifest.webmanifest > tmp.json && mv tmp.json public/manifest.webmanifest
jq ".b2g_features.version = \"${VERSION}\"" public/manifest.en-US.webmanifest > tmp.json && mv tmp.json public/manifest.en-US.webmanifest