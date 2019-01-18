import { async } from '@angular/core/testing';
import { InlineInputComponent } from './inlineinput.component';

describe('Unit Test :: Inline Input Float value', () => {
  let comp = new InlineInputComponent();
  beforeEach(async(() => {
    comp.type = 'float';
  }));

  it('Should return true for input 2234.523 in float range', () => {
    expect(comp.validateValue('2234.523')).toBe(true);
  });

  it('Should return true for input 1.2 in float range', () => {
    expect(comp.validateValue('1.2')).toBe(true);
  });

  it('Should return true for input 223456.334 in float range', () => {
    expect(comp.validateValue('223456.334')).toBe(true);
  });

  it('Should return true for input 45 in float range', () => {
    expect(comp.validateValue('45')).toBe(true);
  });

  it('Should return false for input -34567812322.523 outside float range', () => {
    expect(comp.validateValue('-34567812322.523')).toBe(false);
  });

  it('Should return false for input 345678123225.23678 outside float range', () => {
    expect(comp.validateValue('345678123225.23678')).toBe(false);
  });

  it('Should return false for input stringtest outside float range', () => {
    expect(comp.validateValue('stringtest')).toBe(false);
  });

  it('Should return false for input 11111111111111111.51 outside float range', () => {
    expect(comp.validateValue('11111111111111111.51')).toBe(false);
  });
});
