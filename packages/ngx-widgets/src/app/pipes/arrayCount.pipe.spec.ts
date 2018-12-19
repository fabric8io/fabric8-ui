import { ArrayCount } from './arrayCount.pipe';

interface ITestCase {
  label: string;
  input: any;
  expect: any;
}

let testCases: Array<ITestCase> = [
  {
    label: 'Test for null',
    input: null,
    expect: null,
  },
  {
    label: 'Test for undefined',
    input: undefined,
    expect: null,
  },
  {
    label: 'Test for simple object',
    input: () => ({ a: 1 }),
    expect: null,
  },
  {
    label: 'Test for empty array',
    input: [],
    expect: 0,
  },
  {
    label: 'Test for an array of 5 items',
    input: ['a', 'b', 'c', 'd', 'e'],
    expect: 5,
  },
];

describe('Pipe: count.pipe => CountPipe', () => {
  let pipe: ArrayCount;

  beforeEach(() => {
    pipe = new ArrayCount();
  });

  for (let testCase of testCases) {
    it(testCase.label, () => {
      let result = pipe.transform(testCase.input);
      expect(result).toEqual(testCase.expect);
    });
  }
});
