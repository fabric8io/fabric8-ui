import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';
import { Area, AreaService } from 'ngx-fabric8-wit';
import { Observable } from 'rxjs/Observable';
import { initContext, TestContext } from 'testing/test-context';
import { CreateAreaDialogComponent } from './create-area-dialog.component';

@Component({
  template: '<create-area-dialog></create-area-dialog>'
})
class HostComponent {}

describe('CreateAreaDialogComponent', () => {
  type Context = TestContext<CreateAreaDialogComponent, HostComponent>;
  let mockAreaService: jasmine.SpyObj<AreaService> = jasmine.createSpyObj('AreaService', ['create']);
  mockAreaService.create.and.returnValue(Observable.of({
    id: 'mock-id',
    attributes: {
      name: 'mock-name'
    }
  } as Area));

  initContext(CreateAreaDialogComponent, HostComponent, {
    declarations: [NgForm, NgModel],
    providers: [
      { provide: AreaService, useValue: mockAreaService}
    ],
    schemas: [NO_ERRORS_SCHEMA]
  });

  describe('#validateAreaName', () => {
    it('should reset the current error states when called', function(this: Context) {
      spyOn(this.testedDirective, 'resetErrors');
      this.testedDirective.name = 'mock-name';
      this.testedDirective.validateAreaName();
      expect(this.testedDirective.resetErrors).toHaveBeenCalled();
    });

    it('should not set any error booleans to true if the name is valid', function(this: Context) {
      spyOn(this.testedDirective, 'handleError');
      this.testedDirective.host = jasmine.createSpyObj('ModalDirective', ['hide']);
      this.testedDirective.name = 'mock-name';
      this.testedDirective.validateAreaName();
      this.testedDirective.createArea();
      expect(this.testedDirective.errors.uniqueValidationFailure).toBeFalsy();
      expect(this.testedDirective.errors.exceedLengthFailure).toBeFalsy();
      expect(this.testedDirective.errors.emptyNameFailure).toBeFalsy();
      expect(this.testedDirective.handleError).toHaveBeenCalledTimes(0);
    });

    it('should set the emptyNameFailure to true if the name is an empty string', function(this: Context) {
      this.testedDirective.name = ' ';
      this.testedDirective.validateAreaName();
      expect(this.testedDirective.errors.uniqueValidationFailure).toBeFalsy();
      expect(this.testedDirective.errors.exceedLengthFailure).toBeFalsy();
      expect(this.testedDirective.errors.emptyNameFailure).toBeTruthy();
    });

    it('should set the exceedLengthFailure to true if the name is longer than 63 chars', function(this: Context) {
      this.testedDirective.name = 'thisisanareanamethatisprettylongitsactuallymorethan63characters!';
      this.testedDirective.validateAreaName();
      expect(this.testedDirective.errors.emptyNameFailure).toBeFalsy();
      expect(this.testedDirective.errors.uniqueValidationFailure).toBeFalsy();
      expect(this.testedDirective.errors.exceedLengthFailure).toBeTruthy();
    });
  });

  describe('#handleError', () => {
    it('should set the uniqueValidationFailure to true if a 409 error is recorded', function(this: Context) {
      let error: any = {
        errors: [{
          status: '409'
        }]
      };
      this.testedDirective.handleError(error);
      expect(this.testedDirective.errors.uniqueValidationFailure).toBeTruthy();
      expect(this.testedDirective.errors.exceedLengthFailure).toBeFalsy();
      expect(this.testedDirective.errors.emptyNameFailure).toBeFalsy();
    });

    it('should set the uniqueValidationFailure to false if there are no errors', function(this: Context) {
      let error: any = {
        errors: []
      };
      this.testedDirective.handleError(error);
      expect(this.testedDirective.errors.uniqueValidationFailure).toBeFalsy();
      expect(this.testedDirective.errors.exceedLengthFailure).toBeFalsy();
      expect(this.testedDirective.errors.emptyNameFailure).toBeFalsy();
    });
  });

});
