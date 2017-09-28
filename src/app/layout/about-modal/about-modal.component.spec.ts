import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By }              from '@angular/platform-browser';
import { DebugElement }    from '@angular/core';

import  * as ng2Bootstrap from 'ng2-bootstrap/ng2-bootstrap';
import  { ModalModule } from 'ng2-bootstrap/ng2-bootstrap';

import {
  Component,
  Renderer2,
  ViewChild,
  OnInit,
  Output,
  AfterViewInit,
  ElementRef,
  EventEmitter,
  Input,
  ViewEncapsulation } from '@angular/core';

import { AboutModalComponent } from './about-modal.component';
import { AboutService } from '../../shared/about.service';

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

    let comp:    AboutModalComponent;
    let fixture: ComponentFixture<AboutModalComponent>;
    let de:      DebugElement;
    let el:      HTMLElement;
    let des:     DebugElement[];

    beforeEach(() => {

      let aboutServiceStub = new aboutServiceMock();

      TestBed.configureTestingModule({
        declarations: [ AboutModalComponent ], // declare the test component
        imports: [
          ng2Bootstrap.Ng2BootstrapModule,
          ModalModule.forRoot()
        ],
        providers:  [ {provide: AboutService, useValue: aboutServiceStub } ]

      });

      fixture = TestBed.createComponent(AboutModalComponent);

      comp = fixture.componentInstance; // BannerComponent test instance

    });

    it('should display copyright info', () => {
      fixture.detectChanges();

      de = fixture.debugElement.query(By.css('.trademark-pf'));
      el = de.nativeElement;
      expect(el.textContent).toContain('Copyright');
      expect(el.textContent).toContain('2017 Red Hat,Inc.');
    });

    it('should display build info from about service', () => {
      fixture.detectChanges();

      des = fixture.debugElement.queryAll(By.css('.product-versions-pf ul li span'));
      // console.error('des is: ', des);
      el = des[0].nativeElement;
      expect(el.textContent).toContain('111.000.222');

      el = des[1].nativeElement;
      expect(el.textContent).toContain('some time');
    });

  });
