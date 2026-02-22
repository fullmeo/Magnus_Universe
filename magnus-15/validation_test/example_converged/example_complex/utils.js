// utils.js - Mixed helpers (edge: incoherent naming, errors)

function log_error(message) {
  console.error(message);
}

function checkValidity(data) {
  if (!data) {
    return false;
  }
  return true;
}

function panicOnError(err) {
  if (err) {
    log_error(err);
    process.exit(1);
  }
}

function flowData(input) {
  const output = checkValidity(input);
  if (!output) panicOnError('Invalid data');
  return output ? input.toUpperCase() : null;
}

module.exports = { log_error, checkValidity, flowData };
