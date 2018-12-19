export { Logging } from './logging';

// source: https://www.typescriptlang.org/docs/handbook/mixins.html

export const applyMixins = (derivedCtor: any, baseCtors: any[]) => {
  baseCtors.forEach((baseCtor) => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
      derivedCtor.prototype[name] = baseCtor.prototype[name];
    });
  });
};
