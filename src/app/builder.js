import Coder from './coders/coders';
import DeepEdges from './deep-edges';
import { edges } from './hash';
import Files from './files';
import LokiEdges from './loki-edges';
import LokiStrings from './loki-strings';
import Relatives from './relatives';
import MultiSystem from './multi-system';
import Misc from './misc';
import Names from './names';
import Builder from './system/builders';
import Translate from './translate';

const defaultConfig = {
  fileSystemPath: './kitsune-files'
};

const builds = {};

builds.build = [['code', 'file'], Builder];
builds.code = [['name'], Coder];
builds.edge = [['lokiEdge'], DeepEdges];
builds.file = [[], (baseSystem, config) => Files({ path: config.fileSystemPath, baseSystem })];
builds.lokiEdge = [[], LokiEdges];
builds.localEdge = [[], () => edges];
builds.misc = [[], Misc];
builds.name = [['relative', 'string'], Names];
builds.relative = [['edge'], Relatives];
builds.string = [[], LokiStrings];
builds.translate = [['localEdge'], Translate];

const build = config => (...systemTypes) => {
  const conf = { ...defaultConfig, ...config };

  if(typeof systemTypes === 'string')
    systemTypes = [systemTypes];

  const multi = MultiSystem();
  multi.systems = {};

  const buildType = systemType => {
    if(!builds[systemType])
      throw new Error(`No such system type: ${systemType}`);

    const [depTypes, build] = builds[systemType];

    const deps = depTypes.map(buildType);
    const system = build(multi, conf, ...deps);

    multi.push(system);
    multi.systems[systemType] = system;

    return system;
  };

  systemTypes.forEach(buildType);

  return multi;
};

export default build;
