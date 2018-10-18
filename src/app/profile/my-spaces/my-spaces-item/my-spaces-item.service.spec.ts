import { TestBed } from '@angular/core/testing';
import {
  of,
  throwError
} from 'rxjs';

import {
  CollaboratorService,
  Space
} from 'ngx-fabric8-wit';
import { User } from 'ngx-login-client';
import { createMock } from 'testing/mock';

import { MySpacesItemService } from './my-spaces-item.service';

describe('MySpacesItemService', (): void => {

  let svc: MySpacesItemService;
  beforeEach((): void => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: CollaboratorService,
          useFactory: (): CollaboratorService => {
            const svc: jasmine.SpyObj<CollaboratorService> = createMock(CollaboratorService);
            svc.getInitialBySpaceId.and.stub();
            svc.getNextCollaborators.and.stub();
            return svc;
          }
        },
        MySpacesItemService
      ]
    });

    svc = TestBed.get(MySpacesItemService);
  });

  it('should retrieve number of collaborators from service', (done: DoneFn): void => {
    TestBed.get(CollaboratorService).getInitialBySpaceId.and.returnValue(of([{}, {}] as User[]));
    const nextCollabsSpy: jasmine.Spy = TestBed.get(CollaboratorService).getNextCollaborators;
    nextCollabsSpy.and.callFake(() => {
      if (nextCollabsSpy.calls.count() === 1) {
        return of([{}, {}, {}] as User[]);
      } else {
        return throwError('');
      }
    });

    const space: Space = { id: 'abc123 '} as Space;
    svc.getCollaboratorCount(space)
      .subscribe(
        (count: number): void => {
          const collabSvc: CollaboratorService = TestBed.get(CollaboratorService);
          expect(collabSvc.getInitialBySpaceId).toHaveBeenCalledWith(space.id);
          expect(collabSvc.getNextCollaborators).toHaveBeenCalled();
          expect(count).toEqual(5); // 2 from initial, 3 from next
          done();
        },
        done.fail
      );
  });
});
