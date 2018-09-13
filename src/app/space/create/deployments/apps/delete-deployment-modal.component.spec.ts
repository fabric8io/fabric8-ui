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

  initContext(DeleteDeploymentModal, HostComponent, {
    imports: [ModalModule.forRoot()]
  });

  beforeEach(function(this: TestingContext): void {
    spyOn(this.testedDirective.host, 'show');
    spyOn(this.testedDirective.host, 'hide');
  });

  it('should be instantiable', function(this: TestingContext): void {
    expect(this.testedDirective).toBeTruthy();
  });

  describe('#show', (): void => {
    it('should call host.show()', function(this: TestingContext): void {
      expect(this.testedDirective.host.show).not.toHaveBeenCalled();
      this.testedDirective.show();
      expect(this.testedDirective.host.show).toHaveBeenCalled();
    });
  });

  describe('#hide', (): void => {
    it('should call host.hide()', function(this: TestingContext): void {
      expect(this.testedDirective.host.hide).not.toHaveBeenCalled();
      this.testedDirective.hide();
      expect(this.testedDirective.host.hide).toHaveBeenCalled();
    });
  });

  describe('#confirmDeletion', (): void => {
    it('should call host.hide()', function(this: TestingContext): void {
      expect(this.testedDirective.host.hide).not.toHaveBeenCalled();
      this.testedDirective.confirmDeletion();
      expect(this.testedDirective.host.hide).toHaveBeenCalled();
    });

    it('should emit deleteEvent', function(this: TestingContext, done: DoneFn): void {
      this.testedDirective.deleteEvent.pipe(first()).subscribe((): void => done());
      this.testedDirective.confirmDeletion();
    });
  });

});
