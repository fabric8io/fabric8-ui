import { DebugElement, DebugNode, Renderer2 } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { ModalModule } from 'ngx-bootstrap/modal';

import { AboutService } from '../../shared/about.service';
import { AboutModalComponent } from './about-modal.component';


class aboutServiceMock {

  get buildNumber(): string {
    return '111.000.222';
  }

  get buildTimestamp(): string {
    return 'some time';
  }

  get buildVersion(): string {
    return '1.0.2-dev';
  }
}

describe('AboutModalComponent', () => {

  let fixture: ComponentFixture<AboutModalComponent>;
  let de: DebugElement;
  let el: HTMLElement;
  let des: DebugElement[];
  let component: DebugNode['componentInstance'];
  let mockRenderer: any = jasmine.createSpy('Renderer2');

  beforeEach(() => {
    let aboutServiceStub = new aboutServiceMock();
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ModalModule.forRoot()
      ],
      declarations: [AboutModalComponent],
      providers: [
        { provide: AboutService, useValue: aboutServiceStub },
        { provide: Renderer2, useValue: mockRenderer }
      ]
    });
    fixture = TestBed.createComponent(AboutModalComponent);
    component = fixture.debugElement.componentInstance;
  });

  describe('#modal', () => {
    it('should display copyright info', () => {
      fixture.detectChanges();
      de = fixture.debugElement.query(By.css('.trademark-pf'));
      el = de.nativeElement;
      expect(el.textContent).toContain('Copyright');
      expect(el.textContent).toContain('2018 Red Hat,Inc.');
    });

    it('should display build info from about service', () => {
      fixture.detectChanges();
      des = fixture.debugElement.queryAll(By.css('.product-versions-pf ul li span'));

      el = des[0].nativeElement;
      expect(el.textContent).toContain('111.000.222');

      el = des[1].nativeElement;
      expect(el.textContent).toContain('some time');
    });
  });

  describe('#open', () => {
    it('should show the model when called', () => {
      spyOn(component.staticModal, 'show');
      component.open();
      expect(component.staticModal.show).toHaveBeenCalled();
    });
  });

});
