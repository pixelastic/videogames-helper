import firost from 'firost';
import minimist from 'minimist';
import _ from 'golgoth/lib/_';
import build from './commands/build';
import deploy from './commands/deploy';
import release from './commands/release';

export default {
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
