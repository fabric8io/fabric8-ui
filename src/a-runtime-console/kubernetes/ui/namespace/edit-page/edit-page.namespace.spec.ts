/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { BaseRequestOptions, Http, RequestOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { RestangularModule } from 'ng2-restangular';
import { KubernetesStoreModule } from '../../../kubernetes.store.module';
import { NamespaceEditToolbarComponent } from '../edit-toolbar/edit-toolbar.namespace.component';
import { NamespaceEditWrapperComponent } from '../edit-wrapper/edit-wrapper.namespace.component';
import { NamespaceEditComponent } from '../edit/edit.namespace.component';
import { TestAppModule } from './../../../../app.test.module';
import { NamespaceEditPage } from './edit-page.namespace.component';


describe('NamespaceEditPage', () => {
  let namespace: NamespaceEditPage;
  let fixture: ComponentFixture<NamespaceEditPage>;

  beforeEach(async(() => {
    TestBed
      .configureTestingModule({
        imports: [
          RouterTestingModule.withRoutes([]),
          RestangularModule.forRoot(),
          FormsModule,
          KubernetesStoreModule,
          TestAppModule
        ],
        declarations: [
          NamespaceEditPage,
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
    fixture = TestBed.createComponent(NamespaceEditPage);
    namespace = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => { expect(namespace).toBeTruthy(); });
});
