/* eslint-disable no-warning-comments */

import { execSync } from 'child_process';

import { e } from '../hash';
import { BUILD, C, CODE, ECMA_SCRIPT, FILE, JAVA, NAME, NODE, PATH, READ, RUBY, SYSTEM, WRITE } from '../nodes';
import System from '../system';

const Builder = baseSystem => {
  const system = System({ baseSystem });

  system.command(e(BUILD, [C, SYSTEM]),
    [e(CODE, C), e(WRITE, FILE), e(READ, PATH)],
    (codeC, writeFile, readPath) => systemId => {
      const newSystemId = e([C, SYSTEM], systemId);

      // Code
      const code = codeC(systemId);
      const codeNode = writeFile(code);
      const path = readPath(codeNode);

      // Compile
      const binary = execSync(`gcc -x c -o /dev/stdout ${path}`);
      const binaryNode = writeFile(binary);
      const binaryPath = readPath(binaryNode);
      execSync(`chmod +x ${binaryPath}`);

      system.command(newSystemId, () => execSync(binaryPath).toString('utf8'));

      return newSystemId;
    }
  );

  [ECMA_SCRIPT, RUBY].forEach(lang => {
    const libCmd = lang === ECMA_SCRIPT ? 'node' : 'ruby';

    system.command(e(BUILD, [lang, SYSTEM]),
      [e(CODE, lang), e(WRITE, FILE), e(READ, PATH)],
      (codeSys, writeFile, readPath) => systemId => {
        const newSystemId = e([lang, SYSTEM], systemId);

        const code = codeSys(systemId);
        const codeNode = writeFile(code);
        const path = readPath(codeNode);

        system.command(newSystemId, () => execSync(`${libCmd} ${path}`).toString('utf8'));

        return newSystemId;
      }
    );
  });

  system.command(
    e(BUILD, [JAVA, SYSTEM]), [e(CODE, JAVA), e(WRITE, FILE), e(READ, PATH), e(READ, [[FILE, SYSTEM], PATH]), e(READ, [NODE, NAME])],
    (codeJava, writeFile, readPath, readFileSystemPath, readNames) => systemId => { // eslint-disable-line max-params
      const newSystemId = e([JAVA, SYSTEM], systemId);

      // Code
      const code = codeJava(systemId);
      const codeNode = writeFile(code);
      const path = readPath(codeNode);

      const fileSystemPath = readFileSystemPath();
      const names = readNames(systemId);
      const className = names[0] || 'App';

      const javaFilePath = `${fileSystemPath}/${className}.java`;

      // Compile
      execSync(`ln -fs "${path}" "${javaFilePath}"`); // TODO: Broken, don't put names files in file_system_path
      execSync(`javac "${javaFilePath}"`);
      execSync(`rm "${javaFilePath}"`);

      system.command(newSystemId, () => execSync(`cd "${fileSystemPath}"; java "${className}"`).toString('utf8'));

      return newSystemId;
    }
  );

  return system;
};

export default Builder;
