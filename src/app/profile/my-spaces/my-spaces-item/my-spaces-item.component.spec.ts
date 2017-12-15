import {
  async,
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NO_ERRORS_SCHEMA } from "@angular/core";

import { Fabric8WitModule, Space } from 'ngx-fabric8-wit';

import { MySpacesItemComponent } from './my-spaces-item.component';

describe('My Spaces Item Component', () => {
  let fixture;
  let space;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [Fabric8WitModule, FormsModule, HttpModule],
      declarations: [MySpacesItemComponent],
      providers: [],
      // Tells the compiler not to error on unknown elements and attributes
      schemas: [NO_ERRORS_SCHEMA]
    });
    space = {
      attributes: {
        createdAt: '2017-12-07T21:25:59.811024Z',
        description: "This is my space",
        name: "test1",
        "updated-at": '2017-12-07T21:25:59.811024Z',
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
            "updated-at": '2017-12-07T21:25:59.811024Z',
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
    fixture.detectChanges();
    let element = debug.queryAll(By.css('.list-pf-title'));
    fixture.whenStable().then(() => {
      expect(element.length).toEqual(1)
    });
  }));
});
