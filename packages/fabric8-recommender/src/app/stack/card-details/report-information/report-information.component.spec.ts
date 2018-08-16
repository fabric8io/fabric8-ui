import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { TooltipModule } from 'ngx-bootstrap';

import { ProgressMeterModule } from '../../utils/progress-meter/progress-meter.module';
import { ComponentFeedbackModule } from '../../utils/component-feedback/component-feedback.module';

import { ComponentSnippetComponent } from '../component-information/component-snippet/component-snippet.component';
import { ComponentInformationComponent } from '../component-information/component-information.component';
import { ComponentDetailsComponent } from '../component-details/component-details.component';

import { ReportInformationComponent } from './report-information.component';
import { AddWorkFlowService } from '../../stack-details/add-work-flow.service';

import { NoDataComponent } from './no-data/no-data.component';

import { ReportInformationModule } from './report-information.module';
import { ToastNotificationModule } from '../../toast-notification/toast-notification.module';

const components = [
  ComponentSnippetComponent,
  ComponentInformationComponent,
  ComponentDetailsComponent,
  ReportInformationComponent,
  NoDataComponent
];

const imports = [
  TooltipModule.forRoot(),
  ProgressMeterModule,
  ComponentFeedbackModule,
  ToastNotificationModule,
  HttpClientModule
];

describe('ReportInformationComponent', () => {
  let component: ReportInformationComponent;
  let fixture: ComponentFixture<ReportInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ...imports
      ],
      declarations: [
        ...components
      ],
      providers: [
        AddWorkFlowService
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
