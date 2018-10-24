import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { CollaboratorService, Fabric8WitModule } from 'ngx-fabric8-wit';
import { User } from 'ngx-login-client';
import { never, of, throwError } from 'rxjs';
import { createMock } from 'testing/mock';
import { MySpacesItemComponent } from './my-spaces-item.component';

describe('My Spaces Item Component', () => {
  let fixture;
  let space;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [Fabric8WitModule, FormsModule],
      declarations: [MySpacesItemComponent],
      providers: [
        {
          provide: CollaboratorService,
          useFactory: (): CollaboratorService => {
            const svc: jasmine.SpyObj<CollaboratorService> = createMock(CollaboratorService);
            svc.getInitialBySpaceId.and.stub();
            svc.getNextCollaborators.and.stub();
            return svc;
          }
        }
      ],
      // Tells the compiler not to error on unknown elements and attributes
      schemas: [NO_ERRORS_SCHEMA]
    });
    space = {
      attributes: {
        createdAt: '2017-12-07T21:25:59.811024Z',
        description: 'This is my space',
        name: 'test1',
        'updated-at': '2017-12-07T21:25:59.811024Z',
        version: 1
      },
      id: '3eeaa158-a68c-4ff3-9b0d-23ee3368d8b3',
      relationalData: {
        creator: {
          attributes: {
            bio: 'this is my bio',
            cluster: 'https://api.starter-us-east-2.openshift.com',
            company: 'Red Hat',
            contextInformation: {},
            'created-at': '2017-12-07T21:25:59.811024Z',
            email: 'last@redhat.com',
            fullName: 'First Last',
            itentityId: '3cbd262a-016d-4369-affe-eca01ac3',
            imageURL: 'https://www.gravatar.com/avatar/369e6a42fedbe342df8ec7f056162.jpg',
            providerType: 'kc',
            registrationCompleted: true,
            'updated-at': '2017-12-07T21:25:59.811024Z',
            url: '',
            userID: '1477224e-25f1-4372-9cdd-a651ea588',
            username: 'name@redhat.com'
          }
        }
      }
    };
    fixture = TestBed.createComponent(MySpacesItemComponent);
  });

  it('Init component succesfully', async(() => {
    let comp = fixture.componentInstance;
    let debug = fixture.debugElement;
    comp.space = space;
    TestBed.get(CollaboratorService).getInitialBySpaceId.and.returnValue(never());
    fixture.detectChanges();
    let element = debug.queryAll(By.css('.list-pf-title'));
    fixture.whenStable().then(() => {
      expect(element.length).toEqual(1);
    });
  }));

  it('should retrieve number of collaborators from service', async(() => {
    TestBed.get(CollaboratorService).getInitialBySpaceId.and.returnValue(of([{}, {}] as User[]));
    const nextCollabsSpy: jasmine.Spy = TestBed.get(CollaboratorService).getNextCollaborators;
    nextCollabsSpy.and.callFake(() => {
      if (nextCollabsSpy.calls.count() === 1) {
        return of([{}, {}, {}] as User[]);
      } else {
        return throwError('');
      }
    });

    let comp: MySpacesItemComponent = fixture.componentInstance;
    let svc = TestBed.get(CollaboratorService);
    comp.space = space;
    expect(comp.collaboratorCount).toEqual('-');

    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(svc.getInitialBySpaceId).toHaveBeenCalledWith(space.id);
      expect(svc.getNextCollaborators).toHaveBeenCalled();

      // 2 from initial, 3 from first call to next and 0 from second call to next
      expect(comp.collaboratorCount).toEqual('5');
    });
  }));
});
