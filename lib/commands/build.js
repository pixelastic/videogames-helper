import firost from 'firost';
import helper from '../helper';

export default {
  async run() {
    const manifest = await helper.manifest();
    await firost.writeJson(manifest, './manifest.json');

    // We need to give some time to git to asses that the file didn't actually
    // change otherwise it might confuse it and think the repository is unclean
    // and prevent releasing
    await firost.run('git status', { stdout: false });
    console.info('Manifest updated');
  },
};
