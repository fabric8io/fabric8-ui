import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';

import { CollapseModule } from 'ngx-bootstrap/collapse';
import { Spaces } from 'ngx-fabric8-wit';
import { createMock } from 'testing/mock';
import { initContext, TestContext } from 'testing/test-context';
import { DeploymentsComponent } from './deployments.component';
import { DeploymentsService } from './services/deployments.service';

@Component({
  template: '<alm-apps></alm-apps>',
})
class HostComponent {}

describe('DeploymentsComponent', () => {
  let service: jasmine.SpyObj<DeploymentsService>;

  beforeEach(async(function(): void {
    service = createMock(DeploymentsService);
    service.getApplications.and.returnValue(of(['foo-app', 'bar-app']));
    service.getEnvironments.and.returnValue(of(['stage', 'prod']));
    service.ngOnDestroy.and.callThrough();
    TestBed.overrideProvider(DeploymentsService, { useValue: service });
  }));

  const testContext = initContext(DeploymentsComponent, HostComponent, {
    imports: [CollapseModule.forRoot()],
    providers: [
      {
        provide: Spaces,
        useValue: { current: of({ id: 'fake-spaceId' }) },
      },
    ],
    schemas: [NO_ERRORS_SCHEMA],
  });

  it('should set service result to applications property', function(done: DoneFn) {
    testContext.testedDirective.applications.subscribe((applications) => {
      expect(service.getApplications).toHaveBeenCalledWith('fake-spaceId');
      expect(applications).toEqual(['foo-app', 'bar-app']);
      done();
    });
  });

  it('should set service result to environments property', function(done: DoneFn) {
    testContext.testedDirective.environments.subscribe((environments) => {
      expect(service.getEnvironments).toHaveBeenCalledWith('fake-spaceId');
      expect(environments).toEqual(['stage', 'prod']);
      done();
    });
  });
});
