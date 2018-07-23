import _ from 'lodash';

import System from './system';
import { random } from './hash';
import { ALL, COMMAND, EDGE, FILE, IS, READ, STRING, SUPPORTED, TAIL, WRITE } from './nodes';
import { e, s } from './hash-local';
import build from './builder';

const [ALPHA, BETA] = _.times(2, random);

describe('System', () => {
  let system;
  beforeEach(() => {
    system = System();
  });

  it('should tell if it supports a command', () => {
    // Add command
    system.command(ALPHA, () => {/* noop */});

    // See if command is supported
    system(e(READ, [IS, [SUPPORTED, COMMAND]]), [ALPHA]).should.be.true;
  });

  it('should list all supported commands', () => {
    // Add command
    system.command(BETA, () => {/* noop */});

    // List all commands
    system(e(READ, [ALL, [SUPPORTED, COMMAND]])).should.deep.contains(
      e(READ, [IS, [SUPPORTED, COMMAND]]),
      e(READ, [ALL, [SUPPORTED, COMMAND]]),
      BETA
    );
  });

  it('should be able to call own commands from other commands', () => {
    system.command(ALPHA, () => 10);
    system.command(BETA, [ALPHA], alpha => input => input + alpha());

    system(BETA, 8).should.equal(18);
  });

  it('should be able to declare command dependencies on a base system', () => {
    const baseSystem = build('edge', 'string');
    system = System({ baseSystem });

    system.command(ALPHA,
      [e(WRITE, STRING), e(WRITE, EDGE)],
      (writeString, writeEdge) => input => {
        const strNode = writeString(input);
        return writeEdge([STRING, strNode]);
      }
    );

    const string = 'sushi';
    const node = system(ALPHA, string);
    baseSystem(e(READ, EDGE), node).should.deep.equal([STRING, s(string)]);
  });

  describe('exceptions', () => {
    it('should throw exception if user tries to call a command it doesn\'t support', () => {
      const baseSystem = build('translate');
      system = System({ baseSystem });

      const node = e([READ, WRITE], [[ALL, IS], [SUPPORTED, [TAIL, STRING]]]);

      const errorShould = (() => {
        const misc = system(node);
        misc.should.equal('hello world');
      }).should.throw(Error);

      errorShould.have.property('commandId', node);
      errorShould.have.property('command').which.deep.equals([['READ', 'WRITE'], [['ALL', 'IS'], ['SUPPORTED', ['TAIL', 'STRING']]]]);
    });

    it('should throw exception if base system doesn\'t support command dependency', () => {
      const baseSystem = build('string', 'translate');
      system = System({ baseSystem });

      const errorShould = (() => {
        system.command(ALPHA,
          [ALPHA, e(WRITE, STRING), e(WRITE, FILE)],
          (alpha, writeString, writeEdge) => input => {
            alpha();
            const strNode = writeString(input);
            return writeEdge([STRING, strNode]);
          }
        );
      }).should.throw(Error);

      errorShould.have.property('commandIds').which.has.members([ALPHA, e(WRITE, FILE)]);
      // Note: Can't translate ALPHA here since it's randomly generating in this file
      errorShould.have.property('commands').which.has.deep.members([ALPHA, ['WRITE', 'FILE']]);
    });
  });
});
