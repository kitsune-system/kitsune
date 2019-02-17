import { ALL, COMMAND, CONVERT, EDGE, IS, NAME, NESTED, NODE, READ, SUPPORTED, WRITE } from './nodes';

// These are needed to bootstrap the local-hash system
export const hasCommand = 'IthJ7OnLm9z7NotnB+7/DLMNf/0odYuM5nYTcIy7C/U='; // [READ, [IS, [SUPPORTED, COMMAND]]]
export const listCommands = 'FsH9cStq47PRIp0M8+NxsHXGFxVDxjk8rCFhNlIwytY='; // [READ, [ALL, [SUPPORTED, COMMAND]]]

export const writeEdge = 'HyXRjOGLkYWa8fEZrsAwlOc9wEhmKGCejWWuJmsznyU='; // [WRITE, EDGE]
export const readEdge = 'Ito8jZFHA6/r6cK07rTCuTDiKrCiTjKLkW59gM3ZTp4='; // [READ, EDGE]

export const translate = 'eNAxeyABxx4xjvpJhJ4XZKCfTiVBTX/Wq9pBeIuV1lc='; // [CONVERT, [NODE, [NESTED, NAME]]]

const edges = [
  [READ, [IS, [SUPPORTED, COMMAND]]],
  [READ, [ALL, [SUPPORTED, COMMAND]]],
  [WRITE, EDGE],
  [READ, EDGE],
  [CONVERT, [NODE, [NESTED, NAME]]],
];

export default edges;
