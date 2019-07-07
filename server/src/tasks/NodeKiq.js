class Benchmark {
  static ram() {
    const used = process.memoryUsage();
    for (const key in used) {
      console.log(`${key} ${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB`);
    }
  }

  /**
   * @return {number}
   *   RAM in MB
   */
  static ramRss() {
    const used = process.memoryUsage();
    return Math.round(used.rss / 1024 / 1024 * 100) / 100;
  }
}

Benchmark.time = console.time;
Benchmark.timeEnd = console.timeEnd;

const PULL_DELAY = 5000; // delay between polling
const MAX_RAM = 500; // if we reach this limit (when task finished) - process will be restarted by supervisor

class NodeKiq {
  static async execute(cliOptions) {
    while (true) {
      try {
        await this._newRound();
      } catch (e) {
        console.error('ERROR', e);
      }
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, PULL_DELAY);
      });
    }
  }

  static async _newRound() {
    if (Benchmark.ramRss() > MAX_RAM) {
      console.error(`NodeKiq/exit (RAM:${Benchmark.ramRss()}): RAM limit reached ${MAX_RAM}`);
      process.exit(0); // now supervisor will start process again
    }
    console.log(`NodeKiq/newRound (RAM:${Benchmark.ramRss()}):`);
    let messages = [ { job: "MyJob", params: { foo: "bar" } } ];
    for (let i in messages) {
      let message = messages[i];
      console.log("NodeKiq/message", message);
    }
  }
}

module.exports = NodeKiq;
