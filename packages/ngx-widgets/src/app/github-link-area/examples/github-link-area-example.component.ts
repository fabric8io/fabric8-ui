import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'github-link-area-example',
  styles: [
    `
      .sample-form .form-horizontal .form-group {
        margin-left: 0;
      }
      .padding-top-15 {
        padding-top: 15px;
      }
      .padding-bottom-15 {
        padding-bottom: 15px;
      }
    `,
  ],
  templateUrl: './github-link-area-example.component.html',
})
export class GitHubLinkAreaExampleComponent implements OnInit {
  content: string = `There is some text in here.
    And some checkboxes:<ul>
    <li><input type="checkbox" data-checkbox-index="0"></input>An Item.</li>
    <li><input type="checkbox" checked="" data-checkbox-index="1"></input>Checked Item.</li>
    </ul>
    For input events, see the browser console.<br>
    <a href="https://github.com/patternfly/patternfly-ng/issues/127">
    https://github.com/patternfly/patternfly-ng/issues/127</a>.
    And some more text. And another issue link:
    <a href="https://github.com/patternfly/patternfly-ng/issues/111" rel="nofollow">
    https://github.com/patternfly/patternfly-ng/issues/111</a>.
    And for testing purposes, the same link as the first as a dupe:
    <a href="https://github.com/patternfly/patternfly-ng/issues/127" rel="nofollow">
    https://github.com/patternfly/patternfly-ng/issues/127</a>.
    Note: the link html formatting is following the currently used OSIO server
    side link markdown formatting. It may need changes
    if used with a different markdown compiler`;

  constructor() {}

  ngOnInit(): void {}

  inputEvent(event: any) {
    console.log(
      'Input Event detected on input type: ' + event.type + ' with index ' + event.extraData,
    );
  }
}
