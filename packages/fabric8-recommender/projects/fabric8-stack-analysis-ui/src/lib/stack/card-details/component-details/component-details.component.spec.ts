import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { TooltipModule } from 'ngx-bootstrap';

import { ProgressMeterModule } from '../../utils/progress-meter/progress-meter.module';
import { ComponentFeedbackModule } from '../../utils/component-feedback/component-feedback.module';

import { ComponentSnippetComponent } from '../component-information/component-snippet/component-snippet.component';

import { ToastNotificationModule } from '../../toast-notification/toast-notification.module';
import { ComponentInformationComponent } from '../component-information/component-information.component';
import { ComponentDetailsComponent } from './component-details.component';

const imports = [
    TooltipModule,
    ProgressMeterModule,
    ComponentFeedbackModule,
    ToastNotificationModule,
    HttpClientModule
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
                ComponentInformationComponent,
                ComponentDetailsComponent
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
