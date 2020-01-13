import firost from 'firost';
import { _, pMapSeries } from 'golgoth';
import path from 'path';

export default {
  /**
   * Returns directory-specific metadata, as saved in the metadata.json file
   * @param {string} dirpath Path to the directory
   * @returns {object} Metadata
   **/
  async directoryMetadata(dirpath) {
    const jsonPath = path.resolve('./assets', dirpath, 'metadata.json');
    if (!(await firost.exist(jsonPath))) {
      return {};
    }
    return await firost.readJson(jsonPath);
  },
  /**
   * Returns directory list of iles
   * @param {string} dirpath Path to the directory
   * @returns {Array} List of files
   **/
  async directoryFiles(dirpath) {
    const glob = `./assets/${dirpath}/*.{jpg,png,gif}`;
    const files = await firost.glob(glob);
    return _.map(files, file => {
      return _.replace(file, './assets/', '');
    });
  },
  /**
   * Returns directory-specific manifest
   * @param {string} dirpath Path to the directory
   * @returns {object} Manifest
   **/
  async directoryManifest(dirpath) {
    const metadata = await this.directoryMetadata(dirpath);
    const files = await this.directoryFiles(dirpath);

    return {
      name: _.capitalize(path.basename(dirpath)),
      ...metadata,
      files,
    };
  },
  /**
   * Returns the project full manifest
   * @returns {object} Manifest
   **/
  async manifest() {
    const allFiles = await firost.glob('./assets/**/*');
    const directories = _.chain(allFiles)
      .map(entry => {
        const dirname = path.basename(path.dirname(entry));
        return dirname === 'assets' ? false : dirname;
      })
      .uniq()
      .compact()
      .value();

    const manifest = [];
    await pMapSeries(directories, async dirpath => {
      manifest.push(await this.directoryManifest(dirpath));
    });

    return manifest;
  },
  /**
   * Returns the rsync destination
   * @returns {string} Rsync destination
   **/
  async rsyncDestination() {
    const prefix = 'pixelastic:/var/www/assets.pixelastic.com/videogames/';
    const packageJson = await firost.readJson('./package.json');
    const projectSlug = _.replace(
      packageJson.name,
      '@pixelastic/videogames-assets-',
      ''
    );

    return `${prefix}${projectSlug}/`;
  },
};
