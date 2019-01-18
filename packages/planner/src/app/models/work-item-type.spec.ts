import { WorkItemTypeMapper, WorkItemTypeService, WorkItemTypeUI } from './work-item-type';

describe('WorkItemTypeMapper', () => {
  let workItemTypeMapper: WorkItemTypeMapper;
  let workItemTypeUI: WorkItemTypeUI;
  let workItemTypeService: WorkItemTypeService;

  workItemTypeUI = {
    id: '',
    name: '',
    icon: '',
    version: 0,
    childTypes: [
      { id: 'bbf35418-04b6-426c-a60b-7f80beb0b624', type: 'workitemtypes' },
      { id: '26787039-b68f-4e28-8814-c2f93be1ef4e', type: 'workitemtypes' },
    ],
    fields: {
      'system.area': {
        description: 'The area to which the work item belongs',
        label: 'Area',
        required: false,
        type: {
          kind: 'area',
        },
      },
    },
    description: 'no info-tip',
    dynamicfields: [],
    type: 'workitemtypes',
  } as WorkItemTypeUI;

  workItemTypeService = {
    id: '',
    type: 'workitemtypes',
    attributes: {
      name: '',
      version: 0,
      icon: '',
      fields: {
        'system.area': {
          description: 'The area to which the work item belongs',
          label: 'Area',
          required: false,
          type: {
            kind: 'area',
          },
        },
      },
    },
    relationships: {
      guidedChildTypes: {
        data: [
          { id: 'bbf35418-04b6-426c-a60b-7f80beb0b624', type: 'workitemtypes' },
          { id: '26787039-b68f-4e28-8814-c2f93be1ef4e', type: 'workitemtypes' },
        ],
      },
    },
  } as WorkItemTypeService;

  beforeEach(() => {
    workItemTypeMapper = new WorkItemTypeMapper();
  });

  it('should execute the canary test', () => {
    return expect(true).toBe(true);
  });

  it('should correctly convert to service model - 1', () => {
    expect(workItemTypeMapper.toServiceModel(workItemTypeUI)).toEqual(workItemTypeService);
  });

  it('should correctly convert to UI model - 2', () => {
    expect(workItemTypeMapper.toUIModel(workItemTypeService)).toEqual(workItemTypeUI);
  });

  it('should correctly convert to UI model - 3', () => {
    workItemTypeService.attributes.fields = {
      ...workItemTypeService.attributes.fields,
      ...{
        dynamicfield: {
          description: 'This is a dynamic field',
          label: 'DF',
          required: false,
          type: {
            kind: 'enum',
          },
        },
      },
    };
    workItemTypeUI.fields = {
      ...workItemTypeUI.fields,
      ...{
        dynamicfield: {
          description: 'This is a dynamic field',
          label: 'DF',
          required: false,
          type: {
            kind: 'enum',
          },
        },
      },
    };
    workItemTypeUI['dynamicfields'] = ['dynamicfield'];
    expect(workItemTypeMapper.toUIModel(workItemTypeService)).toEqual(workItemTypeUI);
  });
});
