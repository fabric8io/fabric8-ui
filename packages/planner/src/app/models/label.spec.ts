import { async } from '@angular/core/testing';

import { LabelMapper, LabelService, LabelUI } from './label.model';

describe('LabelMapper', () => {
  let labelMapper: LabelMapper;
  let labelUI: LabelUI;
  let labelService: LabelService;

  labelUI = {
    id: '',
    name: '',
    backgroundColor: '',
    version: 0,
    borderColor: '',
    textColor: '',
  } as LabelUI;

  labelService = {
    id: '',
    type: 'labels',
    attributes: {
      name: '',
      version: 0,
      'background-color': '',
      'border-color': '',
      'text-color': '',
    },
  } as LabelService;

  beforeEach(async(() => {
    labelMapper = new LabelMapper();
  }));

  it('should execute the canary test', () => {
    return expect(true).toBe(true);
  });

  it('should correctly convert to service model - 1', () => {
    expect(labelMapper.toServiceModel(labelUI)).toEqual(labelService);
  });

  it('should correctly convert to UI model - 2', () => {
    expect(labelMapper.toUIModel(labelService)).toEqual(labelUI);
  });
});
