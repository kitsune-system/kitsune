import crypto from 'crypto';

export const random = () => randomBase();

export const randomBase = (size = 256) => {
  const len = Math.ceil(size / 8);
  return crypto.randomBytes(len).toString('base64');
};
