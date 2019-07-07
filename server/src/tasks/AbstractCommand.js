class AbstractCommand {
  static execute() {
    throw new Error('define execute method');
  }
}

module.exports = AbstractCommand;
