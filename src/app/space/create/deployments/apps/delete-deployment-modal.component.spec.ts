import { Component } from '@angular/core';

import { ModalDirective } from 'ngx-bootstrap';

import { createMock } from 'testing/mock';
import {
  initContext,
  TestContext
} from 'testing/test-context';

import { DeleteDeploymentModal } from './delete-deployment-modal.component';

@Component({
  template: '<delete-deployment-modal></delete-deployment-modal>'
})
class HostComponent { }

describe('DeleteDeploymentModal', (): void => {
  type TestingContext = TestContext<DeleteDeploymentModal, HostComponent>;

  initContext(DeleteDeploymentModal, HostComponent, {}, (modal: DeleteDeploymentModal): void => {
    const mockHost: jasmine.SpyObj<ModalDirective> = createMock(ModalDirective);
    modal.host = mockHost;
    mockHost.show.and.stub();
    mockHost.hide.and.stub();

    modal.applicationId = 'fooApplicationId';
    modal.environmentName = 'fooEnvironmentName';
  });

  it('should be instantiable', function(this: TestingContext): void {
    expect(this.testedDirective).toBeTruthy();
  });

  describe('#openModal', (): void => {
    it('should call host.show()', function(this: TestingContext): void {
      expect(this.testedDirective.host.show).not.toHaveBeenCalled();
      this.testedDirective.openModal();
      expect(this.testedDirective.host.show).toHaveBeenCalled();
    });
  });

  describe('#closeModal', (): void => {
    it('should call host.hide()', function(this: TestingContext): void {
      expect(this.testedDirective.host.hide).not.toHaveBeenCalled();
      this.testedDirective.closeModal();
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
      this.testedDirective.deleteEvent.first().subscribe((): void => done());
      this.testedDirective.confirmDeletion();
    });
  });

});
