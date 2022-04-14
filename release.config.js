module.exports = {
  branches: ['main'],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/changelog',
    [
      '@semantic-release/exec',
      {
        publishCmd: 'cd public && zip -r ../RainCloud_v${nextRelease.version}.zip * && cd ..',
      },
    ],
    [
      '@semantic-release/github',
      {
        successComment: false,
        failComment: false,
        assets: [
          {
            path: 'RainCloud_v*.zip',
          },
        ],
      },
    ],
    '@semantic-release/git',
  ],
};
