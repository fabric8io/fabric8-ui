import { async, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { EmailVerificationComponent } from './email-verification.component';

describe('Email Verification Component', () => {
  let fixture;
  let email_true;
  let email_false;
  let routeMock: any;

  beforeEach(() => {
    routeMock = {
      snapshot: {
        queryParams: {
          verified: true
        }
      }
    };

    TestBed.configureTestingModule({
      imports: [FormsModule, RouterTestingModule.withRoutes([])],
      declarations: [EmailVerificationComponent],
      providers: [
        {
          provide: ActivatedRoute, useValue: routeMock
        }
      ]
      // Tells the compiler not to error on unknown elements and attributes
      // schemas: [NO_ERRORS_SCHEMA]
    });
    email_true = {
      attributes: {
        verified: true,
        message: '',
        secMessage: ''
      }
    };
    email_false = {
      attributes: {
        verified: false,
        message: '',
        secMessage: ''
      }
    };
    fixture = TestBed.createComponent(EmailVerificationComponent);
  });

  xit('should verify email is verified', async(() => {
    let comp = fixture.componentInstance;
    let element = fixture.debugElement.nativeElement;
    comp.email_true = email_true;
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(element.querySelector('img').getAttribute('src'))
        .toEqual('../../../assets/images/Logotype_RH_OpenShift-io_RGB_RedGray.png');
    });
  }));

  xit('should verify email has already been used', async(() => {
    let comp = fixture.componentInstance;
    let element = fixture.debugElement.nativeElement;
    comp.email_true = email_true;
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(element.querySelectorAll('img')[1].getAttribute('src'))
        .toEqual('../../../assets/images/neutralface.png');
    });
  }));
});
