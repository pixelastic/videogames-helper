const firost = require('firost');
const _ = require('golgoth/lib/lodash');
const pMapSeries = require('golgoth/lib/pMapSeries');
const path = require('path');

module.exports = {
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
   * Returns the content of the potential index.md file
   * @param {string} dirpath Path to the directory
   * @returns {string} Markdown content
   **/
  async directoryText(dirpath) {
    const markdownPath = `./assets/${dirpath}/index.md`;
    if (!(await firost.exist(markdownPath))) {
      return false;
    }
    return await firost.read(markdownPath);
  },
  /**
   * Returns directory-specific manifest
   * @param {string} dirpath Path to the directory
   * @returns {object} Manifest
   **/
  async directoryManifest(dirpath) {
    const metadata = await this.directoryMetadata(dirpath);
    const files = await this.directoryFiles(dirpath);
    const text = await this.directoryText(dirpath);

    return {
      name: _.capitalize(path.basename(dirpath)),
      ...metadata,
      files,
      text,
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
