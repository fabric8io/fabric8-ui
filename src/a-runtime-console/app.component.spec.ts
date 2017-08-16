import { APP_INITIALIZER } from "@angular/core";
import { TestBed, async } from "@angular/core/testing";
import { HttpModule } from "@angular/http";
import { BrowserModule } from "@angular/platform-browser";
import { RouterTestingModule } from "@angular/router/testing";

import { RestangularModule } from "ng2-restangular";
import { Broadcaster, Logger } from 'ngx-base';

import { AppComponent } from "./app.component";
import { TestAppModule } from './app.test.module';
import { ConfigService, configServiceInitializer } from "./config.service";
import { DummyService } from "./dummy/dummy.service";
import { HeaderComponent } from "./header/header.component";
import { KubernetesStoreModule } from "./kubernetes/kubernetes.store.module";
import { ContextService } from "./shared/context.service";

describe('AppComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        BrowserModule,
        HttpModule,
        RestangularModule.forRoot(),
        KubernetesStoreModule,
        TestAppModule,
      ],
      declarations: [
        AppComponent,
        HeaderComponent,
      ],
      providers: [
        Broadcaster,
        ConfigService,
        {
          provide: APP_INITIALIZER,
          useFactory: configServiceInitializer,
          deps: [ConfigService],
          multi: true,
        },
        ContextService,
        DummyService,
        Logger
      ],
    });
    TestBed.compileComponents();
  });

/*
  it('should create the app', async(() => {
    let fixture = TestBed.createComponent(AppComponent);
    let app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it(`should have as title 'Fabric8 Console'`, async(() => {
    let fixture = TestBed.createComponent(AppComponent);
    let app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('Fabric8 Console');
  }));
*/

});
