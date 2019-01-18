import * as ui from '../../ui';

export class Iteration extends ui.BaseElement {
  iterationDialog = new ui.BaseElement(this.$('.modal-content'), 'iteration Dialog');
  iterationName = new ui.TextInput(
    this.iterationDialog.$('#iteration-name'),
    'Iteration text input',
  );
  parentIteration = new ui.TextInput(
    this.iterationDialog.$('#parent-iteration'),
    'parent iteration',
  );
  parentDropdownList = new ui.DropdownMenu(this.iterationDialog.$('.f8-iteration-modal-list'));
  parentDropdown = new ui.Dropdown(
    this.parentIteration,
    this.parentDropdownList,
    'parent iteration dropdown',
  );
  createIterationButton = new ui.Button(
    this.iterationDialog.$('#create-iteration-button'),
    'Create Iteration button',
  );
  datePickerDiv = new ui.BaseElement(this.$('.datepicker-container'), 'date picker div');
  private showStartDateCalendar = new ui.Clickable(
    this.datePickerDiv.$$('.selection.inputnoteditable').first(),
    'start date calendar',
  );
  private showEndDateCalendar = new ui.Clickable(
    this.datePickerDiv.$$('.selection.inputnoteditable').last(),
    'End date calendar',
  );
  calendarDiv = new ui.BaseElement(this.$('.selector.selectorarrow.selectorarrowleft'), '');
  selectStartdate = new ui.Clickable(this.$$('.datevalue.currmonth').first(), ' select start date');
  selectEndDate = new ui.Clickable(this.$$('.datevalue.currmonth').last(), ' select end date');
  month = new ui.Clickable(this.$('.headermonthtxt'), 'month');
  year = new ui.Clickable(this.$('.headeryeartxt .headerlabelbtn'), 'year');
  cancel = new ui.Button(
    this.iterationDialog.$('#cancel-iteration-button'),
    'Cancel Iteration button',
  );

  async addNewIteration(iterationName: string, parentIteration?: string, withDates?: boolean) {
    await this.iterationName.enterText(iterationName);
    if (parentIteration) {
      await this.parentIteration.enterText(parentIteration);
      await this.parentDropdown.select(parentIteration);
    }
    if (withDates) {
      await this.selectCalendarDate();
    }
  }

  async editIteration(iterationName: string) {
    await this.iterationName.clear();
    await this.iterationName.enterText(iterationName);
    await this.createIterationButton.clickWhenReady();
    await this.createIterationButton.untilHidden();
  }

  async selectCalendarDate() {
    await this.showStartDateCalendar.clickWhenReady();
    await this.selectStartdate.clickWhenReady();
    await this.showEndDateCalendar.clickWhenReady();
    await this.selectEndDate.clickWhenReady();
  }

  async getMonth(): Promise<String> {
    await this.showStartDateCalendar.clickWhenReady();
    let month = await this.month.getTextWhenReady();
    return month;
  }

  async getYear(): Promise<String> {
    let year = await this.year.getTextWhenReady();
    return year;
  }

  async clickCreateIteration() {
    await this.createIterationButton.clickWhenReady();
    await this.createIterationButton.untilHidden();
  }

  async getLastDayOfMonth(): Promise<String> {
    let day = await this.selectEndDate.getAttribute('innerText');
    return day;
  }

  async clickCancel() {
    await this.cancel.clickWhenReady();
    await this.cancel.untilHidden();
  }
}
