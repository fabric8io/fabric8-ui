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
import { NamespaceEditToolbarComponent } from '../edit-toolbar/edit-toolbar.namespace.component';
import { NamespaceEditComponent } from '../edit/edit.namespace.component';
import { TestAppModule } from './../../../../app.test.module';
import { NamespaceEditWrapperComponent } from './edit-wrapper.namespace.component';

describe('NamespaceEditWrapperComponent', () => {
  let namespace: NamespaceEditWrapperComponent;
  let fixture: ComponentFixture<NamespaceEditWrapperComponent>;

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
          NamespaceEditWrapperComponent,
          NamespaceEditToolbarComponent,
          NamespaceEditComponent
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
    fixture = TestBed.createComponent(NamespaceEditWrapperComponent);
    namespace = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => { expect(namespace).toBeTruthy(); });
});
