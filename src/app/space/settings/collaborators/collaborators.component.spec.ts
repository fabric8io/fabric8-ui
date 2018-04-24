import {
  Component,
  NO_ERRORS_SCHEMA
} from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { createMock } from 'testing/mock';
import {
  initContext,
  TestContext
} from 'testing/test-context';

import { ContextService } from 'app/shared/context.service';
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
  Subject
} from 'rxjs';

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
      { provide: CollaboratorService, useValue: createMock(CollaboratorService) }
    ],
    schemas: [ NO_ERRORS_SCHEMA ]
  });

  it('should be instantiable', function(this: Ctx): void {
    expect(this.testedDirective).toBeTruthy();
  });

  it('should assign context', function(this: Ctx): void {
    TestBed.get(ContextService).current.subscribe((context: Context): void => {
      expect(this.testedDirective.context).toEqual(context);
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

});
