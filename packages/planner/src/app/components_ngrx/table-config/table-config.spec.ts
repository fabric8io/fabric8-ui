import { TableConfigComponent } from './table-config.component';

/**
 * Default checks for inputs
 */
describe('TableConfigComponent :: ', () => {
  const comp = new TableConfigComponent();
  it('isNoAttributeSelected should be false when atleast one component is selected', () => {
    comp.columns = [{selected : true}, {selected : false}, {selected : false}];
    comp.checkIfNoColumnSelected();
    expect(comp.isNoAttributeSelected).toBe(false);
  });
  it('isNoAttributeSelected should be true when no component is selected', () => {
    comp.columns = [{selected : false}, {selected : false}, {selected : false}];
    comp.checkIfNoColumnSelected();
    expect(comp.isNoAttributeSelected).toBe(true);
  });
});
