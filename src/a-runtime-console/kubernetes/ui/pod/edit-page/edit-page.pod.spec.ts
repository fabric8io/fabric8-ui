/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { BaseRequestOptions, Http, RequestOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { RestangularModule } from 'ng2-restangular';
import { KubernetesStoreModule } from '../../../kubernetes.store.module';
import { PodEditToolbarComponent } from '../edit-toolbar/edit-toolbar.pod.component';
import { PodEditWrapperComponent } from '../edit-wrapper/edit-wrapper.pod.component';
import { PodEditComponent } from '../edit/edit.pod.component';
import { TestAppModule } from './../../../../app.test.module';
import { PodEditPage } from './edit-page.pod.component';


describe('PodEditPage', () => {
  let pod: PodEditPage;
  let fixture: ComponentFixture<PodEditPage>;

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
          PodEditPage,
          PodEditWrapperComponent,
          PodEditToolbarComponent,
          PodEditComponent
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
    fixture = TestBed.createComponent(PodEditPage);
    pod = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => { expect(pod).toBeTruthy(); });
});
