import { Component, Input, OnInit } from '@angular/core';
import { Input as GuiInput, Option } from "app/space/forge-wizard/gui.model";
import * as marked from 'marked';

@Component({
  selector: 'pipeline-view',
  templateUrl: './pipeline-view.component.html',
  styleUrls: [ './pipeline-view.component.less' ]
})
export class PipelineViewComponent implements OnInit {


  @Input() field: GuiInput;
  constructor() {}

  ngOnInit() {
    console.log("PipelineView:::prior format" + JSON.stringify(this.field));
    this.addDisplay(this.field);
    console.log("PipelineView:::post format" + JSON.stringify(this.field));
  }
  private addDisplay(field: GuiInput) {
    let index: number = 0;
    for (let choice of field.valueChoices) {
      this.formatHtml(choice, field.valueChoices, index);
      index++;
    }
    // set the default for the first non validation step
    //TODO
    // selected choices should have choice display render in non collapsed mode
    //field.valueChoices.filter(c => c.selected === true).forEach(c => c.display.collapsed = false);
  }
  private determineColor(value: string): string {
    if (value) {
      const found = value.toLowerCase().includes('approve');
      if (found) {
        return 'warning';
      }
    }
    return 'success';
  };

  private determineIcon(value: any|string): string {
    if (value) {
      const found = value.toLowerCase().includes('approve');
      if (found) {
        return 'fa-pause-circle';
      }
    }
    return 'fa-check-circle';
  };
  private buildStages(value): Array<string> {
    let stages = [];
    let n: number = 0;
    for (let s of value.stages) {
      let stage = {
        name: s,
        index: n,
        icon: this.determineIcon(s),
        color: this.determineColor(s)
      };
      n++;
      stages.push(stage);

    }
    return stages;
  };

  private formatHtml(choice: Option, source: any, index: number) {
    choice.display = {
      isDefault: true,
      hasIcon: false,
      icon: 'fa fa-check',
      view: 'image',
      collapsed: false, //TODO only selected one should be collapsed
      collapsible: true,
      hasView: true,
      verticalLayout: true
    }
    choice.name = choice.id;

    if (choice.stages && choice.stages[0] && !choice.stages[0].name) { // deal with back button format ouput only once.
      choice.stages = this.buildStages(choice)
    }
    choice.description = choice.descriptionMarkdown;
    choice.description = choice.description.replace(/\n\n/g, '\n');
    let renderer = new marked.Renderer();
    choice.description = marked(choice.description, { renderer: renderer });
    choice.display.index = index;

    if (index === 0) {
      choice.display.isDefault = true;
      //choice.display.selected = true;
    }

  }
}
