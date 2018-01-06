/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BuildConfigEditComponent } from './edit.buildconfig.component';
import { FormsModule } from '@angular/forms';

describe('BuildConfigEditComponent', () => {
  let buildconfig: BuildConfigEditComponent;
  let fixture: ComponentFixture<BuildConfigEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule
      ],
      declarations: [
        BuildConfigEditComponent
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuildConfigEditComponent);
    buildconfig = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(buildconfig).toBeTruthy();
  });
});
