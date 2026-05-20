import { randomBytes, scryptSync, timingSafeEqual } from 'crypto';

type VerifyResult = {
  ok: boolean;
  needsRehash: boolean;
};

const PREFIX = 'scrypt';

export const hashPassword = (password: string) => {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 64).toString('hex');
  return `${PREFIX}$${salt}$${hash}`;
};

export const verifyPassword = (password: string, stored: string): VerifyResult => {
  if (!stored) return { ok: false, needsRehash: false };

  if (stored.startsWith(`${PREFIX}$`)) {
    const parts = stored.split('$');
    if (parts.length !== 3) return { ok: false, needsRehash: false };
    const salt = parts[1];
    const hashHex = parts[2];
    const hashBuf = Buffer.from(hashHex, 'hex');
    const derived = scryptSync(password, salt, hashBuf.length);
    const ok = timingSafeEqual(hashBuf, derived);
    return { ok, needsRehash: false };
  }

  const ok = password === stored;
  return { ok, needsRehash: ok };
};
