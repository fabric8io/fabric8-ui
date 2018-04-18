import { SimpleChanges } from '@angular/core';

import { DeploymentGraphLabelComponent } from './deployment-graph-label.component';

describe('DeploymentGraphLabel', () => {
  const emptyChanges: SimpleChanges = {};
  const component: DeploymentGraphLabelComponent = new DeploymentGraphLabelComponent();
  component.ngOnChanges(emptyChanges);

  it('should have an N/A label by default', () => {
    expect(component.label).toEqual('N/A');
  });

  it('should have the expected label when a proper value is provided', () => {
    const value = 1;
    const dataMeasure = 'measure';

    component.value = value;
    component.dataMeasure = dataMeasure;
    component.type = 'type';
    component.ngOnChanges(emptyChanges);
    expect(component.label).toEqual(`${value} ${dataMeasure}`);

    it('should set the label to N/A when given an undefined value after it has a valid label', () => {
      component.value = undefined;
      component.ngOnChanges(emptyChanges);
      expect(component.label).toEqual('N/A');
    });
  });

  it('should have the expected label when a proper value and upper bound are provided', () => {
    const value = 12.5;
    const valueUpperBound = 2;

    component.value = value;
    component.valueUpperBound = valueUpperBound;
    component.type = 'type';
    component.dataMeasure = 'measure';
    component.ngOnChanges(emptyChanges);
    expect(component.label).toEqual(`${value} of ${valueUpperBound}`);
  });
});
