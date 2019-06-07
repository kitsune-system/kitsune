/* eslint-disable */
import { bufferToBase64 as b64, deepHashEdge as E, hashList } from '../common/hash';

import { BIND_COMMAND, EDGE, GET, STRING, NATIVE_NAME, RANDOM, READ, WRITE } from '../common/nodes';
import { Builder, config, extend, systemModules } from '../kitsune/builder';
import { BinaryMap, BinObj, Commands, meta } from '../kitsune/util';

const hash = string => hashList([string]);

const BUILD = hash('build');
const BUFFER = hash('buffer');

const TEST = hash('test');
const TEST2 = hash('test2');
const IS = hash('is');
const INPUT_TYPE = hash('input-type');
const OUTPUT_TYPE = hash('output-type');

const IF = hash('if');
const WHILE = hash('while');
const SYSTEM_CALL = hash('system-call');
const VARIABLE_REF = hash('variable_ref');

const BLOCK = hash('block');
const BOOLEAN = hash('boolean');

const ANYTHING = hash('anything');
const NOTHING = hash('nothing');

const WriteRead = system => {
  const write = (type, value) => {
    const node = system(E(WRITE, type))(value);
    return system(E(WRITE, EDGE))([type, node]);
  };

  const read = valueNode => {
    const readEdge = system(E(READ, EDGE));
    const edge = readEdge(valueNode);

    if(!edge)
      throw new Error(`No value edge for node: ${b64(valueNode)}`);

    const [type, node] = edge;
    const value = system(E(READ, type))(node);
    return [type, value];
  };

  const readType = (type, node) => system(E(READ, type))(node);

  return [write, read, readType];
};

describe('code', () => {
  it.skip('should work', () => {
    const system = Builder(config)('system');

    const [write, read] = WriteRead(system);
    const human = system(E(GET, NATIVE_NAME));

    system(BUILD, value => b64(value));

    const ifVal = BinObj(
      [IF, [
        [BOOLEAN, TEST],
        [BLOCK, TEST2],
      ]]
    );
    console.log('X', ifVal);
  });

  it.skip('misc', () => {
    const build = Builder(config);
    const [systemModules, commands] = ['systemModules', 'commands'].map(build);

    systemModules(INPUT_TYPE, ({ install, system, value, wrap }) => wrap(fn => {
      const isType = install(E(IS, value));

      return input => {
        if(!isType(input))
          throw new Error(`Input doesn't match type \`${b64(value)}\`: ${input}`);

        return fn(input);
      };
    }));

    systemModules(OUTPUT_TYPE, ({ install, system, value, wrap }) => wrap(fn => {
      const isType = install(E(IS, value));

      return input => {
        const output = fn(input);

        if(!isType(output))
          throw new Error(`Output doesn't match type \`${b64(value)}\`: ${input}`);

        return output;
      };
    }));

    commands(TEST, meta(
      ({ random }) => name => `Hello ${name}, here's a hash: ${random()}`,
      BinaryMap(BinObj(
        [BIND_COMMAND, { random: RANDOM }],
        [INPUT_TYPE, STRING],
        [OUTPUT_TYPE, STRING],
      ))
    ));
    commands(E(IS, STRING), input => typeof input === 'string');

    const system = Builder({
      ...config,
      systemModules: () => systemModules,
      commands: () => commands,
    })('system');
    console.log('>>>', system(TEST)('1234'));
  });

  it('WriteRead', () => {
    const system = Builder(config)('system');
    const [write, read] = WriteRead(system);

    const human = system(E(GET, NATIVE_NAME));

    const helloWorldNode = write(STRING, 'Hello World');
    const helloWorld = read(helloWorldNode);
    human(helloWorld[0]).should.equal('STRING');
    helloWorld[1].should.equal('Hello World');
  });
});
