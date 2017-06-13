import { AppGeneratorSingleSelectionDropDownComponent } from './app-generator-single-selection-dropdown.component';
import { Component } from "@angular/core";
import { IField } from '../../services/app-generator.service';

@Component({
  selector: 'app-generator-filtered-dropdown',
  templateUrl: './app-generator-filtered-dropdown.component.html',
  styleUrls: ['./app-generator-single-selection-dropdown.component.scss']
})
export class AppGeneratorFilteredDropDownComponent extends AppGeneratorSingleSelectionDropDownComponent {
  filterList(field: IField, filter: string) {
    this.log(":::FilterList::input::" + JSON.stringify(filter));
    // TODO: better validation of bad or illegal chars
    filter = filter.replace('*', '');
    filter = filter.replace('?', '');
    filter = filter.replace('/', '');
    filter = filter.replace('\\', '');
    filter = filter.replace('[', '\\[');
    filter = filter.replace(']', '\\]');
    let filters = filter.split(',').map(f => f.trim()).filter(f => f.length > 0);
    let specialFilterIncludeSelectedItems = filters.filter(f => f.toLowerCase() === '\\[x\\]').length > 0;
    this.log(":::FilterList::filters::" + JSON.stringify(filters) + "::specialFilterIncludeSelectedItems::" + JSON.stringify(specialFilterIncludeSelectedItems));
    if (filters.length === 0) {
      // if no filters ... everything is visible
      field.display.choices.forEach(c => c.visible = true);
      this.log(":::FileterList::no filters::" + JSON.stringify(filters));
      return;
    }

    let filterRegularExpressions = filters.map(f => new RegExp(f || '', 'ig'));
    this.log(":::FilterList::filterRegularExpressions::" + JSON.stringify(filterRegularExpressions));

    field.display.choices.filter((choice) => {
      // set everything to not visible,
      choice.visible = false;
      this.log(":::FilterList::field.display.choices.filter::choice::" + JSON.stringify(choice));
      // then match at least one
      let match = filterRegularExpressions.find(r => (
        (choice.id.match(r))
        || (choice.description.match(r))
        || []
      ).length > 0
      );
      if (match) {
        // there is at least one match
        this.log(":::FilterList::match::choice::" + JSON.stringify(choice));
        return true;
      }
      // there are no matches
      return false;
    })
      .forEach(choice => {
        // each matching choice gets set to visible
        this.log(":::FilterList::forEach::choice::" + JSON.stringify(choice));
        choice.visible = true;
      });

  }
}
