import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Fabric8WitModule } from 'ngx-fabric8-wit';
import { never, of } from 'rxjs';
import { createMock } from 'testing/mock';
import { MySpacesItemComponent } from './my-spaces-item.component';
import { MySpacesItemService } from './my-spaces-item.service';

describe('My Spaces Item Component', () => {
  let fixture;
  let space;

  beforeEach(() => {
    const itemService: jasmine.SpyObj<MySpacesItemService> = createMock(MySpacesItemService);
    itemService.getCollaboratorCount.and.returnValue(never());
    itemService.getWorkItemCount.and.returnValue(never());

    TestBed.configureTestingModule({
      imports: [Fabric8WitModule, FormsModule],
      declarations: [MySpacesItemComponent],
      providers: [
        {
          provide: MySpacesItemService,
          useFactory: (): MySpacesItemService => itemService
        }
      ],
      // Tells the compiler not to error on unknown elements and attributes
      schemas: [NO_ERRORS_SCHEMA]
    });
    TestBed.overrideProvider(MySpacesItemService, { useValue: itemService });
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
    TestBed.get(MySpacesItemService).getCollaboratorCount.and.returnValue(never());
    fixture.detectChanges();
    let element = debug.queryAll(By.css('.list-pf-title'));
    fixture.whenStable().then(() => {
      expect(element.length).toEqual(1);
    });
  }));

  it('should retrieve number of collaborators from service', async(() => {
    TestBed.get(MySpacesItemService).getCollaboratorCount.and.returnValue(of(5));

    let comp: MySpacesItemComponent = fixture.componentInstance;
    comp.space = space;
    expect(comp.collaboratorCount).toEqual('-');

    fixture.detectChanges();
    fixture.whenStable().then(() => {
      // 2 from initial, 3 from first call to next and 0 from second call to next
      expect(comp.collaboratorCount).toEqual('5');
    });
  }));

  it('should retrieve number of workitems from service', async(() => {
    TestBed.get(MySpacesItemService).getWorkItemCount.and.returnValue(of(10));

    let comp: MySpacesItemComponent = fixture.componentInstance;
    comp.space = space;
    expect(comp.workItemCount).toEqual('-');

    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(comp.workItemCount).toEqual('10');
    });
  }));
});
