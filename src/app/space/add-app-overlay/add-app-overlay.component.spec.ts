import { ErrorHandler } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { Broadcaster, Logger, Notification, Notifications, NotificationType } from 'ngx-base';
import { PopoverConfig, PopoverModule } from 'ngx-bootstrap/popover';
import { Context, ProcessTemplate, Space, SpaceNamePipe, SpaceService } from 'ngx-fabric8-wit';
import { DependencyCheckService } from 'ngx-forge';
import { Profile, User, UserService } from 'ngx-login-client';
import { Observable } from 'rxjs/Observable';

import { SpaceNamespaceService } from 'app/shared/runtime-console/space-namespace.service';
import { ContextService } from '../../shared/context.service';
import { SpaceTemplateService } from '../../shared/space-template.service';
import { SpacesService } from '../../shared/spaces.service';
import { AddAppOverlayComponent } from './add-app-overlay.component';

describe ('AddAppOverlayComponent', () => {
    let component: AddAppOverlayComponent;
    let fixture: ComponentFixture<AddAppOverlayComponent>;

    let mockBroadcaster: any = jasmine.createSpyObj('Broadcaster', ['broadcast']);
    let mockRouter: any = jasmine.createSpyObj('Router', ['navigate']);
    let mockSpaceTemplateService: any = {
        getSpaceTemplates: () => {
        return Observable.of(mockSpaceTemplates);
        }
    };
    let mockSpaceService: any = jasmine.createSpyObj('SpaceService', ['create']);
    let mockNotifications: any = jasmine.createSpyObj('Notifications', ['message']);
    let mockUserService: any = jasmine.createSpyObj('UserService', ['getUser']);
    let mockSpaceNamespaceService: any = jasmine.createSpy('SpaceNamespaceService');
    let mockSpaceNamePipe: any = jasmine.createSpy('SpaceNamePipe');
    let mockSpacesService: any = jasmine.createSpyObj('SpacesService', ['addRecent']);
    let mockContextService: any = jasmine.createSpy('ContextService');
    let mockLogger: any = jasmine.createSpyObj('Logger', ['error']);
    let mockErrorHandler: any = jasmine.createSpyObj('ErrorHandler', ['handleError']);
    let mockSubject: any = jasmine.createSpy('Subject');
    let mockDependencyCheckService: any = {
        getDependencyCheck(): Observable<any> {
            return Observable.of([]);
        }
    };

    let mockProfile: Profile = {
        fullName: 'mock-fullName',
        imageURL: 'mock-imageURL',
        username: 'mock-username'
    };

    let mockUser: User = {
        id: 'mock-id',
        attributes: mockProfile,
        type: 'mock-type'
    };

    let mockSpace: Space = {
        name: 'mock-space',
        path: 'mock-path',
        teams: [
        { name: 'mock-name', members: [ mockUser ] }
        ],
        defaultTeam: { name: 'mock-name', members: [ mockUser ] },
        id: 'mock-id',
        attributes: {
        name: 'mock-attribute',
        description: 'mock-description',
        'updated-at': 'mock-updated-at',
        'created-at': 'mock-created-at',
        version: 0
        },
        type: 'mock-type',
        links: {
        self: 'mock-self'
        },
        relationships: {
        areas: { links: { related: 'mock-related' } },
        iterations: { links: { related: 'mock-related' } },
        workitemtypegroups: { links: { related: 'mock-related' } },
        'owned-by': {
            data: {
            id: mockUser.id,
            type: mockUser.type
            }
        }
        },
        relationalData: {
        creator: mockUser
        }
    };

    let mockSpaceTemplates: ProcessTemplate[] = [{
        attributes: {
        'can-construct': false,
        description: 'Description-1',
        name: 'Template - 01'
        },
        id: 'template-01',
        type: 'spacetemplates'
    }, {
        attributes: {
        'can-construct': true,
        description: 'Description-2',
        name: 'Template - 02'
        },
        id: 'template-02',
        type: 'spacetemplates'
    }, {
        attributes: {
        'can-construct': true,
        description: 'Description-3',
        name: 'Template - 03'
        },
        id: 'template-03',
        type: 'spacetemplates'
    }] as ProcessTemplate[];

    let mockMessage: Notification = {
        message: `Failed to create "${mockSpace.name}"`,
        type: NotificationType.DANGER
    };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                FormsModule,
                HttpModule,
                PopoverModule.forRoot()
            ],
            declarations: [
                AddAppOverlayComponent
            ],
            providers: [
                { provide: DependencyCheckService, useValue: mockDependencyCheckService },
                PopoverConfig,
                { provide: Broadcaster, useValue: mockBroadcaster },
                { provide: Router, useValue: mockRouter },
                { provide: SpaceTemplateService, useValue: mockSpaceTemplateService },
                { provide: SpaceService, useValue: mockSpaceService },
                { provide: Notifications, useValue: mockNotifications },
                { provide: UserService, useValue: mockUserService },
                { provide: SpaceNamespaceService, useValue: mockSpaceNamespaceService },
                { provide: SpaceNamePipe, useValue: mockSpaceNamePipe },
                { provide: SpacesService, useValue: mockSpacesService },
                { provide: ContextService, useValue: mockContextService },
                { provide: Logger, useValue: mockLogger },
                { provide: ErrorHandler, useValue: mockErrorHandler }
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AddAppOverlayComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
