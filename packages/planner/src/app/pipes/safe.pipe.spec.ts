import { async, getTestBed, inject, TestBed } from '@angular/core/testing';
import { DomSanitizer, SafeHtml, SafeValue } from '@angular/platform-browser';
import { SafePipe } from './safe.pipe';

describe('Unit Test :: Safe Pipe', () => {
  let safePipe: SafePipe;
  let sanitizer: DomSanitizer;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [],
    });
    const testbed = getTestBed();
    sanitizer = testbed.get(DomSanitizer);
    safePipe = new SafePipe(sanitizer);
  }));

  it('should wrap values in SafeValue.', () => {
    expect(safePipe).toBeDefined();
    // Typescript is funny, it is not really typesafe, so typeof always returns 'object'.
    // instanceof also does not work as this is a JS construct that does not work on
    // typescript interface definitions without extra measures like custom type guards.
    // So we're doing type checking by looking at the internal structure.
    expect(safePipe.transform('some value', 'html')['changingThisBreaksApplicationSecurity']).toBe(
      'some value',
    );
    expect(safePipe.transform('some value', 'style')['changingThisBreaksApplicationSecurity']).toBe(
      'some value',
    );
    expect(
      safePipe.transform('some value', 'script')['changingThisBreaksApplicationSecurity'],
    ).toBe('some value');
    expect(safePipe.transform('some value', 'url')['changingThisBreaksApplicationSecurity']).toBe(
      'some value',
    );
    expect(
      safePipe.transform('some value', 'resourceUrl')['changingThisBreaksApplicationSecurity'],
    ).toBe('some value');
  });
});
