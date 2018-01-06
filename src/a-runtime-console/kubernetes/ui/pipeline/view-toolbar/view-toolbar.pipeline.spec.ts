/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { PipelineViewToolbarComponent } from './view-toolbar.pipeline.component';

describe('PipelineViewToolbarComponent', () => {
  let pipeline: PipelineViewToolbarComponent;
  let fixture: ComponentFixture<PipelineViewToolbarComponent>;

  beforeEach(async(() => {
    TestBed
        .configureTestingModule({
          imports: [
            RouterTestingModule.withRoutes([])
          ],
          declarations: [PipelineViewToolbarComponent]
        })
        .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PipelineViewToolbarComponent);
    pipeline = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => { expect(pipeline).toBeTruthy(); });
});
