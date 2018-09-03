import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { ReportSummaryInfoEntriesComponent } from './report-info-entries/report-info-entries.component';
import { ProgressMeterModule } from '../../../utils/progress-meter/progress-meter.module';

import {
  MReportSummaryContent,
  MReportSummaryInfoEntry
} from '../../../models/ui.model';
import { ReportSummaryContentComponent } from './report-summary-content.component';

describe('ReportSummaryContentComponent', () => {
  let component: ReportSummaryContentComponent;
  let fixture: ComponentFixture<ReportSummaryContentComponent>;
  let element: HTMLElement;
  let summaryContent: MReportSummaryContent = new MReportSummaryContent();

  let jsons = [{
    infoText: 'text1',
    infoValue: {},
    infoType: 'text',
    config: {}
  }, {
    infoText: 'text2',
    infoValue: {},
    infoType: 'progress',
    config: {}
  }];
  summaryContent.infoEntries = [];
  jsons.forEach((json) => {
    let entry = new MReportSummaryInfoEntry();
    entry.config = json.config;
    entry.infoText = json.infoText;
    entry.infoType = json.infoType;
    entry.infoValue = json.infoValue;
    summaryContent.infoEntries.push(entry);
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ReportSummaryInfoEntriesComponent,
        ReportSummaryContentComponent
      ],
      imports: [
        ProgressMeterModule,
        HttpClientModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportSummaryContentComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('check if the input received is of the type MReportSummaryContent', () => {
    component.content = summaryContent;
    expect(component.content instanceof MReportSummaryContent).toBeTruthy();
  });

  it('should have empty HTMLDOM when there are no information to show', () => {
    let parent = element.querySelector('.analytics-summary-content');
    expect(parent.children.length).toBe(0);
  });

  it('should have some children when there are some information to show', () => {
    component.content = summaryContent;
    fixture.detectChanges();
    let parent = element.querySelector('.analytics-summary-content');
    expect(parent.children.length).toBe(1);
  });

  it('should have created ' + summaryContent.infoEntries.length + ' entries of ana-summary-info element', () => {
    component.content = summaryContent;
    fixture.detectChanges();
    let parent = element.querySelector('.analytics-summary-content');
    expect(parent.children[0].children.length).toBe(summaryContent.infoEntries.length);
  });
});
