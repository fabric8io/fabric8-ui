import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { By } from '@angular/platform-browser';

import { EmailVerificationComponent } from './email-verification.component';

describe('Email Verification Component', () => {
  let fixture;
  let email_true;
  let email_false;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, HttpModule],
      declarations: [EmailVerificationComponent],
      providers: [],
      // Tells the compiler not to error on unknown elements and attributes
      schemas: [NO_ERRORS_SCHEMA]
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

  it('should verify email is verified', async(() => {
    let comp = fixture.componentInstance;
    let debug = fixture.debugElement;
    comp.email_true = email_true;
    fixture.detectChanges();
    let element = debug.queryAll();
    fixture.whenStable().then(() => {
      console.log(element.find('img').prop('src'));
      expect(element.find('img').prop('src')).toEqual('../../../assets/images/trophy.png');
    });
  }));
  it('should verify email has already been used', async(() => {
    let comp = fixture.componentInstance;
    let debug = fixture.debugElement;
    comp.email_false = email_false;
    fixture.detectChanges();
    let element = debug.queryAll();
    fixture.whenStable().then(() => {
      console.log(element.find('img').prop('src'));
      expect(element.find('img').prop('src')).toEqual('../../../assets/images/neutralface.png');
    });
  }));
});
