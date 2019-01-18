import { CommonModule } from '@angular/common';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { HttpModule } from '@angular/http';
import { Store, StoreModule } from '@ngrx/store';
import { WidgetsModule } from 'ngx-widgets';
import { AppState } from './../../../app/states/app.state';
import { LabelService } from './../../services/label.service';
import { SelectDropdownModule } from './../../widgets/select-dropdown/select-dropdown.module';
import { LabelSelectorComponent } from './label-selector.component';

import { HttpClientService } from './../../shared/http-module/http.service';

let componentInstance: LabelSelectorComponent;
let fixture: ComponentFixture<LabelSelectorComponent>;
let store: Store<AppState>;

describe('LabelSelectorComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        WidgetsModule,
        CommonModule,
        HttpModule,
        HttpClientTestingModule,
        SelectDropdownModule,
        StoreModule.forRoot({}),
      ],
      declarations: [LabelSelectorComponent],
      providers: [LabelService, HttpClientService, Store],
    })
      .compileComponents()
      .then(() => {
        let store = TestBed.get(Store);
        spyOn(store, 'dispatch').and.callThrough();
        fixture = TestBed.createComponent(LabelSelectorComponent);
        componentInstance = fixture.componentInstance;
        fixture.detectChanges();
      });
  }));

  it(`should create label selector component`, async(() => {
    expect(componentInstance).toBeTruthy();
  }));

  it('should recognize a label name field', async(() => {
    fixture.detectChanges();
    const labelnameInput = fixture.componentInstance.labelnameInput;
    expect(labelnameInput).toBeDefined();
  }));

  it('should remove the white spaces', async(() => {
    let labelnameInput = fixture.componentInstance.labelnameInput;
    labelnameInput.nativeElement.input = '  ';
    fixture.detectChanges();
    expect(labelnameInput.nativeElement.value.length).toBe(0);
  }));

  it('should disable the create label button', async(() => {
    let labelnameInput = fixture.componentInstance.labelnameInput;
    labelnameInput.nativeElement.input = '  ';
    fixture.detectChanges();
    // check if button is disabled
    expect(fixture.componentInstance['createDisabled']).toBeTruthy();
    expect(labelnameInput.nativeElement.value.length).toBe(0);
  }));
});
