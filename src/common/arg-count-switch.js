const ArgCountSwitch = (...handlers) => {
  const fn = (...args) => {
    const count = args.length;
    const handle = handlers[count];

    if(typeof handle !== 'function')
      throw new Error(`No handler for arg count: ${count}`);

    return handle(...args);
  };

  fn.handlers = handlers;

  return fn;
};

export default ArgCountSwitch;
