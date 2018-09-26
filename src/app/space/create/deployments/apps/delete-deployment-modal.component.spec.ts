import { Component } from '@angular/core';
import {
  ModalDirective,
  ModalModule
} from 'ngx-bootstrap/modal';
import { first } from 'rxjs/operators';
import { createMock } from 'testing/mock';
import {
  initContext,
  TestContext
} from 'testing/test-context';
import { DeleteDeploymentModal } from './delete-deployment-modal.component';

@Component({
  template: `<delete-deployment-modal
    [applicationId]="'fooApplicationId'"
    [environmentName]="'fooEnvironmentName'"
  ></delete-deployment-modal>`
})
class HostComponent { }

describe('DeleteDeploymentModal', (): void => {
  type TestingContext = TestContext<DeleteDeploymentModal, HostComponent>;

  const testContext = initContext(DeleteDeploymentModal, HostComponent, {
    imports: [ModalModule.forRoot()]
  });

  beforeEach(function(): void {
    spyOn(testContext.testedDirective.host, 'show');
    spyOn(testContext.testedDirective.host, 'hide');
  });

  it('should be instantiable', function(): void {
    expect(testContext.testedDirective).toBeTruthy();
  });

  describe('#show', (): void => {
    it('should call host.show()', function(): void {
      expect(testContext.testedDirective.host.show).not.toHaveBeenCalled();
      testContext.testedDirective.show();
      expect(testContext.testedDirective.host.show).toHaveBeenCalled();
    });
  });

  describe('#hide', (): void => {
    it('should call host.hide()', function(): void {
      expect(testContext.testedDirective.host.hide).not.toHaveBeenCalled();
      testContext.testedDirective.hide();
      expect(testContext.testedDirective.host.hide).toHaveBeenCalled();
    });
  });

  describe('#confirmDeletion', (): void => {
    it('should call host.hide()', function(): void {
      expect(testContext.testedDirective.host.hide).not.toHaveBeenCalled();
      testContext.testedDirective.confirmDeletion();
      expect(testContext.testedDirective.host.hide).toHaveBeenCalled();
    });

    it('should emit deleteEvent', function(done: DoneFn): void {
      testContext.testedDirective.deleteEvent.pipe(first()).subscribe((): void => done());
      testContext.testedDirective.confirmDeletion();
    });
  });

});
