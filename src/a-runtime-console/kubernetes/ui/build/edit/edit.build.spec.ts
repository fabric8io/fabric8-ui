/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { BuildEditComponent } from './edit.build.component';

describe('BuildEditComponent', () => {
  let build: BuildEditComponent;
  let fixture: ComponentFixture<BuildEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule
      ],
      declarations: [
        BuildEditComponent
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuildEditComponent);
    build = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(build).toBeTruthy();
  });
});
