import { TestAppModule } from './../../../../app.test.module';
/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SpacesListComponent } from './list.space.component';
import { Fabric8CommonModule } from '../../../../common/common.module';
import { RouterTestingModule } from '@angular/router/testing';
import { MomentModule } from 'angular2-moment';
import { SpaceDeleteDialog } from '../delete-dialog/delete-dialog.space.component';
import { KubernetesStoreModule } from '../../../kubernetes.store.module';
import { ModalModule } from 'ngx-modal';
import { FormsModule } from '@angular/forms';
import { RequestOptions, BaseRequestOptions, Http } from '@angular/http';
import { RestangularModule } from 'ng2-restangular';
import { MockBackend } from '@angular/http/testing';
import { KubernetesComponentsModule } from '../../../components/components.module';

describe('SpacesListComponent', () => {
  let component: SpacesListComponent;
  let fixture: ComponentFixture<SpacesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        Fabric8CommonModule,
        FormsModule,
        MomentModule,
        ModalModule,
        RouterTestingModule.withRoutes([]),
        RestangularModule.forRoot(),
        KubernetesStoreModule,
        KubernetesComponentsModule,
        TestAppModule
      ],
      declarations: [
        SpacesListComponent,
        SpaceDeleteDialog
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
    fixture = TestBed.createComponent(SpacesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
