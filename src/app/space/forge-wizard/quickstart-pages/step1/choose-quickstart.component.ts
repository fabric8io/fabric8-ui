import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Gui, Input as ForgeInput, Option, ProjectSelectConfig } from 'ngx-forge';
import { Filter, FilterConfig, FilterEvent, FilterField } from 'patternfly-ng';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'quickstart',
  templateUrl: './choose-quickstart.component.html'
})
export class ChooseQuickstartComponent implements OnInit {
  @Input() gui: Gui;
  @Input() form: FormGroup;
  config: ProjectSelectConfig = {
    classes: ['Node', 'Spring', 'WildFly', 'Vert'],
    techPreview: ['Node'],
    renderType: 'body'
  };
  filterConfig: FilterConfig;
  filtersText: string = '';
  private filteredInput: ForgeInput;

  ngOnInit(): void {
    let fields = [{
      id: 'name',
      title:  'Name',
      placeholder: 'Filter by Name...',
      type: 'text'
    }] as FilterField[];
    this.filterConfig = {
      fields: fields
    } as FilterConfig;
    this.filteredInput = new ForgeInput(this.gui.inputs[0]);
    this.reset();
  }

  filterChanged($event: FilterEvent): void {
    this.filtersText = '';
    $event.appliedFilters.forEach((filter) => {
      this.filtersText += filter.field.title + ' : ' + filter.value + '\n';
    });
    this.applyFilters($event.appliedFilters);
  }

  applyFilters(filters: Filter[]): void {
    this.filteredInput.valueChoices = [];
    if (filters && filters.length > 0) {
      this.gui.inputs[0].valueChoices.forEach((item) => {
        if (this.matchesFilters(item, filters)) {
          this.filteredInput.valueChoices.push(item);
        }
      });
    } else {
      this.reset();
    }
    this.filterConfig.resultsCount = this.filteredInput.valueChoices.length;
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

  private reset() {
    this.filteredInput.valueChoices = this.gui.inputs[0].valueChoices.slice(0);
  }
}

