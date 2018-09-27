import { DeploymentGraphLabelComponent } from './deployment-graph-label.component';

describe('DeploymentGraphLabel', (): void => {
  const component: DeploymentGraphLabelComponent = new DeploymentGraphLabelComponent();
  component.ngOnChanges();

  it('should have an N/A label by default', (): void => {
    expect(component.label).toEqual('N/A');
  });

  it('should have the expected label when a proper value is provided', (): void => {
    const value: number = 1;
    const dataMeasure: string = 'measure';

    component.value = value;
    component.dataMeasure = dataMeasure;
    component.type = 'type';
    component.ngOnChanges();
    expect(component.label).toEqual(`${value} ${dataMeasure}`);
  });

  it('should set the label to N/A when given an undefined value after it has a valid label', (): void => {
    component.value = undefined;
    component.ngOnChanges();
    expect(component.label).toEqual('N/A');
  });

  it('should have the expected label when a proper value and upper bound are provided', (): void => {
    const value: number = 12.5;
    const valueUpperBound: number = 2;

    component.value = value;
    component.valueUpperBound = valueUpperBound;
    component.type = 'type';
    component.dataMeasure = 'measure';
    component.ngOnChanges();
    expect(component.label).toEqual(`${value} of ${valueUpperBound}`);
  });
});
