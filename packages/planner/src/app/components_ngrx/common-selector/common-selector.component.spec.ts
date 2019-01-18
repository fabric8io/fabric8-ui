import { CommonSelectorComponent } from './common-selector.component';

/**
 * Default checks for inputs
 */
describe('CommonSelectorComponent :: ', () => {
  const comp = new CommonSelectorComponent();
  it('Header text should have a default value', () => {
    expect(comp.headerText).toBe('Default Header Text');
  });

  it('noValueLabel should have a default value None', () => {
    expect(comp.noValueLabel).toBe('None');
  });

  it('by default update should be allowed', () => {
    expect(comp.allowUpdate).toBeTruthy();
  });

  it('by default multi select should not be allowed', () => {
    expect(comp.allowMultiSelect).toBeFalsy();
  });

  it('by default close the dropdown on select', () => {
    expect(comp.closeOnSelect).toBeTruthy();
  });
});
