import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {Gui, Option} from '../../gui.model';
import {Filter, FilterConfig, FilterEvent} from 'patternfly-ng';

@Component({
  selector: 'quickstart',
  templateUrl: './choose-quickstart.component.html'
})
export class ChooseQuickstartComponent implements OnInit {
  @Input() gui: Gui;
  @Input() form: FormGroup;

  filterConfig: FilterConfig;
  filtersText: string = '';
  private allItems: Option[];

  ngOnInit(): void {
    this.filterConfig = {
      fields: [{
        id: 'name',
        title:  'Name',
        placeholder: 'Filter by Name...',
        type: 'text'
      }]
    };

    this.allItems = this.valueChoices.slice(0);
  }

  filterChanged($event: FilterEvent): void {
    this.filtersText = '';
    $event.appliedFilters.forEach((filter) => {
      this.filtersText += filter.field.title + ' : ' + filter.value + '\n';
    });
    this.applyFilters($event.appliedFilters);
  }

  applyFilters(filters: Filter[]): void {
    this.valueChoices = [];
    if (filters && filters.length > 0) {
      this.allItems.forEach((item) => {
        if (this.matchesFilters(item, filters)) {
          this.valueChoices.push(item);
        }
      });
    } else {
      this.valueChoices = this.allItems;
    }
    this.filterConfig.resultsCount = this.valueChoices.length;
  }

  get valueChoices(): Option[] {
    return this.gui.inputs[0].valueChoices;
  }

  set valueChoices(valueChoices: Option[]) {
    this.gui.inputs[0].valueChoices = valueChoices;
  }

  matchesFilter(item: Option, filter: Filter): boolean {
    let match = true;
    if (filter.field.id === 'name') {
      match = item.id.toLowerCase().match(filter.value.toLowerCase()) !== null;
    }
    return match;
  }

  matchesFilters(item: Option, filters: Filter[]): boolean {
    let matches = true;
    filters.forEach((filter) => {
      if (!this.matchesFilter(item, filter)) {
        matches = false;
        return matches;
      }
    });
    return matches;
  }
}

