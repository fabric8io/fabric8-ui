import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';


import { ReportSummaryCardComponent } from './report-summary-card.component';

import { ReportSummaryTitleComponent } from './report-summary-title/report-summary-title.component';
import { ReportSummaryDescriptionComponent } from './report-summary-description/report-summary-description.component';
import { ReportSummaryContentModule } from './report-summary-content/report-summary-content.module';
import { SaveState } from '../../utils/SaveState';

const dependencies = [
  ReportSummaryTitleComponent,
  ReportSummaryDescriptionComponent
];

const imports = [
  ReportSummaryContentModule,
  HttpClientModule
];

describe('ReportSummaryCardComponent', () => {
  let component: ReportSummaryCardComponent;
  let fixture: ComponentFixture<ReportSummaryCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ...imports
      ],
      declarations: [
        ReportSummaryCardComponent,
        ...dependencies
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportSummaryCardComponent);
    component = fixture.componentInstance;
    SaveState.ELEMENTS[0] = document.createElement('div');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
