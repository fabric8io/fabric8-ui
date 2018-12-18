import { async } from '@angular/core/testing';

import { IterationMapper, IterationService, IterationUI } from './iteration.model';

describe('IterationMapper', () => {
  let iterationMapper: IterationMapper;
  let iterationUI: IterationUI;
  let iterationService: IterationService;

  iterationUI = {
    id: '',
    name: '',
    parentPath: '',
    resolvedParentPath: '',
    userActive: false,
    isActive: false,
    startAt: '',
    endAt: '',
    description: '',
    state: 'new',
    link: '',
    workItemTotalCount: 0,
    workItemClosedCount: 0,
    parentId: 'parent_01',
    hasChildren: false,
    selected: false,
    showChildren: false,
  } as IterationUI;

  iterationService = {
    attributes: {
      user_active: false,
      name: '',
      description: '',
      state: 'new',
      parent_path: '',
      resolved_parent_path: '',
      startAt: '',
      endAt: '',
      active_status: false,
    },
    id: '',
    links: {
      self: '',
    },
    relationships: {
      parent: {
        data: {
          id: 'parent_01',
          type: 'iterations',
        },
      },
      workitems: {
        meta: {
          total: 0,
          closed: 0,
        },
      },
    },
    hasChildren: false,
    type: 'iterations',
  } as IterationService;

  beforeEach(async(() => {
    iterationMapper = new IterationMapper();
  }));

  it('should execute the canary test', () => {
    return expect(true).toBe(true);
  });

  it('should correctly convert to service model - 1', () => {
    expect(iterationMapper.toServiceModel(iterationUI)).toEqual(iterationService);
  });

  it('should correctly convert to UI model - 2', () => {
    expect(iterationMapper.toUIModel(iterationService)).toEqual(iterationUI);
  });
});
