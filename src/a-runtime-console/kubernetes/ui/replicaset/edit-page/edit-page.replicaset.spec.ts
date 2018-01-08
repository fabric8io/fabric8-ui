/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { BaseRequestOptions, Http, RequestOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { RestangularModule } from 'ng2-restangular';
import { KubernetesStoreModule } from '../../../kubernetes.store.module';
import { ReplicaSetEditToolbarComponent } from '../edit-toolbar/edit-toolbar.replicaset.component';
import { ReplicaSetEditWrapperComponent } from '../edit-wrapper/edit-wrapper.replicaset.component';
import { ReplicaSetEditComponent } from '../edit/edit.replicaset.component';
import { TestAppModule } from './../../../../app.test.module';
import { ReplicaSetEditPage } from './edit-page.replicaset.component';


describe('ReplicaSetEditPage', () => {
  let replicaset: ReplicaSetEditPage;
  let fixture: ComponentFixture<ReplicaSetEditPage>;

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
          ReplicaSetEditPage,
          ReplicaSetEditWrapperComponent,
          ReplicaSetEditToolbarComponent,
          ReplicaSetEditComponent
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
    fixture = TestBed.createComponent(ReplicaSetEditPage);
    replicaset = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => { expect(replicaset).toBeTruthy(); });
});
