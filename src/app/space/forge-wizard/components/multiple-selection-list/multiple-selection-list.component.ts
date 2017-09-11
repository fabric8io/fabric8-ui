import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Input as GuiInput, Option } from "app/space/forge-wizard/gui.model";

@Component({
  selector: './multiple-selection-list',
  templateUrl: './multiple-selection-list.component.html',
  styleUrls: [ './multiple-selection-list.component.less' ]
})
export class MultipleSelectionListComponent implements OnInit {

  // keep track of the number of instances
  static instanceCount: number = 1;

  @Input() field: GuiInput;

  public showFilter= false;

  constructor() {
  }

  ngOnInit() {
  }

  // behaviors
  allOptionsSelected(field: GuiInput): boolean {
    return !field.display.choices.find((i) => i.selected === false);
  }

  hasValue(field: GuiInput): boolean {
     let tmp = false;
     if (field.value != null && field.value !== undefined && (field.value.toString() || '').trim() !== '') {
       tmp = true;
     }
     return tmp;
  }

  selectOption(field: GuiInput, choice: Option) {
    choice.selected = true;
    this.updateFieldValue();
  }
  toggleOption(field: GuiInput, choice: Option) {
    choice.selected = !choice.selected;
    this.updateFieldValue();
  }

  deselectOption(field: GuiInput, choice: Option) {
    choice.selected = false;
    //this.field.value.pop(field);
  }

  clearFilter(field: GuiInput) {
    this.showFilter = false;
    this.filterList(field, '');
  }

  selectChoice(choice) {
    this.updateFieldValue();
  }

  // updateFieldValue() {
  //   if ( !this.field ) {
  //     return null;
  //   }
  //   switch (this.field.display.inputType) {
  //     case FieldWidgetClassificationOptions.MultipleSelection:
  //     {
  //       if ( this.field.display.hasChoices ) {
  //         this.field.value = this.field.display.choices
  //         .filter((o) => o.selected)
  //         .map((o) => o.id);
  //       } else {
  //         this.field.value = [];
  //       }
  //       this.appGenerator.state.canMoveToNextStep = true;
  //       break;
  //     }
  //     default: {
  //       break;
  //     }
  //   }
  // }

  deselectAllOptions(field: GuiInput) {
    field.display.choices.forEach((o) => {
      o.selected = false;
    });
  }

  filterList(field: GuiInput, filter: string) {
    // TODO: better validation of bad or illegal chars
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
        field.display.choices.forEach(c => c.visible = true);
        return;
    }
    // remove the special 'show selected' filter
    filters = filters.filter( f => f.toLowerCase() !== '\\[x\\]');



    let filterRegularExpressions = filters.map( f => new RegExp(f || '', 'ig'));


    field.display.choices.filter( (choice) => {
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
    })
    .forEach(choice => {
      // each matching choice gets set to visible
      choice.visible = true;
    });

  }

  selectAllOptions(field: GuiInput) {
    field.display.choices.forEach((o) => {
      o.selected = true;
    });
  }

  toggleSelectAll(field: GuiInput) {
    if ( !field ) {
      return;
    }
    // at least one not selected, then select all , else deselect all
    let item = field.display.choices.find((i) => i.selected === false);
    if ( item ) {
      for ( let o of field.display.choices ) {
        o.selected = true;
      }
    } else {
      for ( let o of field.display.choices ) {
        o.selected = false;
      }
    }
    this.updateFieldValue();
  }

}
