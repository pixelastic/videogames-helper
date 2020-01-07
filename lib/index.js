import firost from 'firost';
import { _, pMap } from 'golgoth';
import path from 'path';

export default {
  async run() {
    // Generate the manifest
    const directories = await firost.glob('./assets/*');

    await pMap(directories, async filepath => {
      const dirname = path.basename(filepath);

      // Check if dir has some metadata
      const metadataPath = path.resolve(filepath, 'data.json');
      let metadata = {};
      if (await firost.exist(metadataPath)) {
        metadata = await firost.readJson(metadataPath);
      }

      //
      const data = {
        name: _.capitalize(dirname),
        ...metadata,
      };
      console.info(data);
    });
  },
};
