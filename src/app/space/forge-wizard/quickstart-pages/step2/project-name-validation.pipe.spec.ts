import { FormatNameValidationPipe } from './project-name-validation.pipe';

describe('FormatNameValidationPipe: validation', () => {
  let pipe: FormatNameValidationPipe;

  beforeEach(() => {
    pipe = new FormatNameValidationPipe();
  });

  it('should not contain _', () => {
    const obj = {
      'pattern': {
        'requiredPattern': '/^[a-z][a-z0-9\\-]*$/',
        'actualValue': 'quickstartdemo_'
      }
    };
    const result = pipe.transform(obj, null);
    expect(result).toBe('should not contain uppercase or special characters.');
  });

  it('should contain at least 2 characters', () => {
    const obj = {
        minlength: {
          requiredLength: 2,
          actualLength: 1
        }
      };
    expect(pipe.transform(obj, null)).toBe('should contain at least 2 characters.');
  });

  it('should contain at most XX characters', () => {
    const obj = {
      maxlength: {
        requiredLength: 63,
        actualLength: 65
      }
    };
    expect(pipe.transform(obj, null)).toBe('should contain at most 63 characters.');
  });

  it('is required', () => {
    const obj = {
      required: true
    };
    expect(pipe.transform(obj, null)).toBe('is required.');
  });
});
