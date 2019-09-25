import { join } from 'path';

const { env } = process;

export const KITSUNE_PATH = join(env.HOME, '.kitsune');
export const CODE_PATH = env.KITSUNE_CODE_PATH || join(KITSUNE_PATH, 'code');

export const SERVER_NAME = env.KITSUNE_SERVER_NAME;
export const SECURE_PORT = env.KITSUNE_HTTPS_PORT;
export const INSECURE_PORT = env.KITSUNE_HTTP_PORT || 8080;
