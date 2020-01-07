import firost from 'firost';
import helper from '../helper';
import path from 'path';

export default {
  async run() {
    const rsyncDestination = await helper.rsyncDestination();
    const rsyncSource = path.resolve('./assets');

    const rsyncOptions = [
      '--chmod=Du=rwx,Dg=rwx,Do=rx,Fu=rw,Fg=rw,Fo=r',
      '--verbose',
      '--archive',
      '--compress',
      '--update',
      '--delete',
      '--prune-empty-dirs',
      '--include=*/',
      '--include=*/*.jpg',
      '--include=*/*.gif',
      '--include=*/*.png',
      '--exclude=*',
      `${rsyncSource}/`,
      rsyncDestination,
    ];
    await firost.run(`rsync ${rsyncOptions.join(' ')}`);
  },
};
