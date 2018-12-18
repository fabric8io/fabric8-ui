import { BoardModelUI } from './../models/board.model';

export const spaceTemplateResponse = {
  data: {
    attributes: {
      'can-co;nstruct': true,
      'created-at': '0001-01-01T00:00:00Z',
      description:
        'An agile development methodology focused on real-world problems, or Scenarios, described in the language and from the viewpoint of the user. Scenarios deliver particular Value Propositions and are realized via Experiences.\n',
      name: 'Scenario Driven Development',
      'updated-at': '2018-07-03T06:55:35.231695Z',
      version: 0,
    },
    id: '929c963a-174c-4c37-b487-272067e88bd4',
    links: {
      self:
        'https://api.prod-preview.openshift.io/api/spacetemplates/929c963a-174c-4c37-b487-272067e88bd4',
    },
    relationships: {
      workitemlinktypes: {
        links: {
          related:
            'https://api.prod-preview.openshift.io/api/spacetemplates/929c963a-174c-4c37-b487-272067e88bd4/workitemlinktypes',
        },
      },
      workitemtypegroups: {
        links: {
          related:
            'https://api.prod-preview.openshift.io/api/spacetemplates/929c963a-174c-4c37-b487-272067e88bd4/workitemtypegroups',
        },
      },
      workitemtypes: {
        links: {
          related:
            'https://api.prod-preview.openshift.io/api/spacetemplates/929c963a-174c-4c37-b487-272067e88bd4/workitemtypes',
        },
      },
      workitemboards: {
        links: {
          related:
            'https://api.prod-preview.openshift.io/api/spacetemplates/929c963a-174c-4c37-b487-272067e88bd4/workitemboards',
        },
      },
    },
    type: 'spacetemplates',
  },
};

export const boardsResponse = {
  data: [
    {
      id: '000-000-002',
      attributes: {
        name: 'Scenarios Board',
        description: 'This is the default board config for the legacy template (Experiences).',
        contextType: 'TypeLevelContext', // this designates the type of the context
        context: '000-000-003', // this designates the ID of the context, in this case the typegroup ID
        'created-at': '0001-01-01T00:00:00Z',
        'updated-at': '0001-01-01T00:00:00Z',
      },
      relationships: {
        spaceTemplate: {
          data: {
            id: '000-000-004',
            type: 'spacetemplates',
          },
        },
        columns: {
          data: [
            {
              id: '4953fd3a-32dd-4943-8dcf-4b4c9bfcfef1',
              type: 'boardcolumns',
            },
          ],
        },
      },
      type: 'workitemboards',
    },
  ],
  included: [
    {
      attributes: {
        name: 'New',
        order: 0,
      },
      id: '4953fd3a-32dd-4943-8dcf-4b4c9bfcfef1',
      type: 'boardcolumns',
    },
  ],
};

export const boardUIData: BoardModelUI = {
  id: '000-000-002',
  name: 'Scenarios Board',
  description: 'This is the default board config for the legacy template (Experiences).',
  contextType: 'TypeLevelContext',
  context: '000-000-003',
  columns: [
    {
      id: '4953fd3a-32dd-4943-8dcf-4b4c9bfcfef1',
      title: 'New',
      columnOrder: 0,
      type: 'boardcolumns',
    },
  ],
};

export const boardsResponseToUIModel = {
  data: [
    {
      id: '000-000-002',
      attributes: {
        name: 'Scenarios Board',
        description: 'This is the default board config for the legacy template (Experiences).',
        contextType: 'TypeLevelContext', // this designates the type of the context
        context: '000-000-003', // this designates the ID of the context, in this case the typegroup ID
        'created-at': '0001-01-01T00:00:00Z',
        'updated-at': '0001-01-01T00:00:00Z',
      },
      relationships: {
        spaceTemplate: {
          data: {
            id: '000-000-004',
            type: 'spacetemplates',
          },
        },
        columns: {
          data: [
            {
              attributes: {
                name: 'New',
                order: 0,
              },
              id: '4953fd3a-32dd-4943-8dcf-4b4c9bfcfef1',
              type: 'boardcolumns',
            },
          ],
        },
      },
      type: 'workitemboards',
    },
  ],
  included: [
    {
      attributes: {
        name: 'New',
        order: 0,
      },
      id: '4953fd3a-32dd-4943-8dcf-4b4c9bfcfef1',
      type: 'boardcolumns',
    },
  ],
};
