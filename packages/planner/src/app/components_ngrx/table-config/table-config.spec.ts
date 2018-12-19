import { TableConfigComponent } from './table-config.component';

/**
 * Default checks for inputs
 */
describe('TableConfigComponent :: ', () => {
  const comp = new TableConfigComponent();
  it('isNoAvailableAttributeSelected should be false when atleast one component is selected', () => {
    comp.columns = [{selected : true , available : true }, {selected : false , available : true }, {selected : false , available : true }];
    comp.checkIfNoColumnSelected();
    expect(comp.isNoAvailableAttributeSelected).toBe(false);
  });
  it('isNoAvailableAttributeSelected should be true when no component is selected', () => {
    comp.columns = [{selected : false, available : true }, {selected : false , available : true }, {selected : false , available : true }];
    comp.checkIfNoColumnSelected();
    expect(comp.isNoAvailableAttributeSelected).toBe(true);
  });
  it('isNoDisplayedAttributeSelected should be false when atleast one component is selected', () => {
    comp.columns = [{selected : true, display : true}, {selected : false, display : true}, {selected : false, display : true}];
    comp.checkIfNoColumnSelected();
    expect(comp.isNoDisplayedAttributeSelected).toBe(false);
  });
  it('isNoDisplayedAttributeSelected should be true when no component is selected', () => {
    comp.columns = [{selected : false, display : true}, {selected : false, display : true}, {selected : false,  display : true}];
    comp.checkIfNoColumnSelected();
    expect(comp.isNoDisplayedAttributeSelected).toBe(true);
  });
});
