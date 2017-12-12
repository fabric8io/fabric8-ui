import { TestBed } from '@angular/core/testing';

import { ProfileService, ExtProfile } from './../profile/profile.service';
import { Broadcaster } from 'ngx-base';
import { ConnectableObservable } from 'rxjs/observable/ConnectableObservable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Injectable } from '@angular/core';

import { LocalStorageService } from 'angular-2-local-storage';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { Spaces, Contexts, Space, SpaceService } from 'ngx-fabric8-wit';
import { cloneDeep } from 'lodash';

import { SpacesService } from './spaces.service';
import {context1, context2, space, profile } from './spaces.service.mock';

describe('Spaces Service:', () => {
	let mockContexts: any;
	let mockLocalStorage: any;
  let mockSpaceService: any;
  let mockProfileService: any;
  let spacesService: SpacesService;

	beforeEach(() => {
		mockContexts = jasmine.createSpyObj('Contexts', ['current']);
		mockContexts.current = Observable.of(context1);
    mockLocalStorage = jasmine.createSpy('LocalStorageService');
		mockSpaceService = jasmine.createSpyObj('mockSpaceService', ['getSpaceById']);
		mockSpaceService.getSpaceById = (spaceId: string): Observable<Space> {
			let tmpspace = cloneDeep(space);
			tmpspace.name = "space_" + spaceId;
			tmpspace.id = spaceId;
			tmpspace.attributes.name = "space_" + spaceId;
			return  Observable.of(tmpspace);
    };

    mockProfileService = jasmine.createSpy('ProfileService');
    mockProfileService.current = Observable.of(profile);

    TestBed.configureTestingModule({
      imports: [],
      providers: [
        {
          provide: Contexts, useValue: mockContexts
        },
        {
          provide: LocalStorageService, useValue: mockLocalStorage
        },
        {
          provide: SpaceService, useValue: mockSpaceService
        },
        {
          provide: ProfileService, useValue: mockProfileService
        },
        Broadcaster,
        SpacesService
      ]
    });

    spacesService = TestBed.get(SpacesService);

  });

it('Space updates, SpacesService updates the current space.', () => {

		let expected_current_space = "1";
		spacesService.current
			.subscribe((sp: Space) => expect(sp.id).toEqual(expected_current_space));

		let new_space_to_update = "5";

		expected_current_space = new_space_to_update;
		let updatedSpace = cloneDeep(space);
		updatedSpace.name = "space_" + new_space_to_update;
		updatedSpace.id = new_space_to_update;
		updatedSpace.attributes.name = "space_" + new_space_to_update;

		spacesService.broadcaster.broadcast('spaceUpdated', updatedSpace);

  });

});