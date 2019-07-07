class LogEnv {
  static async execute() {
    console.log(process.env, process.argv);
    process.exit(0);
  }
}

module.exports = LogEnv;
