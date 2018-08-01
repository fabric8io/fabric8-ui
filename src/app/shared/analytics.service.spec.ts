import { TestBed } from '@angular/core/testing';
import { HttpModule } from '@angular/http';
import { Router } from '@angular/router';
import { Broadcaster } from 'ngx-base';
import { Contexts, Spaces } from 'ngx-fabric8-wit';
import { UserService } from 'ngx-login-client';
import { Observable, Subject } from 'rxjs';
import { createMock } from 'testing/mock';

import { AnalyticService } from './analytics.service';
import { Fabric8UIConfig } from './config/fabric8-ui-config';
import { loggedInUser } from './context.service.mock';
import { NotificationsService } from './notifications.service';

interface BroadcastEvent {
  key: any;
  data?: any;
}

describe('Analytic Service:', () => {
  let mockRouter: any;
  let mockBroadcaster: jasmine.SpyObj<Broadcaster>;
  let mockUserService: any;
  let analyticService: AnalyticService;
  let mockNotificationsService: jasmine.SpyObj<NotificationsService>;

  beforeEach(() => {
    mockRouter = jasmine.createSpy('Router');
    mockUserService = jasmine.createSpyObj('UserService', ['getUserByUserId']);
    mockUserService.getUserByUserId.and.returnValue(Observable.of(loggedInUser));
    mockUserService.loggedInUser = Observable.of(loggedInUser);
    mockNotificationsService = jasmine.createSpyObj<NotificationsService>('NotificationsService', ['message']);
    mockBroadcaster = createMock(Broadcaster);
    mockBroadcaster.on.and.returnValue(() => {
      return new Subject<BroadcastEvent>();
    });

    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [
        {
          provide: Router, useValue: mockRouter
        },
        {
          provide: Broadcaster, useFactory: () => mockBroadcaster
        },
        {
          provide: UserService, useValue: mockUserService
        },
        {
          provide: NotificationsService, useValue: mockNotificationsService
        },
        AnalyticService,
        Contexts,
        Spaces,
        Fabric8UIConfig
      ]
    });
    analyticService = TestBed.get(AnalyticService);
  });

  it('when writekey is not available, analytics should not be defined', () => {
    // call the init method to initialize the analytics object
    analyticService.init();
    const anaytics = analyticService.analytics;
    expect(anaytics).toBeUndefined();
  });

  describe('when write key is available,', () => {
    let analytics: any;

    beforeAll(() => {
      analyticService.fabric8UIConfig.analyticsWriteKey = 'some-key';
      spyOn(analyticService, 'track').and.returnValue(true);

      // call the init method to initialize the analytics object
      analyticService.init();
      analytics = analyticService.analytics;
    });

    it('analytics.initialize should be falsy', () => {
      expect(analytics.initialize).toBeFalsy();
    });

    it('analytics.invoked is truthy', () => {
      expect(analytics.invoked).toBeTruthy();
    });

    it('analytics object is defined', () => {
      expect(analytics).toBeDefined();
    });

    it('analytics object should have track method', () => {
      expect(analytics.methods).toBeDefined();
      expect(analytics.methods).toContain('track');
    });

    it('analytics object should have page method', () => {
      expect(analytics.methods).toContain('page');
    });

    it('analytics object should have identify method', () => {
      expect(analytics.methods).toContain('identify');
    });

  });

});
