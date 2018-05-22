import {
    Component,
    Host,
    Input,
    OnDestroy,
    OnInit,
    ViewEncapsulation
  } from '@angular/core';

  import { CommonModule } from '@angular/common';
  import { async, ComponentFixture, TestBed } from '@angular/core/testing';
  import { FormsModule } from '@angular/forms';
  import { RouterTestingModule } from '@angular/router/testing';

  import {
    Config,
    TokenProvider
  } from 'ngx-forge';

  import { AppLauncherComponent } from './app-launcher.component';

  describe('LauncherComponent', () => {
    let component: AppLauncherComponent;
    let fixture: ComponentFixture<AppLauncherComponent>;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [
          CommonModule,
          FormsModule,
          RouterTestingModule
        ],
        declarations: [
          AppLauncherComponent
        ],
        providers: [
          TokenProvider
        ]
      }).compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(AppLauncherComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });
