import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Http, ConnectionBackend, RequestOptions, BaseRequestOptions } from '@angular/http';

import { TooltipModule } from 'ngx-bootstrap';

import { ProgressMeterModule } from '../../utils/progress-meter/progress-meter.module';
import { ComponentFeedbackModule } from '../../utils/component-feedback/component-feedback.module';

import { ComponentSnippetComponent } from '../component-information/component-snippet/component-snippet.component';
import { ComponentInformationComponent } from '../component-information/component-information.component';
import { ComponentDetailsComponent } from '../component-details/component-details.component';

import { ReportInformationComponent } from './report-information.component';
import { ToastNotificationComponent } from '../../toast-notification/toast-notification.component';
import { AddWorkFlowService } from '../../stack-details/add-work-flow.service';

import { ReportInformationModule } from './report-information.module';

const components = [
    ComponentSnippetComponent,
    ComponentInformationComponent,
    ComponentDetailsComponent,
    ReportInformationComponent,
    ToastNotificationComponent
];

const imports = [
    TooltipModule.forRoot(),
    ProgressMeterModule,
    ComponentFeedbackModule
];

describe ('ReportInformationComponent', () => {
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
                Http,
                AddWorkFlowService,
                ConnectionBackend,
                { provide: RequestOptions, useClass: BaseRequestOptions }
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
