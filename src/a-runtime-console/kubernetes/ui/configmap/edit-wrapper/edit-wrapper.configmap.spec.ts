/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { BaseRequestOptions, Http, RequestOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MomentModule } from 'angular2-moment';
import { RestangularModule } from 'ng2-restangular';
import { ModalModule } from 'ngx-modal';
import { KubernetesStoreModule } from '../../../kubernetes.store.module';
import { ConfigMapEditToolbarComponent } from '../edit-toolbar/edit-toolbar.configmap.component';
import { ConfigMapEditComponent } from '../edit/edit.configmap.component';
import { TestAppModule } from './../../../../app.test.module';
import { ConfigMapEditWrapperComponent } from './edit-wrapper.configmap.component';

describe('ConfigMapEditWrapperComponent', () => {
  let configmap: ConfigMapEditWrapperComponent;
  let fixture: ComponentFixture<ConfigMapEditWrapperComponent>;

  beforeEach(async(() => {
    TestBed
      .configureTestingModule({
        imports: [
          RouterTestingModule.withRoutes([]),
          RestangularModule.forRoot(),
          FormsModule,
          MomentModule,
          ModalModule,
          KubernetesStoreModule,
          TestAppModule
        ],
        declarations: [
          ConfigMapEditWrapperComponent,
          ConfigMapEditToolbarComponent,
          ConfigMapEditComponent
        ],
        providers: [
          MockBackend,
          { provide: RequestOptions, useClass: BaseRequestOptions },
          {
            provide: Http, useFactory: (backend, options) => {
              return new Http(backend, options);
            }, deps: [MockBackend, RequestOptions]
          }
        ]
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigMapEditWrapperComponent);
    configmap = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => { expect(configmap).toBeTruthy(); });
});
