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
import { SpaceEditToolbarComponent } from '../edit-toolbar/edit-toolbar.space.component';
import { SpaceEditComponent } from '../edit/edit.space.component';
import { TestAppModule } from './../../../../app.test.module';
import { SpaceEditWrapperComponent } from './edit-wrapper.space.component';

describe('SpaceEditWrapperComponent', () => {
  let space: SpaceEditWrapperComponent;
  let fixture: ComponentFixture<SpaceEditWrapperComponent>;

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
          SpaceEditWrapperComponent,
          SpaceEditToolbarComponent,
          SpaceEditComponent
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
    fixture = TestBed.createComponent(SpaceEditWrapperComponent);
    space = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => { expect(space).toBeTruthy(); });
});
