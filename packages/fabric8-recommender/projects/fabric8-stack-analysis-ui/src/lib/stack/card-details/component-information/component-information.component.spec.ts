import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { Observable, of } from 'rxjs';

import { Contexts } from 'ngx-fabric8-wit';
import { AuthenticationService } from 'ngx-login-client';

import { ComponentInformationComponent } from './component-information.component';
import { AddWorkFlowService } from '../../stack-details/add-work-flow.service';

import { TooltipModule } from 'ngx-bootstrap';
import { ToastNotificationModule } from '../../toast-notification/toast-notification.module';
import { ComponentSnippetComponent } from './component-snippet/component-snippet.component';

import { ProgressMeterModule } from '../../utils/progress-meter/progress-meter.module';
import { ComponentFeedbackModule } from '../../utils/component-feedback/component-feedback.module';

import { witApiUrlProvider } from '../../../../../../../src/app/shared/wit-api.provider';
import { ApiLocatorService } from '../../../../../../../src/app/shared/api-locator.service';
import { authApiUrlProvider } from '../../../../../../../src/app/shared/auth-api.provider';
import { ssoApiUrlProvider } from '../../../../../../../src/app/shared/sso-api.provider';
import { realmProvider } from '../../../../../../../src/app/shared/realm-token.provider';
import { MockAuthenticationService } from '../../../../../../../src/app/shared/mock-auth.service';

import {
    MRecommendationInformation,
    MComponentInformation,
    MGenericStackInformation,
    MComponentHeaderColumn,
    MGithub,
    MOsio
} from '../../models/ui.model';


const mockAddWorkFlowService = {
    addWorkFlow(): Observable<any> {
      const wfDetails = of( <any>{
        links: { self: 'https://openshift.io/api/spaces/41006333-2d18-4de8-98f8-8d00d0196e15/workitems'},
        type: 'workitems',
        id: 'b682f960-0df2-479f-ba16-aec7c0c6f117'
      });
      return wfDetails;
    }
  };

describe ('ComponentInformationComponent', () => {
    let component: ComponentInformationComponent;
    let fixture: ComponentFixture<ComponentInformationComponent>;
    let element: HTMLElement;
    const genericInformation: MGenericStackInformation = new MGenericStackInformation(
        '',
        ''
    );
    const positions: Array<MComponentHeaderColumn> = [new MComponentHeaderColumn(
        'component',
        'component name',
        'class-name',
        false,
        false
    )];
    const componentInformation: MComponentInformation = new MComponentInformation (
        'component',
        '1.3.2',
        '1.4.3',
        null,
        false,
        false,
        false,
        null,
        null,
        new MGithub(
            2,
            3,
            4,
            5,
            3,
            null
        ),
        new MOsio(
            3
        ),
        '',
        false,
        null,
        false,
        null,
        '',
        '',
        null
    );

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                TooltipModule,
                ProgressMeterModule,
                ComponentFeedbackModule,
                ComponentFeedbackModule,
                ToastNotificationModule,
                HttpClientModule
            ],
            declarations: [
                ComponentInformationComponent,
                ComponentSnippetComponent
            ],
            providers: [
                Contexts,
                witApiUrlProvider,
                ApiLocatorService,
                authApiUrlProvider,
                ssoApiUrlProvider,
                realmProvider,
                {
                    provide: AuthenticationService, useClass: MockAuthenticationService
                },
                {
                    provide: AddWorkFlowService,
                    useValue: mockAddWorkFlowService
                }
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ComponentInformationComponent);
        component = fixture.componentInstance;
        element = fixture.nativeElement;
        component.component = componentInformation;
        component.genericInformation = genericInformation;
        component.positions = positions;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('check if the input received in "component" is either of type  MComponentInformation or MRecommendationInformation', () => {
        expect(component.component instanceof MComponentInformation ||
             component.component instanceof MRecommendationInformation).toBeTruthy();
    });

    it('check if the input received in "genericInformation" is of type  MGenericStackInformation', () => {
        expect(component.genericInformation instanceof MGenericStackInformation).toBeTruthy();
    });

    it('check if the input received in "positions" is of type MComponentHeaderColumn', () => {
        expect(component.positions[0] instanceof MComponentHeaderColumn).toBeTruthy();
    });

    it('should expand if "isOpen" is true', () => {
        (<MComponentInformation>component.component).isOpen = true;
        fixture.detectChanges();
        const parent = element.querySelector('.analytics-component-information');
        expect(parent.querySelector('.accordion-body')).toBeDefined();
    });

    it('should be normal if "isOpen" is false', () => {
        (<MComponentInformation>component.component).isOpen = false;
        fixture.detectChanges();
        const parent = element.querySelector('.analytics-component-information');
        expect(parent.querySelector('.accordion-body')).toBeNull();
    });

    it('should have a split view if recommendation is present with component', () => {
        (<MComponentInformation>component.component).isOpen = true;
        (<MComponentInformation>component.component).recommendation = new MRecommendationInformation(
            'alternate',
            'This is the reason',
            null,
            null,
            new MComponentInformation(
                'alternate-1',
                '',
                '',
                null,
                false,
                false,
                false,
                null,
                null,
                null,
                null,
                'Create work item',
                false,
                null,
                false,
                null,
                '',
                '',
                null
            ),
            '',
            null
        );
        fixture.detectChanges();
        const parent = element.querySelector('.analytics-component-information');
        expect(parent.querySelector('.accordion-body').children.length).toBe(2);
    });

    // TODO should improve coverage

});
