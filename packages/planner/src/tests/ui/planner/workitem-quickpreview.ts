import { $, $$, browser, by, ElementFinder, Key } from 'protractor';
import * as support from './../../support';
import * as ui from './../../ui';

export class WorkItemQuickPreview extends ui.BaseElement {
  // TODO - move loading animation out of here. It doesn't belong here.
  loadingAnimation = new ui.BaseElementArray($$('.spinner'), 'Loading spinner animation');
  notificationToast = new ui.BaseElementArray($$('pfng-toast-notification'), 'Notification Toast');
  /* UI elements of the Top section of the workitem preview */
  closeButton = new ui.Button(this.$('.f8-detail--close'), 'WorkItem Quick Preview close button');
  iterationDropdownCloseButton = new ui.Button(
    this.$('.iteration-dropdown .close-pointer'),
    'Iteration dropdown close button',
  );
  areaDropdownCloseButton = new ui.Button(
    this.$('.area-dropdown .close-pointer'),
    'Area dropdown close button',
  );
  typeDropdownCloseButton = new ui.Button(
    this.$('.type-dropdown .close-pointer'),
    'Type dropdown close button',
  );
  stateDropdownCloseButton = new ui.Button(
    this.$('.state-dropdown .close-pointer'),
    'State dropdown close button',
  );
  stateDiv = new ui.BaseElement(this.$('.state-dropdown'), 'State dropdown toggle');
  stateDropdown = new ui.Dropdown(
    this.stateDiv.$('f8-select-dropdown .dropdown-toggle'),
    this.stateDiv.$('.select-dropdown-menu'),
    'State select dropdown',
    'li>div>.item-value',
  );
  typeDiv = new ui.BaseElement(this.$('.type-dropdown'), 'Type dropdown toggle');
  typeDropdown = new ui.Dropdown(
    this.typeDiv.$('f8-select-dropdown .dropdown-toggle'),
    this.typeDiv.$('.select-dropdown-menu'),
    'Type select dropdown',
    'li>div>.item-value',
  );
  fullDetailButton = new ui.Clickable(this.$('span.dib'), 'View full details button');
  titleDiv = new ui.BaseElement(this.$('#wi-title-div'), 'Workitem title div');
  titleInput = new ui.TextInput(this.titleDiv.$('textarea'), 'WorkItem Title Input');
  titleSaveButton = new ui.Button(
    this.titleDiv.$('.inlineinput-btn-save'),
    'WorkItem Title Save button',
  );
  titleCancelButton = new ui.Button(
    this.titleDiv.$('.inlineinput-btn-cancel'),
    'Workitem Title cancel button',
  );
  titleErrorMessage = new ui.BaseElement(
    this.$('.error-message small'),
    'WorkItem Title error message',
  );
  linkCount = new ui.Clickable(this.$('#wi-link-total'), 'work item link total');

  /* UI elements for the middle section of the workitem preview */
  assigneeSection = new ui.BaseElement(this.$('.f8-detail__assignee'), ' assignee section');
  assigneeDropdownSelector = new ui.BaseElement(this.$('assignee-selector'), ' assignee selector');
  assigneeDropdown = new ui.Dropdown(
    this.$('#f8-add-assignee'),
    this.$('assignee-selector ul.select-dropdown-menu'),
    'Assignee Select dropdown',
  );
  assigneeDropdownCloseButton = new ui.Button(
    this.$('#f8-add-assignee-dropdown .close-pointer'),
    'Assignee dropdown close button',
  );
  assigneeDropdownMenu = new ui.BaseElement(
    this.$('assignee-selector div.select-dropdown'),
    'Assignee dropdown menu',
  );
  assigneeDiv = new ui.BaseElement(this.$('f8-assignee'), 'Assignee List Div');
  areaDiv = new ui.BaseElement(this.$('.area-dropdown'), 'Area List Div');
  areaDropdown = new ui.Dropdown(
    this.areaDiv.$('f8-select-dropdown .dropdown-toggle'),
    this.areaDiv.$('.select-dropdown-menu'),
    'Area select dropdown',
    'li>div>.item-value',
  );

  iterationDiv = new ui.BaseElement(this.$('.iteration-dropdown'), 'Iteration List Div');
  iterationDropdown = new ui.Dropdown(
    this.iterationDiv.$('f8-select-dropdown .dropdown-toggle'),
    this.iterationDiv.$('.select-dropdown-menu'),
    'Iteration select dropdown',
    'li>div>.item-value',
  );
  iterationInput = new ui.TextInput(
    this.iterationDiv.$('.select-dropdown-search-input'),
    'Iteration input',
  );

  labelDropdown = new ui.Dropdown(
    this.$('#labelSelector .add-label'),
    this.$('#labelSelector ul.select-dropdown-menu'),
    'Label Select dropdown',
  );
  labelsDiv = new ui.BaseElement(this.$('.f8-detail__labels'), ' labels Div');
  labels = new ui.BaseElement(this.labelsDiv.$('.label-wrapper'), ' labels ');
  labelListDiv = new ui.BaseElementArray(
    this.labelsDiv.$$('f8-label .label-wrapper>span'),
    'label list Div',
  );
  labelDropDownDiv = new ui.BaseElement(this.$('#labelSelector .select-dropdown'), 'dropdown div');
  labelDropdownCloseButton = new ui.Clickable(
    this.labelDropDownDiv.$('.close-pointer'),
    'label dropdown close Button',
  );
  createLabelButton = new ui.Clickable(
    this.labelDropDownDiv.$('.create-label-button'),
    'Create new label',
  );
  createLabelDiv = new ui.BaseElement(this.$('.create-label'), 'create label div');
  createLabelInput = new ui.TextInput(
    this.createLabelDiv.$('.create-label-input'),
    'create label input',
  );
  createLabelCancel = new ui.Button(this.createLabelDiv.$('.pficon-close'), 'create label cancel');
  createLabelSaveButton = new ui.Button(
    this.createLabelDiv.$('.fa-check'),
    'create label save button',
  );

  descriptionDiv = new ui.BaseElement(this.$('#wi-desc-div'), 'WorkItem Description Div');
  descriptionEditIcon = new ui.Clickable(
    this.descriptionDiv.$('i'),
    'WorkItem Description Edit icon',
  );
  descriptionTextarea = new ui.TextInput(
    this.descriptionDiv.$('.editor-box'),
    'WorkItem Description Input',
  );
  descriptionSaveButton = new ui.Button(
    this.descriptionDiv.$('.action-btn.btn-save'),
    'WorkItem Description Save Button',
  );
  descriptionCancelButton = new ui.Button(
    this.descriptionDiv.$$('.action-btn.btn').first(),
    'WorkItem Description Save Button',
  );
  creatorusername = new ui.BaseElement(this.$('#WI_details_reporter_user'), 'WorkItem creator div');
  creatorAvatar = new ui.BaseElement(this.$('#WI_details_reporter_img>img'), 'Creator Avatar URL');
  /* UI elements for the bottom section of the workitem preview */
  linksDiv = new ui.BaseElement($('#wi-link'), 'WorkItem links div');
  linksToggleButton = new ui.Clickable(
    this.linksDiv.$('.f8-toggle-caret'),
    'WorkItem Links toggle button',
  );
  linkTypeDiv = new ui.BaseElement(this.$('#wi-link-type'), 'Link type List Div');
  linkTypeDropdown = new ui.Dropdown(
    this.linkTypeDiv.$('f8-select-dropdown .dropdown-toggle'),
    this.linkTypeDiv.$('.select-dropdown-menu'),
    'Link type select dropdown',
    'li>div>.item-value',
  );

  linkSearchDiv = new ui.BaseElement(this.$('#workitem-link-search'), 'Link search List Div');
  linkSearchDropdown = new ui.Dropdown(
    this.linkSearchDiv.$('f8-select-dropdown .dropdown-toggle'),
    this.linkSearchDiv.$('.select-dropdown-menu'),
    'Link item search dropdown',
    'li>div>.item-value',
  );
  searchWorkItem = new ui.TextInput(
    this.linkSearchDiv.$('input.select-dropdown-search-input'),
    'Workitem search',
  );

  workItemList = new ui.BaseElementArray(
    this.linkSearchDiv.$$('.select-dropdown-menu li'),
    'work item list',
  );

  linkButton = new ui.Button(this.linksDiv.$('#bind-link'), 'link Button');
  linklistItem = new ui.BaseElement(this.$('#wi-link .f8-link__list-item'), 'link lst item');

  commentsToggleButton = new ui.Clickable(
    $('#wi-comment .f8-toggle-caret'),
    'WorkItem Comments toggle button',
  );
  creationTimeDiv = new ui.BaseElement(this.$('#created_at'), 'WorkItem creation time div');

  commentDiv = new ui.BaseElement(this.$('.f8-comment--input'), 'comments div field');
  commentsField = new ui.Clickable(
    this.commentDiv.$('.editor-box.editor-preview.placeholder'),
    'comments clickable field',
  );
  commentsInputField = new ui.TextInput(
    this.commentDiv.$('.editor-box.editor-markdown'),
    'comment input field',
  );
  commentSaveButton = new ui.Button(this.commentDiv.$('.btn-save'), 'Comment save button');
  commentCancelButton = new ui.Button(
    this.commentDiv.$('.fl.btn.btn-default.pull-right.action-btn'),
    'Comment cancel button',
  );
  commentsText = new ui.BaseElementArray(
    this.$$('.f8-comment-body .comment .editor-box.editor-preview'),
    'Comment List',
  );
  commentsCount = new ui.BaseElement(this.$('#total_comments'), 'comment count');
  commentsEditIcon = new ui.Clickable(
    this.commentDiv.$('.edit-icon'),
    'comments clickable edit icon',
  );

  /* UI elements for the Agile template of the workitem preview */
  effortTextArea = new ui.TextInput(this.$('[placeholder="Effort"]'), 'effort textarea');
  workItemsGroup = new ui.Clickable(
    this.element(by.cssContainingText('alm-dynamic-field .f8-dynamic-control', ' Work Items ')),
    'Side panel WorkItem button',
  );
  businessValue = new ui.TextInput(
    this.$('textarea[placeholder="Business Value"]'),
    ' Business value textarea',
  );
  storyPoints = new ui.TextInput(
    this.$('textarea[placeholder="Storypoints"]'),
    ' Storypoints textarea',
  );
  dynamicFieldDiv = new ui.BaseElement(
    this.element(by.xpath("//textarea[@placeholder='Storypoints']/ancestor::f8-inlineinput")),
  );
  dynamicFieldSaveButton = new ui.Button(
    this.dynamicFieldDiv.$('.inlineinput-btn-save'),
    'Dynamic Fields Save Button',
  );

  constructor(ele: ElementFinder, name: string = '') {
    super(ele, name);
  }

  async ready() {
    support.debug('... check if WorkItem preview is Ready');
    await super.ready();
    await this.closeButton.ready();
    await this.titleDiv.ready();
    await this.descriptionDiv.ready();
    await this.linksToggleButton.ready();
    await this.commentsToggleButton.ready();
    support.debug('... check if WorkItem preview is Ready - OK');
  }

  async addAssignee(assignee: string) {
    await this.loadingAnimation.untilCount(0);
    await this.assigneeDropdown.clickWhenReady();
    await this.assigneeDropdown.select(assignee);
    await this.assigneeDropdownCloseButton.clickWhenReady();
    await this.loadingAnimation.untilCount(0);
  }

  async addArea(areaTitle: string) {
    await this.loadingAnimation.untilCount(0);
    await browser.sleep(2000);
    await this.areaDropdown.clickWhenReady();
    await this.areaDropdown.select(areaTitle);
    await this.loadingAnimation.untilCount(0);
  }

  async addIteration(iterationTitle: string) {
    await this.loadingAnimation.untilCount(0);
    await browser.sleep(2000);
    await this.iterationDropdown.clickWhenReady();
    await this.iterationDropdown.select(iterationTitle);
  }

  async typeaHeadSearch(iterationTitle: string) {
    await this.loadingAnimation.untilCount(0);
    await this.iterationDropdown.clickWhenReady();
    await this.iterationInput.enterText(iterationTitle);
  }

  private async addComment(comment: string) {
    await this.loadingAnimation.untilCount(0);
    await this.commentsEditIcon.clickWhenReady();
    await this.commentsInputField.enterText(comment);
  }

  async addCommentAndSave(comment: string) {
    await this.ready();
    let count = await this.commentsCount.getTextWhenReady();
    await this.addComment(comment);
    await this.commentSaveButton.clickWhenReady();
    await this.commentSaveButton.untilHidden();
    count = (parseInt(count) + 1).toString();
    await this.commentsCount.untilTextIsPresent(count);
  }

  async addCommentAndCancel(comment: string) {
    await this.addComment(comment);
    await this.commentCancelButton.clickWhenReady();
  }

  async addLabel(label: string, unassignLabel = false) {
    await this.labelDropdown.clickWhenReady();
    await this.labelDropdown.select(label);
    await this.labelDropdownCloseButton.clickWhenReady();
    await this.loadingAnimation.untilCount(0);
    if (!unassignLabel) {
      await this.labels.untilTextIsPresent(label);
    }
  }

  async addLink(linkType: string, workItem: string) {
    await this.linksDiv.untilTextIsPresent('Links');
    // Open link section in detail page
    await this.linksToggleButton.clickWhenReady();

    // Open link type dropdown
    await this.linkTypeDropdown.clickWhenReady();
    await this.linkTypeDropdown.select(linkType);

    // Open search work item dropdown
    await this.linkSearchDropdown.clickWhenReady();
    await this.searchWorkItem.enterText(workItem);
    // Needs further investigation, test throws Stale Element without sleep
    await browser.sleep(2000);
    await this.workItemList.untilCount(1);
    await this.linkSearchDropdown.select(workItem);

    // Create link
    await this.linkButton.untilTextIsPresent('Create Link');
    await this.linkButton.clickWhenReady();
    await this.linklistItem.untilTextIsPresent(workItem);
  }

  async removeLink(workItem: string) {
    await new ui.BaseElement(
      this.element(
        by.xpath(
          "//li[contains(@class,'f8-link__list-item')][.//span[contains(text(), '" +
            workItem +
            "')]]",
        ),
      ).$('.pficon-close'),
      'remove link button',
    ).clickWhenReady();
  }

  async createNewLabel(label: string, isPressEnter: boolean = false) {
    await this.labelDropdown.clickWhenReady();
    await this.createLabelButton.clickWhenReady();
    await this.createLabelInput.enterText(label);
    if (isPressEnter) {
      await this.createLabelInput.pressEnter();
    } else {
      await this.createLabelSaveButton.clickWhenReady();
    }
    await this.labelDropdown.select(label);
    await this.labelDropdownCloseButton.clickWhenReady();
    await this.loadingAnimation.untilCount(0);
  }

  async close() {
    await this.closeButton.clickWhenReady();
  }

  async getArea() {
    await this.loadingAnimation.untilCount(0);
    let area = await this.areaDropdown.getTextWhenReady();
    return area;
  }

  async getCreator() {
    await this.loadingAnimation.untilCount(0);
    // We need the explicit sleep since the creator name doesn't load instantly
    await browser.sleep(3000);
    let creator = await this.creatorusername.getTextWhenReady();
    return creator;
  }

  async getCreatorAvatar() {
    await this.loadingAnimation.untilCount(0);
    let creator = await this.creatorAvatar.getAttribute('src');
    return creator;
  }

  async getAssignees() {
    await this.loadingAnimation.untilCount(0);
    await this.assigneeDiv.untilDisplayed();
    await browser.sleep(5000);
    let assigneeList = await this.assigneeDiv.getTextWhenReady();
    return assigneeList;
  }

  async getComments() {
    await this.ready();
    await this.commentDiv.scrollIntoView();
    let commentList: String = '';
    if (await this.commentsText.isPresent()) {
      commentList = await this.commentsText.getTextWhenReady();
    }
    return commentList;
  }

  async getCreationTime() {
    let origTime = await this.creationTimeDiv.getTextWhenReady();
    return origTime;
  }

  async getDescription() {
    return this.descriptionTextarea.getTextWhenReady();
  }

  async getIteration() {
    await this.loadingAnimation.untilCount(0);
    await browser.sleep(1000);
    let iteration = await this.iterationDropdown.getTextWhenReady();
    return iteration;
  }

  async getType() {
    await this.loadingAnimation.untilCount(0);
    let type = await this.typeDropdown.getTextWhenReady();
    return type;
  }

  async getState() {
    await this.loadingAnimation.untilCount(0);
    let state = await this.stateDropdown.getTextWhenReady();
    return state;
  }

  async getLabels() {
    let labelList = await this.labelListDiv.getTextWhenReady();
    return labelList;
  }

  async getLinkedItems() {
    let linkList = await this.linklistItem.getTextWhenReady();
    return linkList;
  }

  async updateTitle(title: string, append: boolean = false) {
    await this.titleDiv.clickWhenReady();
    if (!append) {
      await this.titleInput.clear();
    }
    await this.titleInput.enterText(title);
    await this.titleSaveButton.clickWhenReady();
    await browser.sleep(2000);
    await this.titleInput.untilTextIsPresentInValue(title);
  }

  async updateDescription(description: string, append: boolean = false) {
    await this.openDescriptionBox();
    if (!append) {
      await this.descriptionTextarea.clear();
    }
    await this.descriptionTextarea.enterText(description);
    await this.descriptionSaveButton.scrollIntoView();
    await this.descriptionSaveButton.clickWhenReady();
    await this.descriptionSaveButton.untilHidden();
  }

  async openDescriptionBox() {
    await browser
      .actions()
      .mouseMove(this.descriptionDiv)
      .perform();
    await this.descriptionEditIcon.clickWhenReady();
  }

  async isSaveButtonDisplayed() {
    try {
      return await this.descriptionSaveButton.isDisplayed();
    } catch (exception) {
      return false;
    }
  }

  async removeAssignee(assignee: string) {
    // Removing the assignee is exactly similar to adding an assignee
    await this.addAssignee(assignee);
  }

  async getTitleError() {
    return this.titleErrorMessage.getTextWhenReady();
  }

  async changeStateTo(state: string) {
    await this.loadingAnimation.untilCount(0);
    await browser.sleep(2000);
    await this.stateDropdown.clickWhenReady();
    await this.stateDropdown.select(state);
    await this.loadingAnimation.untilCount(0);
    await this.stateDropdown.untilTextIsPresent(state);
  }

  async changeTypeTo(type: string) {
    await this.loadingAnimation.untilCount(0);
    await browser.sleep(2000);
    await this.typeDropdown.clickWhenReady();
    await this.typeDropdown.select(type);
    await this.loadingAnimation.untilCount(0);
  }

  /* Agile Template */
  async updateEffort(effort: string) {
    await this.effortTextArea.enterText(effort);
    await this.effortTextArea.sendKeys(Key.ENTER);
  }

  async updateBusinessValue(businessValue: string) {
    await this.businessValue.enterText(businessValue);
    await this.businessValue.sendKeys(Key.ENTER);
  }

  async isDynamicFieldSaveButtonDisplayed() {
    try {
      return await this.dynamicFieldSaveButton.isDisplayed();
    } catch (exception) {
      return false;
    }
  }
}
