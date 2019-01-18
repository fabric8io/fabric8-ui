import { CommonModule } from '@angular/common';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { AuthHelperService, TokenProvider } from 'ngx-launcher';
import { AUTH_API_URL } from 'ngx-login-client';
import { AppLauncherComponent } from './app-launcher.component';
import { AuthAPIProvider } from './services/app-launcher-authprovider.service';

describe('LauncherComponent', () => {
  let component: AppLauncherComponent;
  let fixture: ComponentFixture<AppLauncherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, RouterTestingModule],
      declarations: [AppLauncherComponent],
      providers: [
        TokenProvider,
        {
          provide: AuthHelperService,
          useFactory: (AUTH_API_URL) => new AuthAPIProvider(AUTH_API_URL),
          deps: [AUTH_API_URL],
        },
      ],
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
