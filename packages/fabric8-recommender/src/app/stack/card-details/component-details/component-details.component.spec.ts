import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Http, ConnectionBackend, RequestOptions, BaseRequestOptions } from '@angular/http';

import { TooltipModule } from 'ngx-bootstrap';

import { ProgressMeterModule } from '../../utils/progress-meter/progress-meter.module';
import { ComponentFeedbackModule } from '../../utils/component-feedback/component-feedback.module';

import { ComponentSnippetComponent } from '../component-information/component-snippet/component-snippet.component';

import { ToastNotificationComponent } from '../../toast-notification/toast-notification.component';
import { ComponentInformationComponent } from '../component-information/component-information.component';
import { ComponentDetailsComponent } from './component-details.component';

const imports = [
    TooltipModule,
    ProgressMeterModule,
    ComponentFeedbackModule
];

describe ('ComponentDetailsComponent', () => {
    let component: ComponentDetailsComponent;
    let fixture: ComponentFixture<ComponentDetailsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                ...imports
            ],
            declarations: [
                ComponentSnippetComponent,
                ToastNotificationComponent,
                ComponentInformationComponent,
                ComponentDetailsComponent
            ],
            providers: [
                Http,
                ConnectionBackend,
                { provide: RequestOptions, useClass: BaseRequestOptions }
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ComponentDetailsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
