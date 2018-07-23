import LokiEdges from './loki-edges';
import Relatives from './relatives';
import MultiSystem from './multi-system';
import LokiStrings from './loki-strings';
import DeepEdges from './deep-edges';
import Translate from './translate';
import Names from './names';
import { edges } from './hash-local';

const builds = {};

builds.edge = [['lokiEdge'], DeepEdges];
builds.lokiEdge = [[], LokiEdges];
builds.localEdge = [[], () => edges];
builds.name = [['relative', 'string'], Names];
builds.relative = [['edge'], Relatives];
builds.string = [[], LokiStrings];
builds.translate = [['localEdge'], Translate];

const build = (...systemTypes) => {
  if(typeof systemTypes === 'string')
    systemTypes = [systemTypes];

  const multi = MultiSystem();

  const buildType = systemType => {
    if(!builds[systemType])
      throw new Error(`No such system type: ${systemType}`);

    const [depTypes, build] = builds[systemType];

    const deps = depTypes.map(buildType);
    const system = build(multi, ...deps);

    multi.push(system);
    return system;
  };

  systemTypes.forEach(buildType);

  return multi;
};

export default build;
