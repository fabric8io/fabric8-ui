/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Fabric8CommonModule } from '../../../../common/common.module';
import { BuildsListToolbarComponent } from './list-toolbar.build.component';

describe('BuildsListToolbarComponent', () => {
  let component: BuildsListToolbarComponent;
  let fixture: ComponentFixture<BuildsListToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        Fabric8CommonModule
      ],
      declarations: [BuildsListToolbarComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuildsListToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
