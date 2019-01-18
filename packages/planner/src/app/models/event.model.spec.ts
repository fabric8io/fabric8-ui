import { Event, EventMapper, EventService, EventUI } from './event.model';

describe('Unit Test :: Events Model', () => {
  it('should execute the canary test', () => {
    return expect(true).toBe(true);
  });
  it('should correctly convert to ui model - 1', () => {
    const map = new EventMapper();
    const input: EventService = {
      attributes: {
        name: 'system.assignees',
        timestamp: '2018-05-27T08:54:44.63509Z',
      },
      id: '5e7adc1d-2c8a-440d-9466-aedf4b2d60c2',
      relationships: {
        modifier: {
          data: {
            id: '20694424-0841-4d6c-bfb5-bbbb0391b8db',
            links: {
              related:
                'https://api.prod-preview.openshift.io/api/users/20694424-0841-4d6c-bfb5-bbbb0391b8db',
            },
            type: 'identities',
          },
        },
        newValue: {
          data: [
            {
              id: '20694424-0841-4d6c-bfb5-bbbb0391b8db',
              type: 'users',
            },
          ],
        },
        oldValue: {
          data: [
            {
              id: '20694424-0841-4d6c-bfb5-bbbb0391b8db',
              type: 'users',
            },
          ],
        },
      },
      type: 'events',
    };
    const output: EventUI = map.toUIModel(input);
    const expectedOutPut: EventUI = {
      name: 'system.assignees',
      newValue: null,
      oldValue: null,
      timestamp: '2018-05-27T08:54:44.63509Z',
      modifierId: '20694424-0841-4d6c-bfb5-bbbb0391b8db',
      newValueRelationships: [
        {
          id: '20694424-0841-4d6c-bfb5-bbbb0391b8db',
          type: 'users',
        },
      ],
      oldValueRelationships: [
        {
          id: '20694424-0841-4d6c-bfb5-bbbb0391b8db',
          type: 'users',
        },
      ],
      type: null,
    };
    expect(expectedOutPut).toEqual(output);
  });

  it('should convert to ui model - 2', () => {
    const map = new EventMapper();
    const input: EventService = {
      attributes: {
        name: 'system.title',
        newValue: 'a',
        oldValue: 'b',
        timestamp: '2018-05-27T08:54:44.63509Z',
      },
      id: '5e7adc1d-2c8a-440d-9466-aedf4b2d60c2',
      relationships: {
        modifier: {
          data: {
            id: '20694424-0841-4d6c-bfb5-bbbb0391b8db',
            links: {
              related:
                'https://api.prod-preview.openshift.io/api/users/20694424-0841-4d6c-bfb5-bbbb0391b8db',
            },
            type: 'identities',
          },
        },
      },
      type: 'events',
    };
    const output = map.toUIModel(input);
    const expectedOutPut: EventUI = {
      name: 'system.title',
      newValue: 'a',
      oldValue: 'b',
      timestamp: '2018-05-27T08:54:44.63509Z',
      modifierId: '20694424-0841-4d6c-bfb5-bbbb0391b8db',
      newValueRelationships: [],
      oldValueRelationships: [],
      type: null,
    };
    expect(expectedOutPut).toEqual(output);
  });

  it('should correctly convert to ui model - 2', () => {
    const map = new EventMapper();
    const input: EventService = {
      attributes: {
        name: 'system.assignees',
        timestamp: '2018-05-27T08:54:44.63509Z',
      },
      id: '5e7adc1d-2c8a-440d-9466-aedf4b2d60c2',
      relationships: {
        modifier: {
          data: {
            id: '20694424-0841-4d6c-bfb5-bbbb0391b8db',
            links: {
              related:
                'https://api.prod-preview.openshift.io/api/users/20694424-0841-4d6c-bfb5-bbbb0391b8db',
            },
            type: 'identities',
          },
        },
      },
      type: 'events',
    };
    const output: EventUI = map.toUIModel(input);
    const expectedOutPut: EventUI = {
      name: 'system.assignees',
      newValue: null,
      oldValue: null,
      timestamp: '2018-05-27T08:54:44.63509Z',
      modifierId: '20694424-0841-4d6c-bfb5-bbbb0391b8db',
      newValueRelationships: [],
      oldValueRelationships: [],
      type: null,
    };
    expect(expectedOutPut).toEqual(output);
  });

  it('should correctly convert to ui model -3', () => {
    const map = new EventMapper();
    const input: EventService = {
      attributes: {
        name: 'system.assignees',
        newValue: null,
        oldValue: null,
        timestamp: '2018-05-27T08:54:44.63509Z',
      },
      id: '5e7adc1d-2c8a-440d-9466-aedf4b2d60c2',
      relationships: {
        modifier: {
          data: {
            id: '20694424-0841-4d6c-bfb5-bbbb0391b8db',
            links: {
              related:
                'https://api.prod-preview.openshift.io/api/users/20694424-0841-4d6c-bfb5-bbbb0391b8db',
            },
            type: 'identities',
          },
        },
        newValue: {
          data: [
            {
              id: '20694424-0841-4d6c-bfb5-bbbb0391b8db',
              type: 'users',
            },
          ],
        },
      },
      type: 'events',
    };
    const output: EventUI = map.toUIModel(input);
    const expectedOutPut: EventUI = {
      name: 'system.assignees',
      newValue: null,
      oldValue: null,
      timestamp: '2018-05-27T08:54:44.63509Z',
      modifierId: '20694424-0841-4d6c-bfb5-bbbb0391b8db',
      newValueRelationships: [
        {
          id: '20694424-0841-4d6c-bfb5-bbbb0391b8db',
          type: 'users',
        },
      ],
      oldValueRelationships: [],
      type: null,
    };
    expect(expectedOutPut).toEqual(output);
  });

  it('should correctly convert to ui model -4', () => {
    const map = new EventMapper();
    const input: EventService = {
      attributes: {
        name: 'system.assignees',
        newValue: null,
        oldValue: null,
        timestamp: '2018-05-27T08:54:44.63509Z',
      },
      id: '5e7adc1d-2c8a-440d-9466-aedf4b2d60c2',
      relationships: {
        modifier: {
          data: {
            id: '20694424-0841-4d6c-bfb5-bbbb0391b8db',
            links: {
              related:
                'https://api.prod-preview.openshift.io/api/users/20694424-0841-4d6c-bfb5-bbbb0391b8db',
            },
            type: 'identities',
          },
        },
        newValue: null,
        oldValue: null,
      },
      type: 'events',
    };
    const output: EventUI = map.toUIModel(input);
    const expectedOutPut: EventUI = {
      name: 'system.assignees',
      newValue: null,
      oldValue: null,
      timestamp: '2018-05-27T08:54:44.63509Z',
      modifierId: '20694424-0841-4d6c-bfb5-bbbb0391b8db',
      newValueRelationships: [],
      oldValueRelationships: [],
      type: null,
    };
    expect(expectedOutPut).toEqual(output);
  });

  it('should correctly convert to ui model - 5', () => {
    const map = new EventMapper();
    const input = {
      attributes: {
        name: 'system.assignees',
        timestamp: '2018-05-27T08:54:44.63509Z',
      },
      id: '5e7adc1d-2c8a-440d-9466-aedf4b2d60c2',
      relationships: {
        modifier: {
          data: {
            id: '20694424-0841-4d6c-bfb5-bbbb0391b8db',
            links: {
              related:
                'https://api.prod-preview.openshift.io/api/users/20694424-0841-4d6c-bfb5-bbbb0391b8db',
            },
            type: 'identities',
          },
        },
        newValue: {
          data: [
            {
              id: '20694424-0841-4d6c-bfb5-bbbb0391b8db',
              type: 'users',
            },
          ],
        },
        oldValue: {
          data: [
            {
              id: '20694424-0841-4d6c-bfb5-bbbb0391b8db',
              type: 'users',
            },
          ],
        },
        workItemType: {
          data: {
            id: '00000000-0000-0000-0000-000000000003',
            type: 'workitemtypes',
          },
          links: {
            self: 'http:///api/workitemtypes/00000000-0000-0000-0000-000000000003',
          },
        },
      },
      type: 'events',
    };
    const output: EventUI = map.toUIModel(input);
    const expectedOutPut: EventUI = {
      name: 'system.assignees',
      newValue: null,
      oldValue: null,
      timestamp: '2018-05-27T08:54:44.63509Z',
      modifierId: '20694424-0841-4d6c-bfb5-bbbb0391b8db',
      newValueRelationships: [
        {
          id: '20694424-0841-4d6c-bfb5-bbbb0391b8db',
          type: 'users',
        },
      ],
      oldValueRelationships: [
        {
          id: '20694424-0841-4d6c-bfb5-bbbb0391b8db',
          type: 'users',
        },
      ],
      type: null,
    };
    expect(expectedOutPut).toEqual(output);
  });

  it('should correctly convert to ui model - 6', () => {
    const map = new EventMapper();
    const input: EventService = {
      attributes: {
        name: 'system.title',
        newValue: 'abc',
        timestamp: '2018-05-27T08:54:44.63509Z',
      },
      id: '5e7adc1d-2c8a-440d-9466-aedf4b2d60c2',
      relationships: {
        modifier: {
          data: {
            id: '20694424-0841-4d6c-bfb5-bbbb0391b8db',
            links: {
              related:
                'https://api.prod-preview.openshift.io/api/users/20694424-0841-4d6c-bfb5-bbbb0391b8db',
            },
            type: 'identities',
          },
        },
      },
      type: 'events',
    };
    const output: EventUI = map.toUIModel(input);
    const expectedOutPut: EventUI = {
      name: 'system.title',
      newValue: 'abc',
      oldValue: null,
      timestamp: '2018-05-27T08:54:44.63509Z',
      modifierId: '20694424-0841-4d6c-bfb5-bbbb0391b8db',
      newValueRelationships: [],
      oldValueRelationships: [],
      type: null,
    };
    expect(expectedOutPut).toEqual(output);
  });

  it('should correctly convert to ui model - 7', () => {
    const map = new EventMapper();
    const input: EventService = {
      attributes: {
        name: 'system.title',
        newValue: ['a', 'b', 'c'],
        oldValue: ['c', 'b'],
        timestamp: '2018-05-27T08:54:44.63509Z',
      },
      id: '5e7adc1d-2c8a-440d-9466-aedf4b2d60c2',
      relationships: {
        modifier: {
          data: {
            id: '20694424-0841-4d6c-bfb5-bbbb0391b8db',
            links: {
              related:
                'https://api.prod-preview.openshift.io/api/users/20694424-0841-4d6c-bfb5-bbbb0391b8db',
            },
            type: 'identities',
          },
        },
      },
      type: 'events',
    };
    const output: EventUI = map.toUIModel(input);
    const expectedOutPut: EventUI = {
      name: 'system.title',
      newValue: 'a, b, c',
      oldValue: 'c, b',
      timestamp: '2018-05-27T08:54:44.63509Z',
      modifierId: '20694424-0841-4d6c-bfb5-bbbb0391b8db',
      newValueRelationships: [],
      oldValueRelationships: [],
      type: null,
    };
    expect(expectedOutPut).toEqual(output);
  });

  it('should correctly convert to ui model - 8', () => {
    const map = new EventMapper();
    const input: EventService = {
      attributes: {
        name: 'system.title',
        newValue: [1, 2],
        oldValue: [3, 4],
        timestamp: '2018-05-27T08:54:44.63509Z',
      },
      id: '5e7adc1d-2c8a-440d-9466-aedf4b2d60c2',
      relationships: {
        modifier: {
          data: {
            id: '20694424-0841-4d6c-bfb5-bbbb0391b8db',
            links: {
              related:
                'https://api.prod-preview.openshift.io/api/users/20694424-0841-4d6c-bfb5-bbbb0391b8db',
            },
            type: 'identities',
          },
        },
      },
      type: 'events',
    };
    const output: EventUI = map.toUIModel(input);
    const expectedOutPut: EventUI = {
      name: 'system.title',
      newValue: '1, 2',
      oldValue: '3, 4',
      timestamp: '2018-05-27T08:54:44.63509Z',
      modifierId: '20694424-0841-4d6c-bfb5-bbbb0391b8db',
      newValueRelationships: [],
      oldValueRelationships: [],
      type: null,
    };
    expect(expectedOutPut).toEqual(output);
  });

  it('should correctly convert to ui model - 9 (workitem type)', () => {
    const map = new EventMapper();
    const input = {
      attributes: {
        name: 'workitemtype',
        revisionId: '3dd9e742-8f2e-431c-8640-c849c42f017d',
        timestamp: '2018-08-21T11:40:32.57375Z',
      },
      id: '2b177029-415b-4b5d-9712-550b93536637',
      relationships: {
        modifier: {
          data: {
            id: 'b46c89ce-6a6d-4763-ad87-aad8da06e983',
            links: {
              related:
                'https://api.prod-preview.openshift.io/api/users/b46c89ce-6a6d-4763-ad87-aad8da06e983',
            },
            type: 'users',
          },
          links: {
            related:
              'https://prod-preview.openshift.io/api/users/b46c89ce-6a6d-4763-ad87-aad8da06e983',
            self:
              'https://prod-preview.openshift.io/api/users/b46c89ce-6a6d-4763-ad87-aad8da06e983',
          },
        },
        newValue: {
          data: [
            {
              id: '03b9bb64-4f65-4fa7-b165-494cd4f01401',
              type: 'workitemtypes',
            },
          ],
        },
        oldValue: {
          data: [
            {
              id: '5182fc8c-b1d6-4c3d-83ca-6a3c781fa18a',
              type: 'workitemtypes',
            },
          ],
        },
        workItemType: {
          data: {
            id: '03b9bb64-4f65-4fa7-b165-494cd4f01401',
            type: 'workitemtypes',
          },
          links: {
            self:
              'https://prod-preview.openshift.io/api/workitemtypes/03b9bb64-4f65-4fa7-b165-494cd4f01401',
          },
        },
      },
      type: 'events',
    };
    const output: EventUI = map.toUIModel(input);
    const expectedOutPut: EventUI = {
      name: 'workitemtype',
      newValue: null,
      oldValue: null,
      timestamp: '2018-08-21T11:40:32.57375Z',
      modifierId: 'b46c89ce-6a6d-4763-ad87-aad8da06e983',
      newValueRelationships: [
        {
          id: '03b9bb64-4f65-4fa7-b165-494cd4f01401',
          type: 'workitemtypes',
        },
      ],
      oldValueRelationships: [
        {
          id: '5182fc8c-b1d6-4c3d-83ca-6a3c781fa18a',
          type: 'workitemtypes',
        },
      ],
      type: null,
    };
    expect(expectedOutPut).toEqual(output);
  });
});
