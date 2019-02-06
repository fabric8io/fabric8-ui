function factory(prefix?: string) {
  function process(...args: (string | { [key: string]: any })[]) {
    const classes: string[] = [];

    args.forEach((arg) => {
      if (!arg) {
        return;
      }

      if (typeof arg === 'string') {
        classes.push(arg);
      } else if (typeof arg === 'object') {
        Object.keys(arg).forEach((key) => {
          if (key && arg[key]) {
            classes.push(`${prefix}${key}`);
          }
        });
      } else {
        throw new Error('Unsupported classname type.');
      }
    });

    return classes.join(' ');
  }

  return process;
}

export default factory('is-');
