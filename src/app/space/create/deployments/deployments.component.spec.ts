import {
  Component,
  NO_ERRORS_SCHEMA
} from '@angular/core';
import {
  async,
  TestBed
} from '@angular/core/testing';

import { CollapseModule } from 'ngx-bootstrap/collapse';
import { Spaces } from 'ngx-fabric8-wit';
import { Observable } from 'rxjs';
import { of } from 'rxjs/observable/of';

import { createMock } from 'testing/mock';
import {
  initContext,
  TestContext
} from 'testing/test-context';

import { DeploymentsComponent } from './deployments.component';
import { DeploymentsService } from './services/deployments.service';

@Component({
  template: '<alm-apps></alm-apps>'
})
class HostComponent { }

describe('DeploymentsComponent', () => {
  type Context = TestContext<DeploymentsComponent, HostComponent> & {
    service: jasmine.SpyObj<DeploymentsService>;
  };

  beforeEach(async(function(this: Context): void {
    this.service = createMock(DeploymentsService);
    this.service.getApplications.and.returnValue(of(['foo-app', 'bar-app']));
    this.service.getEnvironments.and.returnValue(of(['stage', 'prod']));
    this.service.ngOnDestroy.and.callThrough();
    TestBed.overrideProvider(DeploymentsService, { useValue: this.service });
  }));

  initContext(DeploymentsComponent, HostComponent, {
    imports: [CollapseModule.forRoot()],
    providers: [
      {
        provide: Spaces, useValue: (
          { current: of({ id: 'fake-spaceId' }) }
        )
      }
    ],
    schemas: [NO_ERRORS_SCHEMA]
  });

  it('should set service result to applications property', function(this: Context, done: DoneFn) {
    this.testedDirective.applications.subscribe(applications => {
      expect(this.service.getApplications).toHaveBeenCalledWith('fake-spaceId');
      expect(applications).toEqual(['foo-app', 'bar-app']);
      done();
    });
  });

  it('should set service result to environments property', function(this: Context, done: DoneFn) {
    this.testedDirective.environments.subscribe(environments => {
      expect(this.service.getEnvironments).toHaveBeenCalledWith('fake-spaceId');
      expect(environments).toEqual(['stage', 'prod']);
      done();
    });
  });

});
