import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { SlideOutPanelComponent } from './slide-out-panel.component';

describe('Slide out component - ', () => {
  let comp: SlideOutPanelComponent;
  let fixture: ComponentFixture<SlideOutPanelComponent>;
  let panelState: string = 'in';

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, FormsModule],
      declarations: [SlideOutPanelComponent],
      providers: [],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(SlideOutPanelComponent);
        comp = fixture.componentInstance;
        comp.itemName = 'name';
        comp.itemIcon = 'fa-calendar';
        comp.panelState = panelState;
        fixture.detectChanges();
      });
  }));

  it('should have a detail panel rendered', () => {
    let elements = fixture.debugElement.queryAll(By.css('.detail-panel'));
    expect(elements.length).toBe(1);
  });

  it('should have a header and icon', () => {
    let detailId = fixture.debugElement.query(By.css('.detail-id'));
    expect(detailId).not.toBeNull();
    expect(detailId.nativeElement.textContent.trim().slice(0, 'Name'.length)).toBe('name');

    let icon = fixture.debugElement.queryAll(By.css('.fa-calendar'));
    expect(icon.length).toBe(1);
  });

  it('should update the drawer when clicked', function() {
    let result = fixture.debugElement.query(By.css('.detail-close'));

    expect(comp.panelState).toBe('in');
    result.triggerEventHandler('click', {});
    fixture.detectChanges();

    expect(comp.panelState).toBe('out');
  });

  it('should notify when the panel is closed', function(done) {
    comp.panelStateChange.subscribe((data: string) => {
      expect(data).toBe('out');
      done();
    });

    let result = fixture.debugElement.query(By.css('.detail-close'));

    expect(comp.panelState).toBe('in');
    result.triggerEventHandler('click', {});
    fixture.detectChanges();
  });
});
