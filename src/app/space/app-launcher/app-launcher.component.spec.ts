import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

  import {
    AuthHelperService,
    Config,
    DependencyEditorTokenProvider,
    HelperService,
    TokenProvider,
    URLProvider
  } from 'ngx-launcher';
  import { AUTH_API_URL } from 'ngx-login-client';

import { ApiLocatorService } from '../../shared/api-locator.service';
//import { Fabric8UIHttpService } from '../../shared/fabric8-ui-http.service';
import { AppLauncherComponent } from './app-launcher.component';
import { AuthAPIProvider } from './services/app-launcher-authprovider.service';
import { AnalyticsUrlService } from './shared/analytics-url.service';

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
        TokenProvider,
        // {
        //   provide: HttpClient,
        //   useClass: Fabric8UIHttpService
        // },
        {
          provide: AuthHelperService,
          useFactory: (AUTH_API_URL) => new AuthAPIProvider(AUTH_API_URL),
          deps: [AUTH_API_URL]
        },
        {
          provide: URLProvider,
          useFactory: (api: ApiLocatorService) => new AnalyticsUrlService(api),
          deps: [ApiLocatorService]
        },
        { provide: DependencyEditorTokenProvider, useExisting: TokenProvider }
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
