import { SpacesService } from '../../../shared/spaces.service';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Notification, NotificationAction, Notifications, NotificationType } from 'ngx-base';
import {
  SpaceService,
  SpaceNamePipe,
  SpaceTemplateService,
  SpaceTemplate
} from 'ngx-fabric8-wit';
import { UserService } from 'ngx-login-client';
import { Observable } from 'rxjs';
import { SpaceNamespaceService } from '../../../shared/runtime-console/space-namespace.service';
import { LoggerFactory } from '../../common/logger';
import { AppGeneratorConfiguratorService } from '../../services/app-generator.service';
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { By } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { FormsModule, NgForm } from '@angular/forms';
import {
  async,
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { SpaceCreatorComponent } from './space-creator.component';

describe('Space Creator Component', () => {

  let routerMock: any;
  let spaceTemplateServiceMock: any;
  let spaceServiceMock: any;
  let notificationMock: any;
  let userServiceMock: any;
  let spaceNamespaceServiceMock: any;
  let spaceNamePipeMock: any;
  let configuratorServiceMock: any;
  let spacesServiceMock: any;
  let loggerFactoryMock: any;
  let fixture;
  let spaceTemplates = [
    {
      "attributes": {
        "created-at": "0001-01-01T00:00:00Z",
        "description": "Scrum-based planning",
        "name": "Scrum",
        "template": "LS0tC",
        "updated-at": "0001-01-01T00:00:00Z",
        "version": 0
      },
      "id": "aa83de92-33c1-44d1-a6ff-3b9a89ead383",
      "links": {
        "self": "http://localhost:8080/api/spacetemplates/aa83de92-33c1-44d1-a6ff-3b9a89ead383"
      },
      "type": "spacetemplates"
    },
    {
      "attributes": {
        "created-at": "2017-05-29T15:55:47.752546Z",
        "description": "A very simple development methodology focused on the tracking of Issues and the Tasks needed to be completed to resolve a particular Issue.",
        "name": "Issue Tracking",
        "template": "LS0tCW5nIgoBUYXNrIgogICAgdG9wb2xvZ3k6IHRyZWUKLi4u",
        "updated-at": "2017-05-29T15:55:47.752546Z",
        "version": 0
      },
      "id": "018443b8-e204-4913-96f7-1802eec235b4",
      "links": {
        "self": "http://localhost:8080/api/spacetemplates/018443b8-e204-4913-96f7-1802eec235b4"
      },
      "type": "spacetemplates"
    }];
  let space =  {
      name: 'TestSpace',
      path: 'testspace',
      teams: [],
      defaultTeam: null,
      'attributes': {
        'name': 'TestSpace',
        description: 'This is a space for unit test',
        'created-at': null,
        'updated-at': null,
        'version': 0
      },
      'id': '1',
      'type': 'spaces',
      'links': {
        'self': 'http://example.com/api/spaces/1'
      },
      'relationships': {
        areas: {
          links: {
            related: 'http://example.com/api/spaces/1/areas'
          }
        },
        iterations: {
          links: {
            related: 'http://example.com/api/spaces/1/iterations'
          }
        },
        'space-template': {
          data: {
            id: '',
            type: 'spacetemplates'
          },
          links: {
            related: 'http://roro.com'
          }
        },
        'owned-by': {
          'data': {
            'id': '00000000-0000-0000-0000-000000000000',
            'type': 'identities'
          }
        }
      }
    };
  beforeEach(() => {
    routerMock = jasmine.createSpy('Router');
    notificationMock = jasmine.createSpyObj('Notifications', ['message']);
    spaceTemplateServiceMock = jasmine.createSpyObj('SpaceTemplateService', ['getSpaceTemplates']);
    spaceServiceMock = jasmine.createSpyObj('SpaceService', ['getSpaceByName']);
    userServiceMock = jasmine.createSpy('UserService');
    spaceNamespaceServiceMock = jasmine.createSpy('SpaceNamespaceService');
    spaceNamePipeMock = jasmine.createSpy('SpaceNamePipe');
    configuratorServiceMock = jasmine.createSpy('AppGeneratorConfiguratorService');
    spacesServiceMock = jasmine.createSpy('SpacesService');

    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [SpaceCreatorComponent],
      providers: [
        LoggerFactory,
        {
          provide: Router, useValue: routerMock
        },
        {
          provide: SpaceTemplateService, useValue: spaceTemplateServiceMock
        },
        {
          provide: SpaceService, useValue: spaceServiceMock
        },
        {
          provide: UserService, useValue: userServiceMock
        },
        {
          provide: SpaceNamespaceService, useValue: spaceNamespaceServiceMock
        },
        {
          provide: SpaceNamePipe, useValue: spaceNamePipeMock
        },
        {
          provide: AppGeneratorConfiguratorService, useValue: configuratorServiceMock
        },
        {
          provide: SpacesService, useValue: spacesServiceMock
        },
        {
          provide: Notifications, useValue: notificationMock
        },
        SpaceCreatorComponent
      ],
      // Tells the compiler not to error on unknown elements and attributes
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(SpaceCreatorComponent);
  });

  it('Retrieve template list onInit', async(() => {
    // given
    let comp = fixture.componentInstance;
    spaceTemplateServiceMock.getSpaceTemplates.and.returnValue(Observable.of(spaceTemplates));

    // when
    comp.ngOnInit();

    // then
    expect(spaceTemplateServiceMock.getSpaceTemplates).toHaveBeenCalled();
    expect(comp.spaceTemplates.length).toEqual(2);
  }));

  // todo(corinne)
  xit('Display Scrum as default space template', async(() => {
    // given
    let comp = fixture.componentInstance;
    spaceTemplateServiceMock.getSpaceTemplates.and.returnValue(Observable.of(spaceTemplates));
    spaceServiceMock.getSpaceByName.and.returnValue(Observable.of(space));
    const nameInput = fixture.debugElement.query(By.css('#name'));
    nameInput.nativeElement.value = 'myspace';
    fixture.detectChanges()
    fixture.whenStable().then(() => {

    })
  }));

});
