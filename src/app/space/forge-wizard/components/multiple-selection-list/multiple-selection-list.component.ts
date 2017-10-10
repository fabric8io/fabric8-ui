import { Component, Input, OnInit } from '@angular/core';
import { Input as GuiInput, Option } from 'app/space/forge-wizard/gui.model';
import { FormGroup } from '@angular/forms';

@Component({
  selector: './multiple-selection-list',
  templateUrl: './multiple-selection-list.component.html',
  styleUrls: [ './multiple-selection-list.component.less' ]
})
export class MultipleSelectionListComponent implements OnInit {

  @Input() field: GuiInput;
  @Input() form: FormGroup;

  showFilter: boolean = false;

  constructor() {
  }

  ngOnInit() {
    this.field.valueChoices.forEach(val => val.visible = true);
  }

  // behaviors
  allOptionsSelected(field: GuiInput): boolean {
    return !field.valueChoices.find((i) => i.selected === false);
  }

  hasValue(field: GuiInput): boolean {
     let tmp = false;
     if (field.value != null && field.value !== undefined && (field.value.toString() || '').trim() !== '') {
       tmp = true;
     }
     return tmp;
  }

  selectChoice(choice: Option, value: boolean) {
    choice.selected = value;
    this.form.controls[this.field.name].patchValue(this.field.valueChoices
      .filter((o) => o.selected)
      .map((o) => o.id));
    this.form.controls[this.field.name].markAsDirty();
  }

  clearFilter(field: GuiInput) {
    this.showFilter = false;
    this.filterList(field, '');
  }

  filterList(field: GuiInput, filter: string) {
    filter = filter.replace('*', '');
    filter = filter.replace('?', '');
    filter = filter.replace('/', '');
    filter = filter.replace('\\', '');
    filter = filter.replace('[', '\\[');
    filter = filter.replace(']', '\\]');
    let filters = filter.split(',').map( f => f.trim()).filter( f => f.length > 0);
    let specialFilterIncludeSelectedItems = filters.filter( f => f.toLowerCase() === '\\[x\\]').length > 0;
    if (filters.length === 0 ) {
        // if no filters ... everything is visible
        field.valueChoices.forEach(c => c.visible = true);
        return;
    }
    // remove the special 'show selected' filter
    filters = filters.filter( f => f.toLowerCase() !== '\\[x\\]');

    let filterRegularExpressions = filters.map( f => new RegExp(f || '', 'ig'));

    let list = field.valueChoices.filter( (choice) => {
      // set everything to not visible,
      // except for selected when 'include selected' special filter is on
      choice.visible = false;
      if ( specialFilterIncludeSelectedItems === true) {
        if (choice.selected === true) {
          choice.visible = true;
        }
      }
      // then match at least one
      let match = filterRegularExpressions.find( r => (
          (choice.id.match(r))
          || (choice.description.match(r))
          || []
        ).length > 0
      );
      if (match) {
        // there is at least one match
        return true;
      }
      // there are no matches
      return false;
    });
    if (list) {
      list.forEach(choice => {
        // each matching choice gets set to visible
        choice.visible = true;
      });
    }
  }
}
