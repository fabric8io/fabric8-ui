import { Component, Input } from '@angular/core';
import { TestBed, TestModuleMetadata } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { never, Observable, of } from 'rxjs';

import { createMock } from 'testing/mock';
import { MockFeatureToggleComponent } from 'testing/mock-feature-toggle.component';
import { initContext, TestContext } from 'testing/test-context';

import { User, UserService } from 'ngx-login-client';
import { LoadingWidgetComponent } from '../../dashboard-widgets/loading-widget/loading-widget.component';
import { LoadingWidgetModule } from '../../dashboard-widgets/loading-widget/loading-widget.module';
import { UserSpacesService } from '../../shared/user-spaces.service';
import { HomeDashboardComponent } from './home-dashboard.component';

@Component({
  template: '<alm-home-dashboard></alm-home-dashboard>',
})
class HostComponent {}

@Component({
  selector: 'fabric8-home-empty-state',
  template: '',
})
class MockEmptyState {}

@Component({
  selector: 'fabric8-recent-spaces-widget',
  template: '',
})
class MockRecentSpaces {
  @Input() cardSizeClass: string;
  @Input() cardBodySizeClass: string;
}

@Component({
  selector: 'fabric8-recent-workspaces-widget',
  template: '',
})
class MockRecentWorkspaces {}

@Component({
  selector: 'alm-work-item-widget',
  template: '',
})
class MockWorkItems {}

@Component({
  selector: 'fabric8-recent-pipelines-widget',
  template: '',
})
class MockRecentPipelines {}

const mockUser: User = {
  attributes: {
    username: 'foo-user',
  },
} as User;

function getModuleMetadata(countObservable: Observable<number>): TestModuleMetadata {
  const mockUserSpacesService: jasmine.SpyObj<UserSpacesService> = createMock(UserSpacesService);
  mockUserSpacesService.getInvolvedSpacesCount.and.returnValue(countObservable);

  beforeEach(
    (): void => {
      TestBed.overrideProvider(UserSpacesService, { useValue: mockUserSpacesService });
    },
  );

  return {
    declarations: [
      MockFeatureToggleComponent,
      MockEmptyState,
      MockRecentSpaces,
      MockRecentWorkspaces,
      MockWorkItems,
      MockRecentPipelines,
    ],
    imports: [LoadingWidgetModule],
    providers: [
      {
        provide: UserService,
        useFactory: (): UserService => ({ currentLoggedInUser: mockUser } as UserService),
      },
      {
        provide: UserSpacesService,
        useFactory: (): UserSpacesService => mockUserSpacesService,
      },
    ],
  };
}

describe('HomeDashboardComponent', (): void => {
  describe('no Spaces', (): void => {
    const testContext: TestContext<HomeDashboardComponent, HostComponent> = initContext(
      HomeDashboardComponent,
      HostComponent,
      getModuleMetadata(of(0)),
    );

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
    const testContext: TestContext<HomeDashboardComponent, HostComponent> = initContext(
      HomeDashboardComponent,
      HostComponent,
      getModuleMetadata(never()),
    );

    it('should correctly assign logged in user', (): void => {
      expect(testContext.testedDirective.loggedInUser).toBe(mockUser);
    });

    it('should request user spaces', (): void => {
      expect(TestBed.get(UserSpacesService).getInvolvedSpacesCount).toHaveBeenCalled();
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
    const testContext: TestContext<HomeDashboardComponent, HostComponent> = initContext(
      HomeDashboardComponent,
      HostComponent,
      getModuleMetadata(of(2)),
    );

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
