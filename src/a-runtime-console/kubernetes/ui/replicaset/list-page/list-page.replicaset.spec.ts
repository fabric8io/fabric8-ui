/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { BaseRequestOptions, Http, RequestOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MomentModule } from 'angular2-moment';
import { RestangularModule } from 'ng2-restangular';
import { ModalModule } from 'ngx-modal';
import { Fabric8CommonModule } from '../../../../common/common.module';
import { KubernetesComponentsModule } from '../../../components/components.module';
import { KubernetesStoreModule } from '../../../kubernetes.store.module';
import { ReplicaSetDeleteDialog } from '../delete-dialog/delete-dialog.replicaset.component';
import { ReplicaSetsListToolbarComponent } from '../list-toolbar/list-toolbar.replicaset.component';
import { ReplicaSetsListComponent } from '../list/list.replicaset.component';
import { ReplicaSetScaleDialog } from '../scale-dialog/scale-dialog.replicaset.component';
import { TestAppModule } from './../../../../app.test.module';
import { ReplicaSetsListPage } from './list-page.replicaset.component';

describe('ReplicaSetsListPage', () => {
  let component: ReplicaSetsListPage;
  let fixture: ComponentFixture<ReplicaSetsListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        Fabric8CommonModule,
        RouterTestingModule.withRoutes([]),
        RestangularModule.forRoot(),
        FormsModule,
        MomentModule,
        ModalModule,
        KubernetesStoreModule,
        KubernetesComponentsModule,
        TestAppModule
      ],
      declarations: [
        ReplicaSetsListPage,
        ReplicaSetsListComponent,
        ReplicaSetsListToolbarComponent,
        ReplicaSetDeleteDialog,
        ReplicaSetScaleDialog
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
    fixture = TestBed.createComponent(ReplicaSetsListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
