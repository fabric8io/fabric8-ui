import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ChooseQuickstartComponent } from './choose-quickstart.component';

describe('Forge-Wizard choose quickstart component', () => {
  let fixture, comp;
  let gui: any;

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [],
      declarations: [ChooseQuickstartComponent],
      providers: [],
      // Tells the compiler not to error on unknown elements and attributes
      schemas: [NO_ERRORS_SCHEMA]
    });
    gui = {
      'inputs': [
        {
          'name': 'quickstart',
          'valueChoices': [
            {
              'id': 'Vert.x - HTTP & Config Map',
              'name': 'Vert.x - HTTP & Config Map'
            },
            {
              'id': 'Vert.x HTTP Booster',
              'name': 'Vert.x HTTP Booster'
            }
          ],
          'value': 'Vert.x HTTP Booster'
        }
      ]
    };
    fixture = TestBed.createComponent(ChooseQuickstartComponent);
    comp = fixture.componentInstance;
    comp.gui = gui;
    // Validators added in abstract-wizard.component.ts
    let group: any = {
      quickstart: new FormControl(gui.inputs[0].value || '', Validators.required)
    };
    comp.form = new FormGroup(group);
  });

  it('Quickstart value should match default value', async(() => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(comp.form.controls['quickstart'].value).toEqual('Vert.x HTTP Booster');
    });
  }));
});





