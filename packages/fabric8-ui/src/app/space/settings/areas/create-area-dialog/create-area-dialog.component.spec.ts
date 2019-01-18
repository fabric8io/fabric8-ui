import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Area, AreaService } from 'ngx-fabric8-wit';
import { Observable, of as observableOf } from 'rxjs';
import { initContext, TestContext } from 'testing/test-context';
import { AreaCreationStatus, CreateAreaDialogComponent } from './create-area-dialog.component';

@Component({
  template: '<create-area-dialog></create-area-dialog>',
})
class HostComponent {}

describe('CreateAreaDialogComponent', () => {
  let mockAreaService: jasmine.SpyObj<AreaService> = jasmine.createSpyObj('AreaService', [
    'create',
  ]);
  mockAreaService.create.and.returnValue(
    observableOf({
      id: 'mock-id',
      attributes: {
        name: 'mock-name',
      },
    } as Area),
  );

  const testContext = initContext(CreateAreaDialogComponent, HostComponent, {
    imports: [FormsModule],
    providers: [{ provide: AreaService, useValue: mockAreaService }],
    schemas: [NO_ERRORS_SCHEMA],
  });

  describe('#validateAreaName', () => {
    it('should reset the current error state when called', function() {
      spyOn(testContext.testedDirective, 'resetErrors');
      testContext.testedDirective.name = 'mock-name';
      testContext.testedDirective.validateAreaName();
      expect(testContext.testedDirective.resetErrors).toHaveBeenCalled();
    });

    it('should not set an error state if the name is valid', function() {
      spyOn(testContext.testedDirective, 'handleError');
      testContext.testedDirective.host = jasmine.createSpyObj('ModalDirective', ['hide']);
      testContext.testedDirective.name = 'mock-name';
      testContext.testedDirective.validateAreaName();
      testContext.testedDirective.createArea();
      expect(testContext.testedDirective.areaCreationStatus).toEqual(AreaCreationStatus.OK);
      expect(testContext.testedDirective.handleError).toHaveBeenCalledTimes(0);
    });

    it('should set the areaCreationStatus to EMPTY_NAME_FAILURE if the name is an empty string', function() {
      testContext.testedDirective.name = ' ';
      testContext.testedDirective.validateAreaName();
      expect(testContext.testedDirective.areaCreationStatus).toEqual(
        AreaCreationStatus.EMPTY_NAME_FAILURE,
      );
    });

    it('should set the areaCreationStatus to EXCEED_LENGTH_FAILURE if the name is longer than 63 chars', function() {
      testContext.testedDirective.name =
        'thisisanareanamethatisprettylongitsactuallymorethan63characters!';
      testContext.testedDirective.validateAreaName();
      expect(testContext.testedDirective.areaCreationStatus).toEqual(
        AreaCreationStatus.EXCEED_LENGTH_FAILURE,
      );
    });
  });

  describe('#handleError', () => {
    it('should set the areaCreationStatus to UNIQUE_VALIDATION_FAILURE if a 409 error is recorded', function() {
      let error: any = {
        errors: [
          {
            status: '409',
          },
        ],
      };
      testContext.testedDirective.handleError(error);
      expect(testContext.testedDirective.areaCreationStatus).toEqual(
        AreaCreationStatus.UNIQUE_VALIDATION_FAILURE,
      );
    });

    it('should set the areaCreationStatus to OK if there are no errors', function() {
      let error: any = {
        errors: [],
      };
      testContext.testedDirective.handleError(error);
      expect(testContext.testedDirective.areaCreationStatus).toEqual(AreaCreationStatus.OK);
    });
  });
});
