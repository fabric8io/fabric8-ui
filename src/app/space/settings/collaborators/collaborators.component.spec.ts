import {
  Component,
  ErrorHandler,
  NO_ERRORS_SCHEMA
} from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { createMock } from 'testing/mock';
import {
  initContext,
  TestContext
} from 'testing/test-context';

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
} from 'rxjs';

import { ContextService } from '../../../shared/context.service';
import { CollaboratorsComponent } from './collaborators.component';

@Component({
  template: `<alm-collaborators></alm-collaborators>`
})
class HostComponent { }

describe('CollaboratorsComponent', () => {
  type Ctx = TestContext<CollaboratorsComponent, HostComponent>;

  initContext(CollaboratorsComponent, HostComponent, {
    imports: [
      BsDropdownModule.forRoot(),
      Fabric8WitModule,
      ModalModule.forRoot()
    ],
    providers: [
      {
        provide: ContextService, useValue: ({
          current: Observable.of({
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

  it('should be instantiable', function(this: Ctx): void {
    expect(this.testedDirective).toBeTruthy();
  });

  it('should assign context', function(this: Ctx, done: DoneFn): void {
    TestBed.get(ContextService).current.subscribe((context: Context): void => {
      expect(this.testedDirective.context).toEqual(context);
      done();
    });
  });

  describe('#initCollaborators', () => {
    it('should retrieve, sort, and set initial list of collaborators', function(this: Ctx): void {
      const collaboratorService: jasmine.SpyObj<CollaboratorService> = TestBed.get(CollaboratorService);
      collaboratorService.getInitialBySpaceId.and.returnValue(Observable.of([
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
      expect(this.testedDirective.collaborators).toEqual([]);

      this.testedDirective.initCollaborators({ pageSize: 123 });

      expect(collaboratorService.getInitialBySpaceId).toHaveBeenCalledWith('fake-space-id', 20);
      expect(this.testedDirective.collaborators).toEqual([
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

    it('should handle errors', function(this: Ctx) {
      const collaboratorService: jasmine.SpyObj<CollaboratorService> = TestBed.get(CollaboratorService);
      collaboratorService.getInitialBySpaceId.and.returnValue(Observable.throw('some_error'));

      const errorHandler: jasmine.SpyObj<ErrorHandler> = TestBed.get(ErrorHandler);
      errorHandler.handleError.and.stub();

      const logger: jasmine.SpyObj<Logger> = TestBed.get(Logger);
      logger.error.and.stub();

      this.testedDirective.initCollaborators({});

      expect(collaboratorService.getInitialBySpaceId).toHaveBeenCalled();
      expect(this.testedDirective.collaborators).toEqual([]);
      expect(errorHandler.handleError).toHaveBeenCalledWith('some_error');
      expect(logger.error).toHaveBeenCalledWith('some_error');
    });
  });

  describe('#fetchMoreCollaborators', () => {
    it('should add and sort additional collaborators', function(this: Ctx) {
      const collaboratorService: jasmine.SpyObj<CollaboratorService> = TestBed.get(CollaboratorService);
      collaboratorService.getNextCollaborators.and.returnValue(Observable.of([
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
      expect(this.testedDirective.collaborators).toEqual([]);

      this.testedDirective.collaborators = [
        {
          attributes: {
            username: 'userD'
          }
        }
      ] as User[];

      this.testedDirective.fetchMoreCollaborators({});

      expect(collaboratorService.getNextCollaborators).toHaveBeenCalled();
      expect(this.testedDirective.collaborators).toEqual([
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

    it('should handle errors', function(this: Ctx) {
      const collaboratorService: jasmine.SpyObj<CollaboratorService> = TestBed.get(CollaboratorService);
      collaboratorService.getNextCollaborators.and.returnValue(Observable.throw('some_error'));

      const errorHandler: jasmine.SpyObj<ErrorHandler> = TestBed.get(ErrorHandler);
      errorHandler.handleError.and.stub();

      const logger: jasmine.SpyObj<Logger> = TestBed.get(Logger);
      logger.error.and.stub();

      this.testedDirective.fetchMoreCollaborators({});

      expect(collaboratorService.getNextCollaborators).toHaveBeenCalled();
      expect(this.testedDirective.collaborators).toEqual([]);
      expect(errorHandler.handleError).toHaveBeenCalledWith('some_error');
      expect(logger.error).toHaveBeenCalledWith('some_error');
    });
  });

  describe('#addCollaboratorsToParent', () => {
    it('should add and sort new collaborators', function(this: Ctx) {
      expect(this.testedDirective.collaborators).toEqual([]);

      this.testedDirective.collaborators = [
        {
          id: '1',
          attributes: {
            username: 'userA'
          }
        }
      ] as User[];

      this.testedDirective.addCollaboratorsToParent([
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

      expect(this.testedDirective.collaborators).toEqual([
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
    it('should send remove request to service', function(this: Ctx) {
      const collaboratorService: jasmine.SpyObj<CollaboratorService> = TestBed.get(CollaboratorService);
      collaboratorService.removeCollaborator.and.returnValue(Observable.of('unused'));

      spyOn(this.testedDirective.modalDelete, 'show');
      spyOn(this.testedDirective.modalDelete, 'hide');

      expect(this.testedDirective.modalDelete.show).not.toHaveBeenCalled();
      this.testedDirective.confirmUserRemove({
        id: '1',
        attributes: {
          username: 'userA'
        }
      } as User);
      expect(this.testedDirective.modalDelete.show).toHaveBeenCalled();

      expect(this.testedDirective.modalDelete.hide).not.toHaveBeenCalled();
      this.testedDirective.removeUser();
      expect(this.testedDirective.modalDelete.hide).toHaveBeenCalled();
      expect(collaboratorService.removeCollaborator).toHaveBeenCalledWith('fake-space-id', '1');
    });

    it('should handle errors', function(this: Ctx) {
      const collaboratorService: jasmine.SpyObj<CollaboratorService> = TestBed.get(CollaboratorService);
      collaboratorService.removeCollaborator.and.returnValue(Observable.throw('some_error'));

      const errorHandler: jasmine.SpyObj<ErrorHandler> = TestBed.get(ErrorHandler);
      errorHandler.handleError.and.stub();

      const logger: jasmine.SpyObj<Logger> = TestBed.get(Logger);
      logger.error.and.stub();

      this.testedDirective.confirmUserRemove({
        id: '1',
        attributes: {
          username: 'userA'
        }
      } as User);
      this.testedDirective.removeUser();

      expect(collaboratorService.removeCollaborator).toHaveBeenCalled();
      expect(errorHandler.handleError).toHaveBeenCalledWith('some_error');
      expect(logger.error).toHaveBeenCalledWith('some_error');
    });
  });

});
