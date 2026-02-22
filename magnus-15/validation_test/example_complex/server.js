// server.js - Entry point (orchestration with edges)

const { loginUser } = require('./auth');
const { processPayment } = require('./payment');
const { flowData, log_error } = require('./utils');
const { legacyAuth } = require('./legacy');

async function main() {
  try {
    const authResult = await loginUser('test', 'pass');
    flowData(authResult);

    legacyAuth('test', 'pass', (err, result) => {
      if (err) log_error(err);
      console.log(result);
    });

    const payment = await processPayment(100);
    console.log(payment);
  } catch (e) {
    log_error(e);
  }
}

main();

module.exports = { main };
