import {
  Component,
  ErrorHandler,
  NO_ERRORS_SCHEMA
} from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Logger } from 'ngx-base';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import {
  CollaboratorService,
  Context,
  Fabric8WitModule
} from 'ngx-fabric8-wit';
import { User } from 'ngx-login-client';
import {
  Observable,
  of as observableOf,
  throwError as observableThrowError
} from 'rxjs';
import { createMock } from 'testing/mock';
import {
  initContext,
  TestContext
} from 'testing/test-context';
import { ContextService } from '../../../shared/context.service';
import { CollaboratorsComponent } from './collaborators.component';

@Component({
  template: `<alm-collaborators></alm-collaborators>`
})
class HostComponent { }

describe('CollaboratorsComponent', () => {

  const testContext = initContext(CollaboratorsComponent, HostComponent, {
    imports: [
      BsDropdownModule.forRoot(),
      Fabric8WitModule,
      ModalModule.forRoot()
    ],
    providers: [
      {
        provide: ContextService, useValue: ({
          current: observableOf({
            space: {
              id: 'fake-space-id',
              attributes: {
                name: 'fake-space'
              }
            }
          })
        })
      },
      {
        provide: CollaboratorService,
        useFactory: (): jasmine.SpyObj<CollaboratorService> => {
          const collaboratorService: jasmine.SpyObj<CollaboratorService> = createMock(CollaboratorService);
          return collaboratorService;
        }
      },
      { provide: ErrorHandler, useValue: createMock(ErrorHandler) },
      { provide: Logger, useValue: createMock(Logger) }
    ],
    schemas: [ NO_ERRORS_SCHEMA ]
  });

  it('should be instantiable', function(): void {
    expect(testContext.testedDirective).toBeTruthy();
  });

  it('should assign context', function(done: DoneFn): void {
    TestBed.get(ContextService).current.subscribe((context: Context): void => {
      expect(testContext.testedDirective.context).toEqual(context);
      done();
    });
  });

  describe('#initCollaborators', () => {
    it('should retrieve, sort, and set initial list of collaborators', function(): void {
      const collaboratorService: jasmine.SpyObj<CollaboratorService> = TestBed.get(CollaboratorService);
      collaboratorService.getInitialBySpaceId.and.returnValue(observableOf([
        {
          attributes: {
            username: 'userA'
          }
        },
        {
          attributes: {
            username: 'userC'
          }
        },
        {
          attributes: {
            username: 'userB'
          }
        }
      ]));

      expect(collaboratorService.getInitialBySpaceId).not.toHaveBeenCalled();
      expect(testContext.testedDirective.collaborators).toEqual([]);

      testContext.testedDirective.initCollaborators({ pageSize: 123 });

      expect(collaboratorService.getInitialBySpaceId).toHaveBeenCalledWith('fake-space-id', 20);
      expect(testContext.testedDirective.collaborators).toEqual([
        {
          attributes: {
            username: 'userA'
          }
        },
        {
          attributes: {
            username: 'userB'
          }
        },
        {
          attributes: {
            username: 'userC'
          }
        }
      ] as any[]);
    });

    it('should handle errors', function() {
      const collaboratorService: jasmine.SpyObj<CollaboratorService> = TestBed.get(CollaboratorService);
      collaboratorService.getInitialBySpaceId.and.returnValue(observableThrowError('some_error'));

      const errorHandler: jasmine.SpyObj<ErrorHandler> = TestBed.get(ErrorHandler);
      errorHandler.handleError.and.stub();

      const logger: jasmine.SpyObj<Logger> = TestBed.get(Logger);
      logger.error.and.stub();

      testContext.testedDirective.initCollaborators({});

      expect(collaboratorService.getInitialBySpaceId).toHaveBeenCalled();
      expect(testContext.testedDirective.collaborators).toEqual([]);
      expect(errorHandler.handleError).toHaveBeenCalledWith('some_error');
      expect(logger.error).toHaveBeenCalledWith('some_error');
    });
  });

  describe('#fetchMoreCollaborators', () => {
    it('should add and sort additional collaborators', function() {
      const collaboratorService: jasmine.SpyObj<CollaboratorService> = TestBed.get(CollaboratorService);
      collaboratorService.getNextCollaborators.and.returnValue(observableOf([
        {
          attributes: {
            username: 'userC'
          }
        },
        {
          attributes: {
            username: 'userA'
          }
        },
        {
          attributes: {
            username: 'userB'
          }
        }
      ]));

      expect(collaboratorService.getNextCollaborators).not.toHaveBeenCalled();
      expect(testContext.testedDirective.collaborators).toEqual([]);

      testContext.testedDirective.collaborators = [
        {
          attributes: {
            username: 'userD'
          }
        }
      ] as User[];

      testContext.testedDirective.fetchMoreCollaborators({});

      expect(collaboratorService.getNextCollaborators).toHaveBeenCalled();
      expect(testContext.testedDirective.collaborators).toEqual([
        {
          attributes: {
            username: 'userA'
          }
        },
        {
          attributes: {
            username: 'userB'
          }
        },
        {
          attributes: {
            username: 'userC'
          }
        },
        {
          attributes: {
            username: 'userD'
          }
        }
      ] as any[]);
    });

    it('should handle errors', function() {
      const collaboratorService: jasmine.SpyObj<CollaboratorService> = TestBed.get(CollaboratorService);
      collaboratorService.getNextCollaborators.and.returnValue(observableThrowError('some_error'));

      const errorHandler: jasmine.SpyObj<ErrorHandler> = TestBed.get(ErrorHandler);
      errorHandler.handleError.and.stub();

      const logger: jasmine.SpyObj<Logger> = TestBed.get(Logger);
      logger.error.and.stub();

      testContext.testedDirective.fetchMoreCollaborators({});

      expect(collaboratorService.getNextCollaborators).toHaveBeenCalled();
      expect(testContext.testedDirective.collaborators).toEqual([]);
      expect(errorHandler.handleError).toHaveBeenCalledWith('some_error');
      expect(logger.error).toHaveBeenCalledWith('some_error');
    });
  });

  describe('#addCollaboratorsToParent', () => {
    it('should add and sort new collaborators', function() {
      expect(testContext.testedDirective.collaborators).toEqual([]);

      testContext.testedDirective.collaborators = [
        {
          id: '1',
          attributes: {
            username: 'userA'
          }
        }
      ] as User[];

      testContext.testedDirective.addCollaboratorsToParent([
        {
          id: '3',
          attributes: {
            username: 'userC'
          }
        },
        {
          id: '2',
          attributes: {
            username: 'userB'
          }
        }
      ] as User[]);

      expect(testContext.testedDirective.collaborators).toEqual([
        {
          id: '1',
          attributes: {
            username: 'userA'
          }
        },
        {
          id: '2',
          attributes: {
            username: 'userB'
          }
        },
        {
          id: '3',
          attributes: {
            username: 'userC'
          }
        }
      ] as any[]);
    });
  });

  describe('removeUser', () => {
    it('should send remove request to service', function() {
      const collaboratorService: jasmine.SpyObj<CollaboratorService> = TestBed.get(CollaboratorService);
      collaboratorService.removeCollaborator.and.returnValue(observableOf('unused'));

      spyOn(testContext.testedDirective.modalDelete, 'show');
      spyOn(testContext.testedDirective.modalDelete, 'hide');

      expect(testContext.testedDirective.modalDelete.show).not.toHaveBeenCalled();
      testContext.testedDirective.confirmUserRemove({
        id: '1',
        attributes: {
          username: 'userA'
        }
      } as User);
      expect(testContext.testedDirective.modalDelete.show).toHaveBeenCalled();

      expect(testContext.testedDirective.modalDelete.hide).not.toHaveBeenCalled();
      testContext.testedDirective.removeUser();
      expect(testContext.testedDirective.modalDelete.hide).toHaveBeenCalled();
      expect(collaboratorService.removeCollaborator).toHaveBeenCalledWith('fake-space-id', '1');
    });

    it('should handle errors', function() {
      const collaboratorService: jasmine.SpyObj<CollaboratorService> = TestBed.get(CollaboratorService);
      collaboratorService.removeCollaborator.and.returnValue(observableThrowError('some_error'));

      const errorHandler: jasmine.SpyObj<ErrorHandler> = TestBed.get(ErrorHandler);
      errorHandler.handleError.and.stub();

      const logger: jasmine.SpyObj<Logger> = TestBed.get(Logger);
      logger.error.and.stub();

      testContext.testedDirective.confirmUserRemove({
        id: '1',
        attributes: {
          username: 'userA'
        }
      } as User);
      testContext.testedDirective.removeUser();

      expect(collaboratorService.removeCollaborator).toHaveBeenCalled();
      expect(errorHandler.handleError).toHaveBeenCalledWith('some_error');
      expect(logger.error).toHaveBeenCalledWith('some_error');
    });
  });

});
