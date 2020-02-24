const firost = require('firost');
const helper = require('../helper');

module.exports = {
  async run() {
    // Update the asset manifest
    const manifest = await helper.manifest();
    await firost.writeJson(manifest, './manifest.json');

    // We need to give some time to git to assess that the file didn't actually
    // change otherwise it might confuse it and think the repository is unclean
    // and prevent releasing
    await firost.run('git status', { stdout: false });
    console.info('Manifest updated');
  },
};
