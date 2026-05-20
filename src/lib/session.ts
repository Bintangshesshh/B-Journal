import { createHmac, timingSafeEqual } from 'crypto';

type SessionPayload = {
  userId: number;
  username: string;
  issuedAt: number;
  expiresAt: number;
};

const SECRET = process.env.SESSION_SECRET || 'dev-secret';
export const SESSION_COOKIE = 'bjournal_session';

const encode = (value: object) => Buffer.from(JSON.stringify(value)).toString('base64url');
const decode = (value: string) => JSON.parse(Buffer.from(value, 'base64url').toString('utf8')) as SessionPayload;

const sign = (value: string) => createHmac('sha256', SECRET).update(value).digest('base64url');

export const createSessionToken = (payload: SessionPayload) => {
  const encoded = encode(payload);
  const signature = sign(encoded);
  return `${encoded}.${signature}`;
};

export const verifySessionToken = (token: string | undefined | null) => {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [encoded, signature] = parts;
  const expected = sign(encoded);
  try {
    if (!timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
  } catch {
    return null;
  }

  const payload = decode(encoded);
  if (!payload?.expiresAt || payload.expiresAt < Date.now()) return null;
  return payload;
};
