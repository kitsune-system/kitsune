/* eslint-disable */
import { BinaryMap, E, b64, toBinObj } from '../common';
import { hashList } from '../common/hash';

import {
  BIND_COMMAND, EDGE, GET, STRING, LIST_N, NATIVE_NAME,
  MAP_N, RANDOM, READ, SET, WRITE
} from '../common/nodes';

import { Builder, config, extend, systemModules } from '../kitsune/builder';
import { Commands, meta } from '../kitsune/util';

const hash = string => hashList([string]);

const BUILD = hash('build');
const BUFFER = hash('buffer');
const CODE = hash('code');
const CONDITION = hash('condition');
const TYPE = hash('type');

const TEST = hash('test');
const TEST2 = hash('test2');
const INPUT_TYPE = hash('input-type');
const OUTPUT_TYPE = hash('output-type');

const IF = hash('if');
const IS = hash('is');

const BLOCK = hash('block');
const BOOLEAN = hash('boolean');

const ANYTHING = hash('anything');
const NOTHING = hash('nothing');

const WHILE = hash('while');
const SYSTEM_CALL = hash('system-call');
const VARIABLE_REF = hash('variable_ref');

const UNKNOWN = hash('unknown');

const WriteRead = system => {
  const writeType = (type, value) => {
    const node = system(E(WRITE, type))(value);
    return node;
  };

  const write = (type, value) => {
    const node = writeType(type, value);
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

const indent = (str, size=2) => {
  let indent = '';
    for(let i=0; i<size; i++) indent += ' ';

  return str.split('\n').map(line => line.length ? indent + line : line).join('\n');
};

describe.skip('code', () => {
  it('should work', () => {
    const system = Builder(config)('system');

    const [write, read] = WriteRead(system);
    const human = system(E(GET, NATIVE_NAME));

    const conditionNode = system(E(WRITE, EDGE))([TEST, hash('valueA')]);
    const blockNode = system(E(WRITE, EDGE))([TEST2, hash('valueB')]);

    const ifInner = toBinObj(
      [CONDITION, conditionNode],
      [BLOCK, blockNode],
    );
    const ifInnerNode = system(E(WRITE, MAP_N))(ifInner);
    const ifNode = system(E(WRITE, EDGE))([IF, ifInnerNode]);

    const [type, node] = system(E(READ, EDGE))(ifNode);
    const map = system(E(READ, MAP_N))(node);

    system(CODE, edgeNode => {
      const [type, node] = system(E(READ, EDGE))(edgeNode);
      return system(E(CODE, type))(node);
    });

    system(E(CODE, IF), ifNode => {
      const ifMap = BinaryMap(system(E(READ, MAP_N))(ifNode));

      const conditionNode = ifMap(CONDITION);
      const conditionCode = system(CODE)(conditionNode);

      const blockNode = ifMap(BLOCK);
      const blockCode = system(CODE)(blockNode);

      const code =
        `if(${conditionCode.code}) {\n` +
          indent(blockCode.code) +
        '}';
      return {
        concerns: [
          ...conditionCode.concerns,
          ...blockCode.concerns,
        ],
        code };
    });

    system(E(CODE, TEST), node => {
      return { concerns: [TEST], code: `x < 10` };
    });

    system(E(CODE, TEST2), node => {
      return {
        concerns: [TEST2],
        code:
          `console.log('It\'s less than 10...');\n` +
          `console.log('...and you can take that to the bank.');\n`
      };
    });

    const ifCode = system(CODE)(ifNode);
    console.log('Concerns:');
    console.log(ifCode.concerns);
    console.log('Code:');
    console.log(ifCode.code);
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
      BinaryMap(toBinObj(
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
