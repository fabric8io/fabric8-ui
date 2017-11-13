import { async, TestBed } from '@angular/core/testing';
import { ProjectInfoStepComponent } from './project-info-step.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('Forge-Wizard project info component', () => {
  let fixture, comp;
  let gui: any;

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [],
      declarations: [ProjectInfoStepComponent],
      providers: [],
      // Tells the compiler not to error on unknown elements and attributes
      schemas: [NO_ERRORS_SCHEMA]
    });
    gui = {
      'inputs': [
        {
          'name': 'gitOrganisation',
          'value': 'corinnekrych'
        },
        {
          'name': 'named'
        },
        {
          'name': 'groupId',
          'value': 'io.openshift.booster'
        },
        {
          'name': 'version',
          'value': '1.0.0-SNAPSHOT'
        }
      ]
    };
    fixture = TestBed.createComponent(ProjectInfoStepComponent);
    comp = fixture.componentInstance;
    comp.gui = gui;
    // Validators added in abstract-wizard.component.ts
    let group: any = {
      gitOrganisation: new FormControl(gui.inputs[0].value || '', Validators.required),
      named: new FormControl(gui.inputs[1].value  || '', Validators.required),
      groupId: new FormControl(gui.inputs[2].value  || '', Validators.required),
      version: new FormControl(gui.inputs[3].value  || '', Validators.required)
    };
    comp.form = new FormGroup(group);
    comp.labelSpace = 'DefaultProjectName';
  });

  it('Project name is valid', async(() => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(comp.form.controls['named'].value).toEqual('defaultprojectname');
    });
  }));

  it('Project name is invalid when starting with numeric', async(() => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(comp.form.controls['named'].value).toEqual('defaultprojectname');
      // when
      comp.form.controls['named'].setValue('1234');
      fixture.detectChanges();
    }).then(() => {
      expect(comp.form.controls['named'].valid).toEqual(false);
      expect(comp.form.controls['named'].errors.pattern.requiredPattern).toEqual('/^[a-z][a-z0-9\\-]*$/');
    });
  }));

  it('Project name is invalid when containing uppercase', async(() => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(comp.form.controls['named'].value).toEqual('defaultprojectname');
      // when
      comp.form.controls['named'].setValue('MyProject');
      fixture.detectChanges();
    }).then(() => {
      expect(comp.form.controls['named'].valid).toEqual(false);
      expect(comp.form.controls['named'].errors.pattern.requiredPattern).toEqual('/^[a-z][a-z0-9\\-]*$/');
    });
  }));

  it('Project group is valid', async(() => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(comp.form.controls['groupId'].value).toEqual('io.openshift.booster');
      comp.form.controls['groupId'].setValue('io.openshift_1234.booster_1');
      fixture.detectChanges();
    }).then(() => {
      expect(comp.form.controls['groupId'].valid).toEqual(true);
    });
  }));

  it('Project group is invalid with special characters', async(() => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      comp.form.controls['groupId'].setValue('io.openshift;booster-1');
      fixture.detectChanges();
    }).then(() => {
      expect(comp.form.controls['groupId'].valid).toEqual(false);
      expect(comp.form.controls['groupId'].errors.pattern.requiredPattern).toEqual('/^[a-z][a-z_0-9\\.]*[a-z_0-9]$/');
    });
  }));
});



