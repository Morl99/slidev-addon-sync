module.exports = {
  branches: ['main'],
  repositoryUrl: 'https://github.com/Morl99/slidev-addon-sync.git',
  tagFormat: 'v${version}',
  plugins: [
    require.resolve('@semantic-release/commit-analyzer'),
    require.resolve('@semantic-release/release-notes-generator'),
    [require.resolve('@semantic-release/npm'), {
      pkgRoot: 'artifact/package',
      npmPublish: true,
    }],
    [require.resolve('@semantic-release/github'), {
      successComment: false,
      failComment: false,
      failTitle: false,
      releasedLabels: false,
    }],
  ],
};
