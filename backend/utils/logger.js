const isProduction = process.env.NODE_ENV === 'production';

function format(level, args) {
  const timestamp = new Date().toISOString();
  return [`[${timestamp}]`, level.toUpperCase(), ...args];
}

function write(level, ...args) {
  if (level === 'debug' && isProduction) {
    return;
  }

  const output = level === 'error' ? console.error : level === 'warn' ? console.warn : console.log;
  output(...format(level, args));
}

const logger = {
  debug: (...args) => write('debug', ...args),
  info: (...args) => write('info', ...args),
  warn: (...args) => write('warn', ...args),
  error: (...args) => write('error', ...args)
};

module.exports = logger;
module.exports.logger = logger;
