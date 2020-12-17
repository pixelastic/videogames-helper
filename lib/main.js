const firost = require('firost');
const minimist = require('minimist');
const _ = require('golgoth/lodash');
const build = require('./commands/build');
const deploy = require('./commands/deploy');
const release = require('./commands/release');

module.exports = {
  /**
   * List of allowed commands to run
   * @returns {object} Hash of allowed commands
   **/
  safelist() {
    return {
      build,
      deploy,
      release,
    };
  },
  /**
   * Run the command specified on the command-line, along with specific
   * arguments
   * @param {Array} rawArgs CLI args
   **/
  async run(rawArgs) {
    const args = minimist(rawArgs, {
      boolean: true,
    });
    const commandName = args._[0];
    const command = this.safelist()[commandName];
    if (!command) {
      firost.consoleError(`Unknown command ${commandName}`);
      firost.exit(1);
      return;
    }

    // Remove the initial method from args passed to the command
    args._ = _.drop(args._, 1);

    try {
      await command.run(args);
    } catch (err) {
      firost.consoleError(err.message);
      firost.exit(1);
    }
  },
};
