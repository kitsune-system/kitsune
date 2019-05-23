/* eslint-disable */
import { bufferToBase64 as b64, deepHashEdge as E, hashList } from '../common/hash';

import { BIND_COMMAND, EDGE, GET, STRING, NATIVE_NAME, READ, WRITE } from '../common/nodes';
import { Builder, config, extend, systemModules } from '../kitsune/builder';
import { BinaryMap, BinObj, Commands, CommandInstaller } from '../kitsune/util';

const hash = string => hashList([string]);

const BUILD = hash('build');
const BUFFER = hash('buffer');
const TEST = hash('test');
const TEST2 = hash('test2');
const BLOCK = hash('block');
const CONDITION = hash('condition');
const IF = hash('if');
const WHILE = hash('while');
const SYSTEM_CALL = hash('system-call');
const INPUT_TYPE = hash('input-type');
const OUTPUT_TYPE = hash('output-type');

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
  it.skip('test', () => {
    const extraCommands = Commands(
      [E(WRITE, STRING), () => hash('my-random-hash')],
      [E(READ, STRING), () => 'What\'s up'],
      [
        TEST,
        ({ writeString }) => name => writeString(`Hello ${name}`),
        BinaryMap(BinObj([
          [INPUT_TYPE, STRING],
          [OUTPUT_TYPE, BUFFER],
          [BIND_COMMAND, {
            writeString: E(WRITE, STRING),
          }],
        ])),
      ],
      [
        TEST2,
        ({ readString }) => node => `I said, "${readString(node)}`,
        BinaryMap(BinObj([
          [INPUT_TYPE, BUFFER],
          [OUTPUT_TYPE, STRING],
          [BIND_COMMAND, {
            readString: E(READ, STRING),
          }],
        ])),
      ]
    );

    // const build = Builder({
    //   ...config,
    //   extraCommands,
    //   commandList: [...config.commandList, 'extraCommands'],
    //   // commandList: ['extraCommands', ...config.commandList],
    // });
    // const commands = build('commands');
    // const system = build('system');

    const system = extend(BinaryMap());

    const install = CommandInstaller(system, systemModules, extraCommands);
    // Object.keys(commands).forEach(install);
    // install(SUPPORTS_COMMAND);
    install(TEST2);
    console.log('>>>', system(TEST2)('Hello'));

    // console.log('<<<', Object.keys(system()));

    // const [write, read, readType] = WriteRead(system);
    //
    // const node = system(TEST)('Bob');
    // const string = readType(STRING, node);
    // console.log('>>>', string, b64(node));
    // console.log('TEST', system(E(WRITE, STRING))('hello'));
  });

  it.skip('should work', () => {
    const system = Builder(config)('system');

    const [write, read] = WriteRead(system);
    const human = system(E(GET, NATIVE_NAME));

    system(BUILD, value => b64(value));

    const whileVal = BinObj([
      [CONDITION, 'condition'],
      [BLOCK, 'block'],
    ]);
    console.log('X', whileVal);
  });

  it('ReadWrite', () => {
    const system = Builder(config)('system');
    const [write, read] = WriteRead(system);

    const human = system(E(GET, NATIVE_NAME));

    const helloWorldNode = write(STRING, 'Hello World');
    const helloWorld = read(helloWorldNode);
    human(helloWorld[0]).should.equal('STRING');
    helloWorld[1].should.equal('Hello World');
  });

  it.skip('extra', () => {
    const commands = Builder(config)('commands');
    console.log('C', commands);
  });
});
