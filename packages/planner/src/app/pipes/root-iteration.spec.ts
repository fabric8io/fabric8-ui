import { F8RootIteration } from './root-iteration.pipe';

describe('Pipe: F8RootIteration', () => {
  let pipe: F8RootIteration;
  let spaceName: string;

  beforeEach(() => {
    pipe = new F8RootIteration();
    spaceName = '/spaceName';
  });

  it('should be defined', () => {
    expect(pipe).toBeDefined();
  });

  it('should start without space name', () => {
    expect(pipe.transform('/')).toBe('/');
    expect(pipe.transform(`${spaceName}`)).toBe('/');
    expect(pipe.transform(`${spaceName}/TestIteration`)).toBe('/TestIteration');
    expect(pipe.transform(`${spaceName}/TestIteration/SubIteration`)).toBe(
      '/TestIteration/SubIteration',
    );
    expect(pipe.transform(`${spaceName}/TestIteration/SubIteration/SubSubIteration`)).toBe(
      '/TestIteration/SubIteration/SubSubIteration',
    );
  });
});
