import { Component, ViewChild } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { TruncateModule } from 'ng2-truncate';
import { WidgetsModule } from 'ngx-widgets';

import { Observable, of } from 'rxjs';
import { NgLetModule } from '../../shared/ng-let';
import { SelectDropdownModule } from '../../widgets/select-dropdown/select-dropdown.module';
import {
  TypeaheadDatasourceFunction,
  TypeaheadDropdownItem,
  TypeaheadSelectorComponent,
} from './typeahead-selector.component';
/**
 * Test basic functions
 */
describe('TypeaheadSelectorComponent :: ', () => {
  const comp = new TypeaheadSelectorComponent();
  it('Header text should have a default value', () => {
    expect(comp.headerText).toBe('Default Header Text');
  });

  it('noValueLabel should have a default value None', () => {
    expect(comp.noValueLabel).toBe('None');
  });

  it('by default update should be allowed', () => {
    expect(comp.allowUpdate).toBeTruthy();
  });

  it('by default multi select should not be allowed', () => {
    expect(comp.allowMultiSelect).toBeFalsy();
  });

  it('by default close the dropdown on select', () => {
    expect(comp.closeOnSelect).toBeTruthy();
  });

  it('updateSelection function should select correctly', () => {
    const selectedItems: TypeaheadDropdownItem[] = [
      { key: '1', value: 'One', selected: true },
      { key: '2', value: 'Two', selected: true },
    ];
    const items: TypeaheadDropdownItem[] = [
      { key: '1', value: 'One', selected: true },
      { key: '2', value: 'Two', selected: true },
      { key: '3', value: 'Three', selected: true },
      { key: '4', value: 'Four', selected: true },
    ];
    const exptectedOutput: TypeaheadDropdownItem[] = [
      { key: '1', value: 'One', selected: true },
      { key: '2', value: 'Two', selected: true },
      { key: '3', value: 'Three', selected: false },
      { key: '4', value: 'Four', selected: false },
    ];
    expect(comp.updateSelection(items, selectedItems)).toEqual(exptectedOutput);
  });
});

/**
 * Input setter testing
 */
describe('TypeaheadSelectorComponent :: ', () => {
  let fixture: ComponentFixture<TestComponent>;
  let comp: TestComponent;
  let subscription = null;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TypeaheadSelectorComponent, TestComponent],
      imports: [SelectDropdownModule, TruncateModule, WidgetsModule, NgLetModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    comp = fixture.componentInstance;
  });

  afterEach(() => {
    if (subscription) {
      subscription.unsubscribe();
    }
    subscription = null;
  });

  it('selectedItems input setter works as expected when multiSelect is off', () => {
    fixture.detectChanges();
    expect(comp.selectorRef.selectedItems).toEqual([comp.selectedItems[0]]);
  });

  it('selectedItems input setter works as expected when multiSelect is on', () => {
    comp.allowMultiSelect = true;
    fixture.detectChanges();
    expect(comp.selectorRef.selectedItems).toEqual(comp.selectedItems);
  });

  it('if selectedItems is not an array setter should set it to []', () => {
    comp.selectedItems = null;
    fixture.detectChanges();
    expect(comp.selectorRef.selectedItems).toEqual([]);
  });

  it('menuItems propagate correct value based on search event', () => {
    fixture.detectChanges();
    let exptectedOutput = [];
    subscription = comp.selectorRef.menuItems.subscribe((items) => {
      const selectedItems = items.filter((i) => i.selected);
      expect(selectedItems).toEqual(exptectedOutput);
    });

    // Now provide the search input
    exptectedOutput = [{ key: '1', value: 'One', selected: true }];
    comp.selectorRef.onSearch('some input');

    // with no search input it shold return empty array
    exptectedOutput = [];
    comp.selectorRef.onSearch('');

    // If dataSource is not a function it should return empty array
    exptectedOutput = [];
    comp.dataSource = null;
    fixture.detectChanges();
    comp.selectorRef.onSearch('With some value');
  });

  it('menuItems propagate correct value based on select event', () => {
    fixture.detectChanges();
    let exptectedOutput = [];

    // turn off onSelect close
    comp.closeOnSelect = false;
    fixture.detectChanges();

    subscription = comp.selectorRef.menuItems.subscribe((items) => {
      const selectedItems = items.filter((i) => i.selected);
      expect(selectedItems).toEqual(exptectedOutput);
    });

    // Need to set some search value test #1
    exptectedOutput = [{ key: '1', value: 'One', selected: true }];
    comp.selectorRef.onSearch('some string');

    // selecting one item with multi select off
    exptectedOutput = [{ key: '2', value: 'Two', selected: true }];
    comp.selectorRef.onSelect({ key: '2', value: 'Two', selected: true });

    // selecting another item with multi select off
    exptectedOutput = [{ key: '1', value: 'One', selected: true }];
    comp.selectorRef.onSelect({ key: '1', value: 'One', selected: true });

    // turning multi select on
    comp.allowMultiSelect = true;
    fixture.detectChanges();

    // Selecting another item
    exptectedOutput = [
      { key: '1', value: 'One', selected: true },
      { key: '2', value: 'Two', selected: true },
    ];
    comp.selectorRef.onSelect({ key: '2', value: 'Two', selected: true });

    // De-selecting an item
    exptectedOutput = [{ key: '1', value: 'One', selected: true }];
    comp.selectorRef.onSelect({ key: '2', value: 'Two', selected: true });
  });
});

/**
 * Test Host componnet
 */
@Component({
  selector: 'test-host',
  // tslint:disable-next-line:max-inline-declarations
  template: `
    <f8-typeahead-selector
      #selector
      [selectedItems]="selectedItems"
      [allowMultiSelect]="allowMultiSelect"
      [dataSource]="dataSource"
      [closeOnSelect]="closeOnSelect"
    >
    </f8-typeahead-selector>
  `,
})
class TestComponent {
  @ViewChild('selector') selectorRef: TypeaheadSelectorComponent;

  items: TypeaheadDropdownItem[] = [
    { key: '1', value: 'One', selected: true },
    { key: '2', value: 'Two', selected: true },
    { key: '3', value: 'Three', selected: true },
    { key: '4', value: 'Four', selected: true },
  ];

  selectedItems: TypeaheadDropdownItem[] = this.items.slice(0, 2);
  closeOnSelect: boolean = true;
  allowMultiSelect: boolean = false;

  dataSource: TypeaheadDatasourceFunction = (inp: string) => {
    return of(this.items);
  };
}
