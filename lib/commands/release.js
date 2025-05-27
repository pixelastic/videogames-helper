const firost = require('firost');

module.exports = {
  async run(args) {
    // Build the manifest
    await firost.run('yarn run build');

    // Commit it
    const status = await firost.run('git status -s', { stdout: false });
    if (status.stdout) {
      await firost.run('git add .');
      await firost.run('git commit -m chore(build):\\ Rebuild\\ manifest');
    }

    // Deploy assets
    await firost.run('yarn run deploy');

    // Release module
    const version = args._[0] || 'patch';
    await firost.run(`aberlaas release ${version} --no-test`);
  },
};
