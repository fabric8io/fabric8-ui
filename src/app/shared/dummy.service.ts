import { Injectable } from '@angular/core';

import { ProcessTemplate } from 'ngx-fabric8-wit';

@Injectable()
export class DummyService {

  readonly PROCESS_TEMPLATES: ProcessTemplate[] = [
    {
      name: 'Scenario Driven Planning',
      description: `An agile development methodology focused on real-world problems, or Scenarios, described in the language and from the viewpoint of the user. Scenarios deliver particular Value Propositions and are realized via Experiences.`
    }
  ];

  constructor() {}

  get processTemplates(): ProcessTemplate[] {
    return this.PROCESS_TEMPLATES;
  }
}
