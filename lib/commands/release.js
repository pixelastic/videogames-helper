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
    await firost.run(`aberlaas release ${args._[0]} --no-test`);
  },
};
