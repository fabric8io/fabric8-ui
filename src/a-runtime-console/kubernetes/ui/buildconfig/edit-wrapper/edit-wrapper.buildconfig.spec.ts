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
import { BuildConfigEditToolbarComponent } from '../edit-toolbar/edit-toolbar.buildconfig.component';
import { BuildConfigEditComponent } from '../edit/edit.buildconfig.component';
import { TestAppModule } from './../../../../app.test.module';
import { BuildConfigEditWrapperComponent } from './edit-wrapper.buildconfig.component';

describe('BuildConfigEditWrapperComponent', () => {
  let buildconfig: BuildConfigEditWrapperComponent;
  let fixture: ComponentFixture<BuildConfigEditWrapperComponent>;

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
          BuildConfigEditWrapperComponent,
          BuildConfigEditToolbarComponent,
          BuildConfigEditComponent
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
    fixture = TestBed.createComponent(BuildConfigEditWrapperComponent);
    buildconfig = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => { expect(buildconfig).toBeTruthy(); });
});
