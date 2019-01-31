import { mergeArraysDistinctByKey } from './utilities';
import { clone } from './utilities';

describe('Utilities:', () => {
  beforeEach(() => {});

  it('Merge value id dupicate key', () => {
    // given
    const array1 = [
      { name: 'name1', description: 'description1' },
      { name: 'name2', description: 'description2' },
    ];
    const array2 = [
      { name: 'name1', description: 'description1' },
      { name: 'name3', description: 'description3' },
    ];
    const mergedArray = [
      { name: 'name1', description: 'description1' },
      { name: 'name2', description: 'description2' },
      { name: 'name3', description: 'description3' },
    ];
    // when
    mergeArraysDistinctByKey(array1, array2, 'name');
    // then
    expect(array1).toEqual(mergedArray);
  });

  it('Add values for new items', () => {
    // given
    const array1 = [
      { name: 'name1', description: 'description1' },
      { name: 'name2', description: 'description2' },
    ];
    const array2 = [
      { name: 'name3', description: 'description3' },
      { name: 'name4', description: 'description4' },
    ];
    const mergedArray = [
      { name: 'name1', description: 'description1' },
      { name: 'name2', description: 'description2' },
      { name: 'name3', description: 'description3' },
      { name: 'name4', description: 'description4' },
    ];
    // when
    mergeArraysDistinctByKey(array1, array2, 'name');
    // then
    expect(array1).toEqual(mergedArray);
  });

  it('Clones a string', () => {
    // given
    const s = 'abcd';
    // when
    const s2 = clone(s);
    // then
    expect(s2).toEqual(s);
  });

  it('Clones an object', () => {
    // given
    const s = { abcd: 'abcd', efgh: 'efgh' };
    // when
    const s2 = clone(s);
    // then
    expect(s2).toEqual(s);
  });
});
