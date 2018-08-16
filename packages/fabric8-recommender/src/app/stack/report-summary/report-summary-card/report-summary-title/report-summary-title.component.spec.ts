import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { MReportSummaryTitle } from '../../../models/ui.model';
import { ReportSummaryTitleComponent } from './report-summary-title.component';

describe('ReportSummaryTitleComponent', () => {
  let component: ReportSummaryTitleComponent;
  let fixture: ComponentFixture<ReportSummaryTitleComponent>;
  let element: HTMLElement;

  let title = new MReportSummaryTitle();
  title.notificationIcon = 'icon-notification';
  title.notificationIconBgColor = '#000000';
  title.titleIcon = 'icon-title';
  title.titleText = 'Title Text';

  let noNotification = new MReportSummaryTitle();
  noNotification.titleIcon = 'icon-title';
  noNotification.titleText = 'Title Text';

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ReportSummaryTitleComponent
      ],
      imports: [
        HttpClientModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportSummaryTitleComponent);
    component = fixture.componentInstance;
    component.title = title;
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('check if the input received is of the type MReportSummaryTitle', () => {
    expect(component.title instanceof MReportSummaryTitle).toBeTruthy();
  });

  it('should have proper title icon', () => {
    let parent = element.querySelector('.analytics-summary-title');
    let span = parent.querySelector('.card-pf-title').querySelector('span');
    expect(span.classList.contains(title.titleIcon)).toBe(true);
  });

  it('should have proper title text', () => {
    let parent = element.querySelector('.analytics-summary-title');
    let titleElem = <HTMLDivElement>parent.querySelector('.card-pf-title');
    let titleText: string = titleElem.innerText;
    titleText = titleText ? titleText.trim() : null;
    expect(titleText).toEqual(title.titleText);
  });

  it('should notification icon only if there are notifications', () => {
    let parent = element.querySelector('.analytics-summary-title');
    let notificationElem = <HTMLSpanElement>parent.querySelector('.ana-notification-icon');
    expect(notificationElem).toBeDefined();
  });

  it('should not show notification icon if there are no notifications', () => {
    component.title = noNotification;
    fixture.detectChanges();
    let parent = element.querySelector('.analytics-summary-title');
    let notificationElem = <HTMLSpanElement>parent.querySelector('.ana-notification-icon');
    expect(notificationElem).toBeNull();
  });
});
