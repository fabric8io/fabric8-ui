import { DebugNode, ErrorHandler, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Broadcaster, Logger } from 'ngx-base';
import { Contexts, Fabric8WitModule, SpaceService, WIT_API_URL } from 'ngx-fabric8-wit';
import { Observable } from 'rxjs/Observable';

import { createMock } from 'testing/mock';
import { SpacesComponent } from './spaces.component';

describe('SpacesComponent', () => {
  let fixture: ComponentFixture<SpacesComponent>;
  let component: DebugNode['componentInstance'];
  let mockContexts: any = jasmine.createSpy('Contexts');
  let mockLogger: any = jasmine.createSpyObj('Logger', ['error']);
  let mockSpaceService: any = jasmine.createSpyObj('SpaceService', ['getSpacesByUser', 'getMoreSpacesByUser']);
  let mockBroadcaster: any = jasmine.createSpyObj('Broadcaster', ['broadcast', 'on']);
  let mockEvent = jasmine.createSpy('Event');
  let mockErrorHandler: jasmine.SpyObj<ErrorHandler> = createMock(ErrorHandler);
  let mockContext: any;

  beforeEach(() => {
    mockBroadcaster.on.and.returnValue(Observable.of({}));
    mockContext = {
      'user': {
        'attributes': {
          'username': 'mock-username'
        },
        'id': 'mock-user'
      }
    };
    mockContexts.current = Observable.of(mockContext);

    TestBed.configureTestingModule({
      imports: [
        Fabric8WitModule
      ],
      declarations: [SpacesComponent],
      providers: [
        { provide: Contexts, useValue: mockContexts },
        { provide: Logger, useValue: mockLogger },
        { provide: Broadcaster, useValue: mockBroadcaster },
        { provide: ErrorHandler, useValue: mockErrorHandler },
        { provide: WIT_API_URL, useValue: 'http://example.com' }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
    TestBed.overrideProvider(SpaceService, {'useValue': mockSpaceService});
    fixture = TestBed.createComponent(SpacesComponent);
    component = fixture.debugElement.componentInstance;
  });

  describe('#ngOnInit', () => {
    it('should simply delegate to initSpaces() with the page size', () => {
      component.pageSize = 5;
      spyOn(component, 'initSpaces');
      component.ngOnInit();
      expect(component.initSpaces).toHaveBeenCalledWith({pageSize: 5});
    });
  });

  describe('#initSpaces', () => {

    // ensure the component is not left in a loading state
    afterEach(() => {
      expect(component.loading).toEqual(false);
    });

    it('should use spaceService.getSpacesByUser to set the initial spaces', () => {
      component.context = mockContext;
      component.spaceService.getSpacesByUser.and.returnValue(Observable.of('mock-spaces'));
      component.initSpaces(mockEvent);
      expect(component.spaces).toBe('mock-spaces');
    });

    it('should log an error if the context or context.user is empty', () => {
      component.context = {};
      component.initSpaces(mockEvent);
      expect(component.logger.error).toHaveBeenCalled();
    });
  });

  describe('#fetchMoreSpaces', () => {
    it('should retrieve more spaces and add them to the current list', () => {
      component.context = mockContext;
      component.spaceService.getMoreSpacesByUser.and.returnValue(Observable.of(['more-spaces']));
      component.fetchMoreSpaces(mockEvent);
      expect(component.spaces).toContain('more-spaces');
    });

    it('should report an error if getMoreSpaces() has an Observable error', () => {
      component.context = mockContext;
      component.spaceService.getMoreSpacesByUser.and.returnValue(Observable.throw('error'));
      component.fetchMoreSpaces(mockEvent);
      expect(component.logger.error).toHaveBeenCalledWith('error');
    });

    it('should log an error if the context or context.user is empty', () => {
      component.context = {};
      component.fetchMoreSpaces(mockEvent);
      expect(component.logger.error).toHaveBeenCalledWith('Failed to retrieve list of spaces owned by user');
    });
  });

});
