import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AlmIconTest } from './almicon-test.component';
import { AlmIconDirective } from './almicon.directive';

describe('AlmIcon directive - ', () => {
  let comp: AlmIconTest;
  let fixture: ComponentFixture<AlmIconTest>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AlmIconTest, AlmIconDirective],
    });
  });

  it('Canary test should pass', () => {
    expect(true).toBeTruthy();
  });

  it('Should apply appropriate class and color', () => {
    TestBed.overrideComponent(AlmIconTest, {
      set: {
        template: '<span almIcon iconType="new"></span>',
      },
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(AlmIconTest);
        comp = fixture.componentInstance;
        fixture.detectChanges();
        let compiled = fixture.debugElement.nativeElement.querySelector('span');
        expect(compiled.className).toBe('fa fa-star');
        expect(compiled.style.color).toBe('rgb(88, 47, 192)');
      });
  });

  it('Should apply default class and color', () => {
    TestBed.overrideComponent(AlmIconTest, {
      set: {
        template: '<span almIcon iconType="anything"></span>',
      },
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(AlmIconTest);
        comp = fixture.componentInstance;
        fixture.detectChanges();
        let compiled = fixture.debugElement.nativeElement.querySelector('span');
        expect(compiled.className).toBe('fa fa-crosshairs');
        expect(compiled.style.color).toBe('rgb(0, 0, 0)');
      });
  });
});
