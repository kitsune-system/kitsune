import MemoryGraph from './memory-graph';

describe.skip('MemoryGraph', () => {
  it('should work', () => {
    const graph = MemoryGraph();

    for(let i = 0; i < 500; i++) {
      const head = Math.floor(Math.random() * 250);
      const tail = Math.floor(Math.random() * 250);
      const edge = [head, tail];
      graph.write(edge);
    }

    console.log(graph.count());
    const edge = graph.list()[25];
    const id = `[${edge[0]}:${edge[1]}]`;
    console.log(graph.read(id));
    console.log('======================');
    console.log(graph.heads('0'));
    console.log(graph.heads('10'));
    console.log(graph.tails('20'));
    console.log(graph.tails('30'));
    console.log('======================');

    graph.erase(id);

    console.log(Object.keys(graph));
    console.log(graph.count());
  });
});
