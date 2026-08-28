import argon2 from 'argon2';

const options = {
  type: argon2.argon2id,
  memoryCost: Number(process.env.ARGON2_MEMORY) || 65536,
  timeCost: Number(process.env.ARGON2_TIME) || 4,
  parallelism: Number(process.env.ARGON2_PARALLELISM) || 4,
  hashLength: 32,
};

export async function hashPassword(password) {
  return argon2.hash(password, options);
}

export async function verifyPassword(hash, password) {
  return argon2.verify(hash, password);
}

export function needsRehash(hash) {
  return argon2.needsRehash(hash, options);
}
