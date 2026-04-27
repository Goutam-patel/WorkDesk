const bcrypt = require('bcryptjs');

const DEFAULT_SALT_ROUNDS = 10;

function getSaltRounds() {
  const fromEnv = Number.parseInt(process.env.BCRYPT_SALT_ROUNDS || '', 10);
  return Number.isInteger(fromEnv) && fromEnv > 3 ? fromEnv : DEFAULT_SALT_ROUNDS;
}

async function hashPassword(password) {
  return bcrypt.hash(password, getSaltRounds());
}

async function comparePassword(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword);
}

module.exports = {
  hashPassword,
  comparePassword
};
