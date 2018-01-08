/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { BaseRequestOptions, Http, RequestOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { RestangularModule } from 'ng2-restangular';
import { KubernetesStoreModule } from '../../../kubernetes.store.module';
import { BuildEditToolbarComponent } from '../edit-toolbar/edit-toolbar.build.component';
import { BuildEditWrapperComponent } from '../edit-wrapper/edit-wrapper.build.component';
import { BuildEditComponent } from '../edit/edit.build.component';
import { TestAppModule } from './../../../../app.test.module';
import { BuildEditPage } from './edit-page.build.component';


describe('BuildEditPage', () => {
  let build: BuildEditPage;
  let fixture: ComponentFixture<BuildEditPage>;

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
          BuildEditPage,
          BuildEditWrapperComponent,
          BuildEditToolbarComponent,
          BuildEditComponent
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
    fixture = TestBed.createComponent(BuildEditPage);
    build = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => { expect(build).toBeTruthy(); });
});
