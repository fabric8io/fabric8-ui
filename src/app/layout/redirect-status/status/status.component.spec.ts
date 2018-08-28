import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { StatusComponent } from './status.component';

import { RedirectStatusData } from '../../../models/redirect-data';


describe('StatusComponent', () => {

  let component: StatusComponent;
  let fixture: ComponentFixture<StatusComponent>;
  let successImgEl: DebugElement;
  let failImgEl: DebugElement;
  let ctaEl: DebugElement;
  let msgEl: DebugElement;
  let secMsgEl: DebugElement;

  const successData: RedirectStatusData = {
    statusMessage: 'Your e-mail has been confirmed.',
    secondaryStatusMessage: 'Thank you for validating your e-mail address. You can now continue to use Openshift.io',
    callToActionUrl: '_home',
    callToActionLabel: 'home dashboard'
  };
  const failData: RedirectStatusData = {
    statusMessage: 'Some primary error message.',
    secondaryStatusMessage: 'It appears there is a problem with validating your e-mail. You can reset your e-mail on your Profile Page',
    callToActionUrl: '_profile',
    callToActionLabel: 'profile'
  };

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [ RouterTestingModule.withRoutes([]) ],
      declarations: [ StatusComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    // create component and test fixture
    fixture = TestBed.createComponent(StatusComponent);

    // get test component from the fixture
    component = fixture.componentInstance;

    successImgEl = fixture.debugElement.query(By.css('.success-img'));
    failImgEl = fixture.debugElement.query(By.css('.fail-img'));
    ctaEl = fixture.debugElement.query(By.css('.cta-button'));
    msgEl = fixture.debugElement.query(By.css('.primary-msg'));
    secMsgEl = fixture.debugElement.query(By.css('.secondary-msg'));
  });

  it('should have success image, msg and cta_link set', () => {
    component.status = 'success';
    component.data = successData;
    fixture.detectChanges();
    fixture.whenStable().then(async(() => {
      expect(msgEl.nativeElement.innerText).toBe(successData.statusMessage);
      expect(secMsgEl.nativeElement.innerText).toBe(successData.secondaryStatusMessage);

      expect(successImgEl.nativeElement).toBeTruthy();
      expect(failImgEl.nativeElement).toBeFalsy();
      expect(successImgEl.nativeElement.getAttribute('src'))
        .toEqual('../../../../assets/images/trophy.png');

      expect(ctaEl.nativeElement.getAttribute('href'))
        .toEqual('/' + successData.callToActionUrl);
    }));
  });

  it('should have fail image, msg and cta_link set', () => {
    component.status = 'fail';
    component.data = failData;
    fixture.detectChanges();
    fixture.whenStable().then(async(() => {
      expect(msgEl.nativeElement.innerText).toBe(failData.statusMessage);
      expect(secMsgEl.nativeElement.innerText).toBe(failData.secondaryStatusMessage);
      expect(successImgEl.nativeElement).toBeFalsy();
      expect(failImgEl.nativeElement).toBeTruthy();
      expect(failImgEl.nativeElement.getAttribute('src'))
        .toEqual('../../../../assets/images/neutralface.png');

      expect(ctaEl.nativeElement.getAttribute('href'))
        .toEqual('/' + failData.callToActionUrl);
    }));
  });

});
