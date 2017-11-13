import { async, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { PipelineQuickstartStepComponent } from './pipeline-quickstart-step.component';

describe('Forge-Wizard pipeline quickstart step component', () => {
  let fixture, comp;
  let gui: any;

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [],
      declarations: [PipelineQuickstartStepComponent],
      providers: [],
      // Tells the compiler not to error on unknown elements and attributes
      schemas: [NO_ERRORS_SCHEMA]
    });
    gui = {
      'inputs': [
        {
          'name': 'pipeline',
          'value': 'selected_pipeline'
        },
        {
          'name': 'kubernetesSpace',
          'value': 'sth'
        },
        {
          'name': 'labelSpace',
          'value': 'empty'
        }
      ]
    };
    fixture = TestBed.createComponent(PipelineQuickstartStepComponent);
    comp = fixture.componentInstance;
    comp.gui = gui;
    let group: any = {
      pipeline: new FormControl(gui.inputs[0].value || '', Validators.required),
      kubernetesSpace: new FormControl(gui.inputs[1].value  || '', Validators.required),
      labelSpace: new FormControl(gui.inputs[2].value  || '', Validators.required)
    };
    comp.form = new FormGroup(group);
    comp.labelSpace = 'label';
  });

  it('Label default value for pipeline', async(() => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(comp.form.controls['labelSpace'].value).toEqual('empty');
    });
  }));

  it('Label is set with input value for pipeline', async(() => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      comp.form.controls['labelSpace'].setValue('myownlabel');
      fixture.detectChanges();
    }).then(() => {
      expect(comp.form.controls['labelSpace'].value).toEqual('myownlabel');
    });
  }));

});



