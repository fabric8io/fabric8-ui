import {
  Component,
  Input
} from '@angular/core';
import {
  TestBed,
  TestModuleMetadata
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  never,
  Observable,
  of
} from 'rxjs';

import { createMock } from 'testing/mock';
import { MockFeatureToggleComponent } from 'testing/mock-feature-toggle.component';
import { initContext, TestContext } from 'testing/test-context';

import {
  Space,
  SpaceService
} from 'ngx-fabric8-wit';
import {
  User,
  UserService
} from 'ngx-login-client';
import { LoadingWidgetComponent } from '../dashboard-widgets/loading-widget/loading-widget.component';
import { LoadingWidgetModule } from '../dashboard-widgets/loading-widget/loading-widget.module';
import { HomeComponent } from './home.component';

@Component({
  template: '<alm-home></alm-home>'
})
class HostComponent { }

@Component({
  selector: 'fabric8-home-empty-state',
  template: ''
})
class MockEmptyState { }

@Component({
  selector: 'fabric8-recent-spaces-widget',
  template: ''
})
class MockRecentSpaces {
  @Input() cardSizeClass: string;
  @Input() cardBodySizeClass: string;
}

@Component({
  selector: 'fabric8-recent-workspaces-widget',
  template: ''
})
class MockRecentWorkspaces { }

@Component({
  selector: 'alm-work-item-widget',
  template: ''
})
class MockWorkItems { }

@Component({
  selector: 'fabric8-recent-pipelines-widget',
  template: ''
})
class MockRecentPipelines { }

const mockUser: User = {
  attributes: {
    username: 'foo-user'
  }
} as User;

function getModuleMetadata(spacesObservable: Observable<Space[]>): TestModuleMetadata {
  return {
    declarations: [
      MockFeatureToggleComponent,
      MockEmptyState,
      MockRecentSpaces,
      MockRecentWorkspaces,
      MockWorkItems,
      MockRecentPipelines
    ],
    imports: [
      LoadingWidgetModule
    ],
    providers: [
      {
        provide: UserService,
        useFactory: (): UserService => ({ currentLoggedInUser: mockUser } as UserService)
      },
      {
        provide: SpaceService,
        useFactory: (): SpaceService => {
          const svc: jasmine.SpyObj<SpaceService> = createMock(SpaceService);
          svc.getSpacesByUser.and.returnValue(spacesObservable);
          return svc;
        }
      }
    ]
  };
}

describe('HomeComponent', (): void => {

  describe('no Spaces', (): void => {
    const testContext: TestContext<HomeComponent, HostComponent> = initContext(HomeComponent, HostComponent, getModuleMetadata(of([])));

    it('should count 0 spaces', (): void => {
      expect(testContext.testedDirective.spacesCount).toEqual(0);
    });

    it('should only display empty state component', (): void => {
      expect(testContext.tested.queryAll(By.directive(MockEmptyState)).length).toEqual(1);

      expect(testContext.tested.queryAll(By.directive(LoadingWidgetComponent)).length).toEqual(0);
      expect(testContext.tested.queryAll(By.directive(MockRecentPipelines)).length).toEqual(0);
      expect(testContext.tested.queryAll(By.directive(MockRecentSpaces)).length).toEqual(0);
      expect(testContext.tested.queryAll(By.directive(MockRecentWorkspaces)).length).toEqual(0);
      expect(testContext.tested.queryAll(By.directive(MockWorkItems)).length).toEqual(0);
    });
  });

  describe('while loading', (): void => {
    const testContext: TestContext<HomeComponent, HostComponent> = initContext(HomeComponent, HostComponent, getModuleMetadata(never()));

    it('should correctly assign logged in user', (): void => {
      expect(testContext.testedDirective.loggedInUser).toBe(mockUser);
    });

    it('should request user spaces', (): void => {
      expect(TestBed.get(SpaceService).getSpacesByUser).toHaveBeenCalledWith(mockUser.attributes.username);
    });

    it('should default to -1 spaces', (): void => {
      expect(testContext.testedDirective.spacesCount).toEqual(-1);
    });

    it('should only display loading widget', (): void => {
      expect(testContext.tested.queryAll(By.directive(LoadingWidgetComponent)).length).toEqual(1);

      expect(testContext.tested.queryAll(By.directive(MockEmptyState)).length).toEqual(0);
      expect(testContext.tested.queryAll(By.directive(MockRecentPipelines)).length).toEqual(0);
      expect(testContext.tested.queryAll(By.directive(MockRecentPipelines)).length).toEqual(0);
      expect(testContext.tested.queryAll(By.directive(MockRecentWorkspaces)).length).toEqual(0);
      expect(testContext.tested.queryAll(By.directive(MockWorkItems)).length).toEqual(0);
    });
  });

  describe('with Spaces', (): void => {
    const spaces: Space[] = [
      {
        name: 'foo-space'
      },
      {
        name: 'bar-space'
      }
    ] as Space[];
    const testContext: TestContext<HomeComponent, HostComponent> = initContext(HomeComponent, HostComponent, getModuleMetadata(of(spaces)));

    it('should count 2 spaces', (): void => {
      expect(testContext.testedDirective.spacesCount).toEqual(2);
    });

    it('should display home widgets', (): void => {
      expect(testContext.tested.queryAll(By.directive(MockRecentSpaces)).length).toEqual(1);
      expect(testContext.tested.queryAll(By.directive(MockRecentWorkspaces)).length).toEqual(1);
      expect(testContext.tested.queryAll(By.directive(MockWorkItems)).length).toEqual(1);

      expect(testContext.tested.queryAll(By.directive(MockEmptyState)).length).toEqual(0);
      expect(testContext.tested.queryAll(By.directive(LoadingWidgetComponent)).length).toEqual(0);
      expect(testContext.tested.queryAll(By.directive(MockRecentPipelines)).length).toEqual(0);
    });
  });

});
