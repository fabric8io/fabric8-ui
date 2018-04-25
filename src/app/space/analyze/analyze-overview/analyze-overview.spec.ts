import { AnalyzeOverviewComponent } from './analyze-overview.component';

import {
  Component,
  DebugElement,
  Input
} from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Broadcaster } from 'ngx-base';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Context, Contexts, Space } from 'ngx-fabric8-wit';
import { AuthenticationService, User, UserService } from 'ngx-login-client';
import { ConnectableObservable, Subscription } from 'rxjs';
import { Observable, Subject } from 'rxjs';
import { createMock } from 'testing/mock';
import {
  initContext,
  TestContext
} from 'testing/test-context';

@Component({
  template: '<alm-analyzeOverview></alm-analyzeOverview>'
})
class HostComponent { }

@Component({
  selector: 'fabric8-edit-space-description-widget',
  template: ''
})
class FakeFabric8EditSpaceDescriptionWidget {
}

@Component({
  selector: 'fabric8-work-item-widget',
  template: ''
})
class FakeFabric8WorkItemWidget {
}

@Component({
  selector: 'fabric8-pipelines-widget',
  template: ''
})
class FakeFabric8PipelinesWidget {
}

@Component({
  selector: 'fabric8-add-codebase-widget',
  template: ''
})
class FakeFabric8AddCodebaseWidget {
}

@Component({
  selector: 'fabric8-analytical-report-widget',
  template: ''
})
class FakeFabric8AnalyticalReportWidget {
}

@Component({
  selector: 'fabric8-create-work-item-widget',
  template: ''
})
class FakeFabric8CreateWorkItemWidget {
}

@Component({
  selector: 'fabric8-environment-widget',
  template: ''
})
class FakeFabric8EnvironmentWidget {
}

@Component({
  selector: 'f8-feature-toggle',
  template: ''
})
class FakeFabric8FeatureToggle {
}

@Component({
  selector: 'flow-selector',
  template: ''
})
class FlowSelector {
  @Input() space: Space;
}

@Component({
  selector: 'import-wizard',
  template: ''
})
class ImportWizard {
}

@Component({
  selector: 'quickstart-wizard',
  template: ''
})
class QuickstartWizard {
}

describe('AnalyzeOverviewComponent', () => {
  type ctx = TestContext<AnalyzeOverviewComponent, HostComponent>;

  let modalService: jasmine.SpyObj<BsModalService>;
  let broadcaster: jasmine.SpyObj<Broadcaster>;
  let authentication: jasmine.SpyObj<AuthenticationService>;
  let ctxSubj: Subject<Context>;

  let authenticationServiceMock = (): jasmine.SpyObj<AuthenticationService> => {
    authentication.isLoggedIn = function() { return true; } as (() => boolean) & jasmine.Spy;
    return authentication;
  };

  let contextsMock = (): jasmine.SpyObj<Contexts> => {
    const contexts: jasmine.SpyObj<Contexts> = createMock(Contexts);

    ctxSubj = new Subject<Context>();
    contexts.current = ctxSubj as Subject<Context> & jasmine.Spy;

    return contexts;
  };

  let userServiceMock = () => {
    const userService: jasmine.SpyObj<UserService> = createMock(UserService);
    userService.loggedInUser = Observable.of({
      id: 'loggedInUser'
    } as User).publish() as ConnectableObservable<User> & jasmine.Spy;

    return userService;
  };

  beforeEach(() => {
    modalService = createMock(BsModalService);
    broadcaster = createMock(Broadcaster);
    authentication = createMock(AuthenticationService);
  });

  initContext(AnalyzeOverviewComponent, HostComponent, {
    imports: [],
    declarations: [
      FakeFabric8EditSpaceDescriptionWidget,
      FakeFabric8WorkItemWidget,
      FakeFabric8PipelinesWidget,
      FakeFabric8AnalyticalReportWidget,
      FakeFabric8AddCodebaseWidget,
      FakeFabric8CreateWorkItemWidget,
      FakeFabric8EnvironmentWidget,
      FakeFabric8FeatureToggle,
      FlowSelector,
      ImportWizard,
      QuickstartWizard
    ],
    providers: [
      { provide: BsModalService, useFactory: (): jasmine.SpyObj<BsModalService> => modalService },
      { provide: Broadcaster, useFactory: () => broadcaster },
      { provide: AuthenticationService, useFactory: authenticationServiceMock },
      { provide: Contexts, useFactory: contextsMock },
      { provide: UserService, useFactory: userServiceMock }
    ]
  });

  it('should call to check the user space', function(this: ctx) {
    spyOn(this.testedDirective, 'isInOtherUsersSpace');

    ctxSubj.next({
      space: {
        relationships: {
          'owned-by': {
            data: {
              id: 'loggedInUser'
            }
          }
        }
      } as Space
    } as Context);

    this.detectChanges();
    expect(this.testedDirective.isInOtherUsersSpace).toHaveBeenCalled();
  });

  it('should recognize that the user owns the space', function(this: ctx) {
    const contexts: jasmine.SpyObj<Contexts> = TestBed.get(Contexts);
    const userService: jasmine.SpyObj<UserService> = TestBed.get(UserService);

    ctxSubj.next({
      space: {
        relationships: {
          'owned-by': {
            data: {
              id: 'loggedInUser'
            }
          }
        }
      } as Space
    } as Context);

    userService.loggedInUser.connect();
    this.detectChanges();

    expect(this.testedDirective.isInOtherUsersSpace()).toBe(false);
  });

  it('should recognize that the user does not own the space', function(this: ctx) {
    const contexts: jasmine.SpyObj<Contexts> = TestBed.get(Contexts);
    const userService: jasmine.SpyObj<UserService> = TestBed.get(UserService);

    ctxSubj.next({
      space: {
        relationships: {
          'owned-by': {
            data: {
              id: 'someOtherUser'
            }
          }
        }
      } as Space
    } as Context);

    userService.loggedInUser.connect();
    this.detectChanges();

    expect(this.testedDirective.isInOtherUsersSpace()).toBe(true);
  });
});
