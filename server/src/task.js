const file = process.argv[2];
const options = require('yargs').argv;

const task = require(`./tasks/${file}`);

(async () => {
    await task.execute(options);
})();
