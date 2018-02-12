/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { SpaceEditComponent } from './edit.space.component';

describe('SpaceEditComponent', () => {
  let space: SpaceEditComponent;
  let fixture: ComponentFixture<SpaceEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule
      ],
      declarations: [
        SpaceEditComponent
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpaceEditComponent);
    space = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(space).toBeTruthy();
  });
});
