import { LocationStrategy } from '@angular/common';
import { DebugNode, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { Broadcaster } from 'ngx-base';
import { Contexts } from 'ngx-fabric8-wit';
import { SpaceService } from 'ngx-fabric8-wit';
import { UserService } from 'ngx-login-client';
import { Observable } from 'rxjs/Observable';

import { ContextService } from '../../shared/context.service';
import { OverviewComponent } from './overview.component';


describe('OverviewComponent', () => {
  let fixture: ComponentFixture<OverviewComponent>;
  let component: DebugNode['componentInstance'];
  let mockContexts: any = jasmine.createSpy('Contexts');
  let mockSpaceService: any = jasmine.createSpyObj('SpaceService', ['getSpacesByUser']);
  let mockUserService: any = jasmine.createSpy('UserService');
  let mockContextService: any = jasmine.createSpyObj('ContextService', ['viewingOwnContext']);
  let mockBroadcaster: any = jasmine.createSpyObj('Broadcaster', ['on']);
  let mockRouter: any = jasmine.createSpyObj('Router', ['createUrlTree', 'navigate', 'serializeUrl']);
  let mockActivatedRoute: any = jasmine.createSpy('ActivatedRoute');
  let mockLocationStrategy: any = jasmine.createSpyObj('LocationStrategy', ['prepareExternalUrl']);
  let mockRouterEvent: any = {
    'id': 1,
    'url': 'mock-url'
  };
  let mockContext: any = {
    'user': {
      'attributes': {
        'username': 'mock-username'
      },
      'id': 'mock-user'
    }
  };
  let mockSpace: any = {
    name: 'mock-space',
    path: 'mock-path',
    id: 'mock-id',
    attributes: {
      name: 'mock-attribute',
      description: 'mock-description',
      'updated-at': 'mock-updated-at',
      'created-at': 'mock-created-at',
      version: 0
    }
  };

  beforeEach(() => {
    mockBroadcaster.on.and.returnValue(Observable.of(mockContext));
    mockContexts.current = Observable.of(mockContext);
    mockRouter.events = Observable.of(mockRouterEvent);
    mockRouter.createUrlTree.and.returnValue({});
    mockUserService.loggedInUser = Observable.of(mockContext.user);
    mockUserService.currentLoggedInUser = Observable.of(mockContext.user);
    mockSpaceService.getSpacesByUser.and.returnValue(Observable.of([mockSpace]));

    TestBed.configureTestingModule({
      imports: [RouterModule],
      declarations: [OverviewComponent],
      providers: [
        { provide: Contexts, useValue: mockContexts },
        { provide: SpaceService, useValue: mockSpaceService },
        { provide: UserService, useValue: mockUserService },
        { provide: ContextService, useValue: mockContextService },
        { provide: Broadcaster, useValue: mockBroadcaster },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: LocationStrategy, useValue: mockLocationStrategy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
  });

  describe('#constructor', () => {
    it('should not subscribe to spaceService if there are no user attributes', () => {
      mockContext.user.attributes = undefined;
      fixture = TestBed.createComponent(OverviewComponent);
      component = fixture.debugElement.componentInstance;
      expect(component.spaceService.getSpacesByUser).toHaveBeenCalledTimes(0);
    });
  });

  describe('#ngOnInit', () => {
    it('should set the context.user value to be userService.currentLoggedInUser.attributes', () => {
      fixture = TestBed.createComponent(OverviewComponent);
      component = fixture.debugElement.componentInstance;
      component.userService.currentLoggedInUser.attributes = 'different-attributes';
      mockContextService.viewingOwnContext.and.returnValue(true);
      component.ngOnInit();
      expect(component.context.user.attributes).toEqual('different-attributes');
      component.ngOnDestroy();
    });

    it('should not update context.user if userService.currentLoggedInUser.attributes does not exist', () => {
      fixture = TestBed.createComponent(OverviewComponent);
      component = fixture.debugElement.componentInstance;
      mockContextService.viewingOwnContext.and.returnValue(true);
      component.userService.currentLoggedInUser.attributes = undefined;
      component.ngOnInit();
      expect(component.context.user.attributes).toEqual(mockContext.user.attributes);
      component.ngOnDestroy();
    });

    it('should not update context.user if not viewing own account', () => {
      fixture = TestBed.createComponent(OverviewComponent);
      component = fixture.debugElement.componentInstance;
      mockContextService.viewingOwnContext.and.returnValue(false);
      component.userService.currentLoggedInUser.attributes = 'different-attributes';
      component.ngOnInit();
      expect(component.context.user.attributes).toEqual(mockContext.user.attributes);
      component.ngOnDestroy();
    });

  });

  describe('#routeToUpdateProfile()', () => {
    it('should route to the _update page for the given user', () => {
      fixture = TestBed.createComponent(OverviewComponent);
      component = fixture.debugElement.componentInstance;
      component.ngOnInit();
      component.routeToUpdateProfile();
      expect(component.router.navigate).toHaveBeenCalledWith(['/', mockContext.user.attributes.username, '_update']);
      component.ngOnDestroy();
    });
  });

});
