import { AlmMomentTime } from './alm-moment-time.pipe';

describe('Moment time pipe', () => {
  // This pipe is a pure, stateless function so no need for BeforeEach
  const pipe = new AlmMomentTime();
  const baseTime = new Date(2017, 0, 1);

  beforeAll(() => {
    jasmine.clock().mockDate(baseTime);
  });

  afterAll(() => {
    jasmine.clock().mockDate();
  });

  it('should transform empty timestamp to empty string', () => {
    expect(pipe.transform('')).toBe('');
  });

  it('should transform more than one month old timestamp to exact date', () => {
    const transformedString = pipe.transform('2016-05-12T13:51:08.554');
    expect(transformedString).toContain('<span title="May 12, 2016 1:51 PM">');
    expect(transformedString).toContain('12 May 2016');
    expect(transformedString).toContain('</span>');
  });

  it('should transform less than one month old timestamp to human-readable string', () => {
    const transformedString = pipe.transform('2016-12-31T13:51:08.554');
    expect(transformedString).toContain('<span title="December 31, 2016 1:51 PM">');
    expect(transformedString).toContain('10 hours ago');
    expect(transformedString).toContain('</span>');
  });
});
