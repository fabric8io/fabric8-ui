export const workItemSnapshot = {
  data: [
    {
      attributes: {
        effort: 12.2,
        environment: null,
        priority: 'P2 - High',
        repro_steps: null,
        resolution: 'Done',
        severity: 'SEV3 - Medium',
        'system.created_at': '2018-06-17T10:43:15.271565Z',
        'system.description': '',
        'system.description.markup': 'PlainText',
        'system.description.rendered': '',
        'system.number': 5,
        'system.order': 5000,
        'system.remote_item_id': null,
        'system.state': 'New',
        'system.title': 'Defect',
        'system.updated_at': '2018-06-17T11:31:44.436879Z',
        version: 9,
      },
      id: '2da4679c-fac0-452c-bf0f-be186beadf8a',
      links: {
        related:
          'https://api.prod-preview.openshift.io/api/workitems/2da4679c-fac0-452c-bf0f-be186beadf8a',
        self:
          'https://api.prod-preview.openshift.io/api/workitems/2da4679c-fac0-452c-bf0f-be186beadf8a',
      },
      relationships: {
        area: {
          data: {
            id: 'ad6d3ec8-baa1-41fe-b611-262ac411d880',
            links: {
              related:
                'https://api.prod-preview.openshift.io/api/areas/ad6d3ec8-baa1-41fe-b611-262ac411d880',
              self:
                'https://api.prod-preview.openshift.io/api/areas/ad6d3ec8-baa1-41fe-b611-262ac411d880',
            },
            type: 'areas',
          },
        },
        assignees: {},
        baseType: {
          data: {
            id: 'fce0921f-ea70-4513-bb91-31d3aa8017f1',
            type: 'workitemtypes',
          },
          links: {
            self:
              'https://api.prod-preview.openshift.io/api/workitemtypes/fce0921f-ea70-4513-bb91-31d3aa8017f1',
          },
        },
        children: {
          links: {
            related:
              'https://api.prod-preview.openshift.io/api/workitems/2da4679c-fac0-452c-bf0f-be186beadf8a/children',
          },
          meta: {
            hasChildren: false,
          },
        },
        comments: {
          links: {
            related:
              'https://api.prod-preview.openshift.io/api/workitems/2da4679c-fac0-452c-bf0f-be186beadf8a/comments',
            self:
              'https://api.prod-preview.openshift.io/api/workitems/2da4679c-fac0-452c-bf0f-be186beadf8a/relationships/comments',
          },
        },
        creator: {
          data: {
            id: '86c20119-9442-4459-940d-33ef9c628760',
            links: {
              related:
                'https://api.prod-preview.openshift.io/api/users/86c20119-9442-4459-940d-33ef9c628760',
              self:
                'https://api.prod-preview.openshift.io/api/users/86c20119-9442-4459-940d-33ef9c628760',
            },
            type: 'users',
          },
        },
        events: {
          links: {
            related:
              'https://api.prod-preview.openshift.io/api/workitems/2da4679c-fac0-452c-bf0f-be186beadf8a/events',
          },
        },
        iteration: {
          data: {
            id: '4a2ee84d-e246-41b2-9769-c50eecade0d6',
            links: {
              related:
                'https://api.prod-preview.openshift.io/api/iterations/4a2ee84d-e246-41b2-9769-c50eecade0d6',
              self:
                'https://api.prod-preview.openshift.io/api/iterations/4a2ee84d-e246-41b2-9769-c50eecade0d6',
            },
            type: 'iterations',
          },
        },
        labels: {
          links: {
            related:
              'https://api.prod-preview.openshift.io/api/workitems/2da4679c-fac0-452c-bf0f-be186beadf8a/labels',
          },
        },
        parent: {
          data: {
            id: '3e7060f8-b699-4ac9-ad31-b04c080cef72',
            type: 'workitems',
          },
        },
        space: {
          data: {
            id: 'f88c2cb3-56c5-4bdd-b0da-0365f646f65c',
            type: 'spaces',
          },
          links: {
            related:
              'https://api.prod-preview.openshift.io/api/spaces/f88c2cb3-56c5-4bdd-b0da-0365f646f65c',
            self:
              'https://api.prod-preview.openshift.io/api/spaces/f88c2cb3-56c5-4bdd-b0da-0365f646f65c',
          },
        },
        workItemLinks: {
          links: {
            related:
              'https://api.prod-preview.openshift.io/api/workitems/2da4679c-fac0-452c-bf0f-be186beadf8a/links',
          },
        },
      },
      type: 'workitems',
    },
    {
      attributes: {
        acceptance_criteria: null,
        business_value: null,
        component: '12d',
        effort: 12,
        'system.created_at': '2018-06-12T13:21:25.110067Z',
        'system.description': '',
        'system.description.markup': 'PlainText',
        'system.description.rendered': '',
        'system.number': 2,
        'system.order': 2000,
        'system.remote_item_id': null,
        'system.state': 'New',
        'system.title': 'Epic - 1',
        'system.updated_at': '2018-06-17T11:31:28.878397Z',
        time_criticality: null,
        version: 2,
      },
      id: '21208ede-694d-4078-998d-6e96db987bb6',
      links: {
        related:
          'https://api.prod-preview.openshift.io/api/workitems/21208ede-694d-4078-998d-6e96db987bb6',
        self:
          'https://api.prod-preview.openshift.io/api/workitems/21208ede-694d-4078-998d-6e96db987bb6',
      },
      relationships: {
        area: {
          data: {
            id: 'ad6d3ec8-baa1-41fe-b611-262ac411d880',
            links: {
              related:
                'https://api.prod-preview.openshift.io/api/areas/ad6d3ec8-baa1-41fe-b611-262ac411d880',
              self:
                'https://api.prod-preview.openshift.io/api/areas/ad6d3ec8-baa1-41fe-b611-262ac411d880',
            },
            type: 'areas',
          },
        },
        assignees: {},
        baseType: {
          data: {
            id: '2c169431-a55d-49eb-af74-cc19e895356f',
            type: 'workitemtypes',
          },
          links: {
            self:
              'https://api.prod-preview.openshift.io/api/workitemtypes/2c169431-a55d-49eb-af74-cc19e895356f',
          },
        },
        children: {
          links: {
            related:
              'https://api.prod-preview.openshift.io/api/workitems/21208ede-694d-4078-998d-6e96db987bb6/children',
          },
          meta: {
            hasChildren: true,
          },
        },
        comments: {
          links: {
            related:
              'https://api.prod-preview.openshift.io/api/workitems/21208ede-694d-4078-998d-6e96db987bb6/comments',
            self:
              'https://api.prod-preview.openshift.io/api/workitems/21208ede-694d-4078-998d-6e96db987bb6/relationships/comments',
          },
        },
        creator: {
          data: {
            id: '86c20119-9442-4459-940d-33ef9c628760',
            links: {
              related:
                'https://api.prod-preview.openshift.io/api/users/86c20119-9442-4459-940d-33ef9c628760',
              self:
                'https://api.prod-preview.openshift.io/api/users/86c20119-9442-4459-940d-33ef9c628760',
            },
            type: 'users',
          },
        },
        events: {
          links: {
            related:
              'https://api.prod-preview.openshift.io/api/workitems/21208ede-694d-4078-998d-6e96db987bb6/events',
          },
        },
        iteration: {
          data: {
            id: '4a2ee84d-e246-41b2-9769-c50eecade0d6',
            links: {
              related:
                'https://api.prod-preview.openshift.io/api/iterations/4a2ee84d-e246-41b2-9769-c50eecade0d6',
              self:
                'https://api.prod-preview.openshift.io/api/iterations/4a2ee84d-e246-41b2-9769-c50eecade0d6',
            },
            type: 'iterations',
          },
        },
        labels: {
          links: {
            related:
              'https://api.prod-preview.openshift.io/api/workitems/21208ede-694d-4078-998d-6e96db987bb6/labels',
          },
        },
        parent: {
          data: {
            id: 'a8bb6852-982a-4cc9-a038-46af6319ab18',
            type: 'workitems',
          },
        },
        space: {
          data: {
            id: 'f88c2cb3-56c5-4bdd-b0da-0365f646f65c',
            type: 'spaces',
          },
          links: {
            related:
              'https://api.prod-preview.openshift.io/api/spaces/f88c2cb3-56c5-4bdd-b0da-0365f646f65c',
            self:
              'https://api.prod-preview.openshift.io/api/spaces/f88c2cb3-56c5-4bdd-b0da-0365f646f65c',
          },
        },
        workItemLinks: {
          links: {
            related:
              'https://api.prod-preview.openshift.io/api/workitems/21208ede-694d-4078-998d-6e96db987bb6/links',
          },
        },
      },
      type: 'workitems',
    },
    {
      attributes: {
        acceptance_criteria: null,
        business_value: null,
        component: null,
        effort: null,
        'system.created_at': '2018-06-25T07:22:29.340122Z',
        'system.description': '',
        'system.description.markup': 'PlainText',
        'system.description.rendered': '',
        'system.number': 7,
        'system.order': 7000,
        'system.remote_item_id': null,
        'system.state': 'New',
        'system.title': 'Epic - 1',
        'system.updated_at': '2018-06-25T07:22:29.340122Z',
        time_criticality: null,
        version: 0,
      },
      id: '56041cf4-c1f0-4f37-9273-08d977f6c17d',
      links: {
        related:
          'https://api.prod-preview.openshift.io/api/workitems/56041cf4-c1f0-4f37-9273-08d977f6c17d',
        self:
          'https://api.prod-preview.openshift.io/api/workitems/56041cf4-c1f0-4f37-9273-08d977f6c17d',
      },
      relationships: {
        area: {
          data: {
            id: 'ad6d3ec8-baa1-41fe-b611-262ac411d880',
            links: {
              related:
                'https://api.prod-preview.openshift.io/api/areas/ad6d3ec8-baa1-41fe-b611-262ac411d880',
              self:
                'https://api.prod-preview.openshift.io/api/areas/ad6d3ec8-baa1-41fe-b611-262ac411d880',
            },
            type: 'areas',
          },
        },
        assignees: {},
        baseType: {
          data: {
            id: '2c169431-a55d-49eb-af74-cc19e895356f',
            type: 'workitemtypes',
          },
          links: {
            self:
              'https://api.prod-preview.openshift.io/api/workitemtypes/2c169431-a55d-49eb-af74-cc19e895356f',
          },
        },
        children: {
          links: {
            related:
              'https://api.prod-preview.openshift.io/api/workitems/56041cf4-c1f0-4f37-9273-08d977f6c17d/children',
          },
          meta: {
            hasChildren: false,
          },
        },
        comments: {
          links: {
            related:
              'https://api.prod-preview.openshift.io/api/workitems/56041cf4-c1f0-4f37-9273-08d977f6c17d/comments',
            self:
              'https://api.prod-preview.openshift.io/api/workitems/56041cf4-c1f0-4f37-9273-08d977f6c17d/relationships/comments',
          },
        },
        creator: {
          data: {
            id: '86c20119-9442-4459-940d-33ef9c628760',
            links: {
              related:
                'https://api.prod-preview.openshift.io/api/users/86c20119-9442-4459-940d-33ef9c628760',
              self:
                'https://api.prod-preview.openshift.io/api/users/86c20119-9442-4459-940d-33ef9c628760',
            },
            type: 'users',
          },
        },
        events: {
          links: {
            related:
              'https://api.prod-preview.openshift.io/api/workitems/56041cf4-c1f0-4f37-9273-08d977f6c17d/events',
          },
        },
        iteration: {
          data: {
            id: '4a2ee84d-e246-41b2-9769-c50eecade0d6',
            links: {
              related:
                'https://api.prod-preview.openshift.io/api/iterations/4a2ee84d-e246-41b2-9769-c50eecade0d6',
              self:
                'https://api.prod-preview.openshift.io/api/iterations/4a2ee84d-e246-41b2-9769-c50eecade0d6',
            },
            type: 'iterations',
          },
        },
        labels: {
          links: {
            related:
              'https://api.prod-preview.openshift.io/api/workitems/56041cf4-c1f0-4f37-9273-08d977f6c17d/labels',
          },
        },
        parent: {
          data: {
            id: 'a8bb6852-982a-4cc9-a038-46af6319ab18',
            type: 'workitems',
          },
        },
        space: {
          data: {
            id: 'f88c2cb3-56c5-4bdd-b0da-0365f646f65c',
            type: 'spaces',
          },
          links: {
            related:
              'https://api.prod-preview.openshift.io/api/spaces/f88c2cb3-56c5-4bdd-b0da-0365f646f65c',
            self:
              'https://api.prod-preview.openshift.io/api/spaces/f88c2cb3-56c5-4bdd-b0da-0365f646f65c',
          },
        },
        workItemLinks: {
          links: {
            related:
              'https://api.prod-preview.openshift.io/api/workitems/56041cf4-c1f0-4f37-9273-08d977f6c17d/links',
          },
        },
      },
      type: 'workitems',
    },
    {
      attributes: {
        acceptance_criteria: null,
        component: 'Hello',
        effort: 21.21,
        'system.created_at': '2018-06-12T13:21:40.496533Z',
        'system.description': '',
        'system.description.markup': 'PlainText',
        'system.description.rendered': '',
        'system.number': 3,
        'system.order': 3000,
        'system.remote_item_id': null,
        'system.state': 'New',
        'system.title': 'Story - 1',
        'system.updated_at': '2018-06-12T14:01:46.499546Z',
        version: 3,
      },
      id: 'e8c61463-5a8e-4f2e-8708-d18b66245ef8',
      links: {
        related:
          'https://api.prod-preview.openshift.io/api/workitems/e8c61463-5a8e-4f2e-8708-d18b66245ef8',
        self:
          'https://api.prod-preview.openshift.io/api/workitems/e8c61463-5a8e-4f2e-8708-d18b66245ef8',
      },
      relationships: {
        area: {
          data: {
            id: 'ad6d3ec8-baa1-41fe-b611-262ac411d880',
            links: {
              related:
                'https://api.prod-preview.openshift.io/api/areas/ad6d3ec8-baa1-41fe-b611-262ac411d880',
              self:
                'https://api.prod-preview.openshift.io/api/areas/ad6d3ec8-baa1-41fe-b611-262ac411d880',
            },
            type: 'areas',
          },
        },
        assignees: {},
        baseType: {
          data: {
            id: '6ff83406-caa7-47a9-9200-4ca796be11bb',
            type: 'workitemtypes',
          },
          links: {
            self:
              'https://api.prod-preview.openshift.io/api/workitemtypes/6ff83406-caa7-47a9-9200-4ca796be11bb',
          },
        },
        children: {
          links: {
            related:
              'https://api.prod-preview.openshift.io/api/workitems/e8c61463-5a8e-4f2e-8708-d18b66245ef8/children',
          },
          meta: {
            hasChildren: false,
          },
        },
        comments: {
          links: {
            related:
              'https://api.prod-preview.openshift.io/api/workitems/e8c61463-5a8e-4f2e-8708-d18b66245ef8/comments',
            self:
              'https://api.prod-preview.openshift.io/api/workitems/e8c61463-5a8e-4f2e-8708-d18b66245ef8/relationships/comments',
          },
        },
        creator: {
          data: {
            id: '86c20119-9442-4459-940d-33ef9c628760',
            links: {
              related:
                'https://api.prod-preview.openshift.io/api/users/86c20119-9442-4459-940d-33ef9c628760',
              self:
                'https://api.prod-preview.openshift.io/api/users/86c20119-9442-4459-940d-33ef9c628760',
            },
            type: 'users',
          },
        },
        events: {
          links: {
            related:
              'https://api.prod-preview.openshift.io/api/workitems/e8c61463-5a8e-4f2e-8708-d18b66245ef8/events',
          },
        },
        iteration: {
          data: {
            id: '4a2ee84d-e246-41b2-9769-c50eecade0d6',
            links: {
              related:
                'https://api.prod-preview.openshift.io/api/iterations/4a2ee84d-e246-41b2-9769-c50eecade0d6',
              self:
                'https://api.prod-preview.openshift.io/api/iterations/4a2ee84d-e246-41b2-9769-c50eecade0d6',
            },
            type: 'iterations',
          },
        },
        labels: {
          links: {
            related:
              'https://api.prod-preview.openshift.io/api/workitems/e8c61463-5a8e-4f2e-8708-d18b66245ef8/labels',
          },
        },
        parent: {
          data: {
            id: '21208ede-694d-4078-998d-6e96db987bb6',
            type: 'workitems',
          },
        },
        space: {
          data: {
            id: 'f88c2cb3-56c5-4bdd-b0da-0365f646f65c',
            type: 'spaces',
          },
          links: {
            related:
              'https://api.prod-preview.openshift.io/api/spaces/f88c2cb3-56c5-4bdd-b0da-0365f646f65c',
            self:
              'https://api.prod-preview.openshift.io/api/spaces/f88c2cb3-56c5-4bdd-b0da-0365f646f65c',
          },
        },
        workItemLinks: {
          links: {
            related:
              'https://api.prod-preview.openshift.io/api/workitems/e8c61463-5a8e-4f2e-8708-d18b66245ef8/links',
          },
        },
      },
      type: 'workitems',
    },
    {
      attributes: {
        acceptance_criteria: null,
        component: 'Component - add',
        effort: 12.23,
        'system.created_at': '2018-06-12T13:50:10.81589Z',
        'system.description': '',
        'system.description.markup': 'PlainText',
        'system.description.rendered': '',
        'system.number': 4,
        'system.order': 4000,
        'system.remote_item_id': null,
        'system.state': 'New',
        'system.title': 'Story - 2',
        'system.updated_at': '2018-06-21T11:53:52.152004Z',
        version: 9,
      },
      id: '3e7060f8-b699-4ac9-ad31-b04c080cef72',
      links: {
        related:
          'https://api.prod-preview.openshift.io/api/workitems/3e7060f8-b699-4ac9-ad31-b04c080cef72',
        self:
          'https://api.prod-preview.openshift.io/api/workitems/3e7060f8-b699-4ac9-ad31-b04c080cef72',
      },
      relationships: {
        area: {
          data: {
            id: 'ad6d3ec8-baa1-41fe-b611-262ac411d880',
            links: {
              related:
                'https://api.prod-preview.openshift.io/api/areas/ad6d3ec8-baa1-41fe-b611-262ac411d880',
              self:
                'https://api.prod-preview.openshift.io/api/areas/ad6d3ec8-baa1-41fe-b611-262ac411d880',
            },
            type: 'areas',
          },
        },
        assignees: {
          data: [
            {
              id: '86c20119-9442-4459-940d-33ef9c628760',
              links: {
                related:
                  'https://api.prod-preview.openshift.io/api/users/86c20119-9442-4459-940d-33ef9c628760',
                self:
                  'https://api.prod-preview.openshift.io/api/users/86c20119-9442-4459-940d-33ef9c628760',
              },
              type: 'users',
            },
            {
              id: '5502a92a-15ee-4a7d-a151-fb6395030994',
              links: {
                related:
                  'https://api.prod-preview.openshift.io/api/users/5502a92a-15ee-4a7d-a151-fb6395030994',
                self:
                  'https://api.prod-preview.openshift.io/api/users/5502a92a-15ee-4a7d-a151-fb6395030994',
              },
              type: 'users',
            },
          ],
        },
        baseType: {
          data: {
            id: '6ff83406-caa7-47a9-9200-4ca796be11bb',
            type: 'workitemtypes',
          },
          links: {
            self:
              'https://api.prod-preview.openshift.io/api/workitemtypes/6ff83406-caa7-47a9-9200-4ca796be11bb',
          },
        },
        children: {
          links: {
            related:
              'https://api.prod-preview.openshift.io/api/workitems/3e7060f8-b699-4ac9-ad31-b04c080cef72/children',
          },
          meta: {
            hasChildren: true,
          },
        },
        comments: {
          links: {
            related:
              'https://api.prod-preview.openshift.io/api/workitems/3e7060f8-b699-4ac9-ad31-b04c080cef72/comments',
            self:
              'https://api.prod-preview.openshift.io/api/workitems/3e7060f8-b699-4ac9-ad31-b04c080cef72/relationships/comments',
          },
        },
        creator: {
          data: {
            id: '86c20119-9442-4459-940d-33ef9c628760',
            links: {
              related:
                'https://api.prod-preview.openshift.io/api/users/86c20119-9442-4459-940d-33ef9c628760',
              self:
                'https://api.prod-preview.openshift.io/api/users/86c20119-9442-4459-940d-33ef9c628760',
            },
            type: 'users',
          },
        },
        events: {
          links: {
            related:
              'https://api.prod-preview.openshift.io/api/workitems/3e7060f8-b699-4ac9-ad31-b04c080cef72/events',
          },
        },
        iteration: {
          data: {
            id: '4a2ee84d-e246-41b2-9769-c50eecade0d6',
            links: {
              related:
                'https://api.prod-preview.openshift.io/api/iterations/4a2ee84d-e246-41b2-9769-c50eecade0d6',
              self:
                'https://api.prod-preview.openshift.io/api/iterations/4a2ee84d-e246-41b2-9769-c50eecade0d6',
            },
            type: 'iterations',
          },
        },
        labels: {
          links: {
            related:
              'https://api.prod-preview.openshift.io/api/workitems/3e7060f8-b699-4ac9-ad31-b04c080cef72/labels',
          },
        },
        parent: {
          data: {
            id: '21208ede-694d-4078-998d-6e96db987bb6',
            type: 'workitems',
          },
        },
        space: {
          data: {
            id: 'f88c2cb3-56c5-4bdd-b0da-0365f646f65c',
            type: 'spaces',
          },
          links: {
            related:
              'https://api.prod-preview.openshift.io/api/spaces/f88c2cb3-56c5-4bdd-b0da-0365f646f65c',
            self:
              'https://api.prod-preview.openshift.io/api/spaces/f88c2cb3-56c5-4bdd-b0da-0365f646f65c',
          },
        },
        workItemLinks: {
          links: {
            related:
              'https://api.prod-preview.openshift.io/api/workitems/3e7060f8-b699-4ac9-ad31-b04c080cef72/links',
          },
        },
      },
      type: 'workitems',
    },
    {
      attributes: {
        acceptance_criteria: null,
        business_value: null,
        effort: null,
        'system.created_at': '2018-06-12T13:21:11.600134Z',
        'system.description': '',
        'system.description.markup': 'PlainText',
        'system.description.rendered': '',
        'system.number': 1,
        'system.order': 1000,
        'system.remote_item_id': null,
        'system.state': 'New',
        'system.title': 'Theme - 1',
        'system.updated_at': '2018-06-14T13:31:46.322658Z',
        target_date: null,
        time_criticality: 12,
        version: 2,
      },
      id: 'a8bb6852-982a-4cc9-a038-46af6319ab18',
      links: {
        related:
          'https://api.prod-preview.openshift.io/api/workitems/a8bb6852-982a-4cc9-a038-46af6319ab18',
        self:
          'https://api.prod-preview.openshift.io/api/workitems/a8bb6852-982a-4cc9-a038-46af6319ab18',
      },
      relationships: {
        area: {
          data: {
            id: 'ad6d3ec8-baa1-41fe-b611-262ac411d880',
            links: {
              related:
                'https://api.prod-preview.openshift.io/api/areas/ad6d3ec8-baa1-41fe-b611-262ac411d880',
              self:
                'https://api.prod-preview.openshift.io/api/areas/ad6d3ec8-baa1-41fe-b611-262ac411d880',
            },
            type: 'areas',
          },
        },
        assignees: {
          data: [
            {
              id: '5502a92a-15ee-4a7d-a151-fb6395030994',
              links: {
                related:
                  'https://api.prod-preview.openshift.io/api/users/5502a92a-15ee-4a7d-a151-fb6395030994',
                self:
                  'https://api.prod-preview.openshift.io/api/users/5502a92a-15ee-4a7d-a151-fb6395030994',
              },
              type: 'users',
            },
            {
              id: '2350b946-3f16-4040-a56e-6710501fab83',
              links: {
                related:
                  'https://api.prod-preview.openshift.io/api/users/2350b946-3f16-4040-a56e-6710501fab83',
                self:
                  'https://api.prod-preview.openshift.io/api/users/2350b946-3f16-4040-a56e-6710501fab83',
              },
              type: 'users',
            },
          ],
        },
        baseType: {
          data: {
            id: '5182fc8c-b1d6-4c3d-83ca-6a3c781fa18a',
            type: 'workitemtypes',
          },
          links: {
            self:
              'https://api.prod-preview.openshift.io/api/workitemtypes/5182fc8c-b1d6-4c3d-83ca-6a3c781fa18a',
          },
        },
        children: {
          links: {
            related:
              'https://api.prod-preview.openshift.io/api/workitems/a8bb6852-982a-4cc9-a038-46af6319ab18/children',
          },
          meta: {
            hasChildren: true,
          },
        },
        comments: {
          links: {
            related:
              'https://api.prod-preview.openshift.io/api/workitems/a8bb6852-982a-4cc9-a038-46af6319ab18/comments',
            self:
              'https://api.prod-preview.openshift.io/api/workitems/a8bb6852-982a-4cc9-a038-46af6319ab18/relationships/comments',
          },
        },
        creator: {
          data: {
            id: '86c20119-9442-4459-940d-33ef9c628760',
            links: {
              related:
                'https://api.prod-preview.openshift.io/api/users/86c20119-9442-4459-940d-33ef9c628760',
              self:
                'https://api.prod-preview.openshift.io/api/users/86c20119-9442-4459-940d-33ef9c628760',
            },
            type: 'users',
          },
        },
        events: {
          links: {
            related:
              'https://api.prod-preview.openshift.io/api/workitems/a8bb6852-982a-4cc9-a038-46af6319ab18/events',
          },
        },
        iteration: {
          data: {
            id: '4a2ee84d-e246-41b2-9769-c50eecade0d6',
            links: {
              related:
                'https://api.prod-preview.openshift.io/api/iterations/4a2ee84d-e246-41b2-9769-c50eecade0d6',
              self:
                'https://api.prod-preview.openshift.io/api/iterations/4a2ee84d-e246-41b2-9769-c50eecade0d6',
            },
            type: 'iterations',
          },
        },
        labels: {
          links: {
            related:
              'https://api.prod-preview.openshift.io/api/workitems/a8bb6852-982a-4cc9-a038-46af6319ab18/labels',
          },
        },
        parent: {},
        space: {
          data: {
            id: 'f88c2cb3-56c5-4bdd-b0da-0365f646f65c',
            type: 'spaces',
          },
          links: {
            related:
              'https://api.prod-preview.openshift.io/api/spaces/f88c2cb3-56c5-4bdd-b0da-0365f646f65c',
            self:
              'https://api.prod-preview.openshift.io/api/spaces/f88c2cb3-56c5-4bdd-b0da-0365f646f65c',
          },
        },
        workItemLinks: {
          links: {
            related:
              'https://api.prod-preview.openshift.io/api/workitems/a8bb6852-982a-4cc9-a038-46af6319ab18/links',
          },
        },
      },
      type: 'workitems',
    },
    {
      attributes: {
        acceptance_criteria: null,
        business_value: null,
        effort: null,
        'system.created_at': '2018-06-18T11:33:28.0937Z',
        'system.description': '',
        'system.description.markup': 'PlainText',
        'system.description.rendered': '',
        'system.number': 6,
        'system.order': 6000,
        'system.remote_item_id': null,
        'system.state': 'In Progress',
        'system.title': 'Theme - 3',
        'system.updated_at': '2018-06-22T12:10:32.140119Z',
        target_date: null,
        time_criticality: null,
        version: 7,
      },
      id: '7682f143-af83-49d6-ae9d-94bdaa480291',
      links: {
        related:
          'https://api.prod-preview.openshift.io/api/workitems/7682f143-af83-49d6-ae9d-94bdaa480291',
        self:
          'https://api.prod-preview.openshift.io/api/workitems/7682f143-af83-49d6-ae9d-94bdaa480291',
      },
      relationships: {
        area: {
          data: {
            id: 'ad6d3ec8-baa1-41fe-b611-262ac411d880',
            links: {
              related:
                'https://api.prod-preview.openshift.io/api/areas/ad6d3ec8-baa1-41fe-b611-262ac411d880',
              self:
                'https://api.prod-preview.openshift.io/api/areas/ad6d3ec8-baa1-41fe-b611-262ac411d880',
            },
            type: 'areas',
          },
        },
        assignees: {
          data: [
            {
              id: '86c20119-9442-4459-940d-33ef9c628760',
              links: {
                related:
                  'https://api.prod-preview.openshift.io/api/users/86c20119-9442-4459-940d-33ef9c628760',
                self:
                  'https://api.prod-preview.openshift.io/api/users/86c20119-9442-4459-940d-33ef9c628760',
              },
              type: 'users',
            },
            {
              id: '596ec6b8-9f39-49b0-a8c3-7f6d1483c352',
              links: {
                related:
                  'https://api.prod-preview.openshift.io/api/users/596ec6b8-9f39-49b0-a8c3-7f6d1483c352',
                self:
                  'https://api.prod-preview.openshift.io/api/users/596ec6b8-9f39-49b0-a8c3-7f6d1483c352',
              },
              type: 'users',
            },
          ],
        },
        baseType: {
          data: {
            id: '5182fc8c-b1d6-4c3d-83ca-6a3c781fa18a',
            type: 'workitemtypes',
          },
          links: {
            self:
              'https://api.prod-preview.openshift.io/api/workitemtypes/5182fc8c-b1d6-4c3d-83ca-6a3c781fa18a',
          },
        },
        children: {
          links: {
            related:
              'https://api.prod-preview.openshift.io/api/workitems/7682f143-af83-49d6-ae9d-94bdaa480291/children',
          },
          meta: {
            hasChildren: false,
          },
        },
        comments: {
          links: {
            related:
              'https://api.prod-preview.openshift.io/api/workitems/7682f143-af83-49d6-ae9d-94bdaa480291/comments',
            self:
              'https://api.prod-preview.openshift.io/api/workitems/7682f143-af83-49d6-ae9d-94bdaa480291/relationships/comments',
          },
        },
        creator: {
          data: {
            id: '5502a92a-15ee-4a7d-a151-fb6395030994',
            links: {
              related:
                'https://api.prod-preview.openshift.io/api/users/5502a92a-15ee-4a7d-a151-fb6395030994',
              self:
                'https://api.prod-preview.openshift.io/api/users/5502a92a-15ee-4a7d-a151-fb6395030994',
            },
            type: 'users',
          },
        },
        events: {
          links: {
            related:
              'https://api.prod-preview.openshift.io/api/workitems/7682f143-af83-49d6-ae9d-94bdaa480291/events',
          },
        },
        iteration: {
          data: {
            id: 'c8896a44-b6f5-4004-a26c-2f13fb780d97',
            links: {
              related:
                'https://api.prod-preview.openshift.io/api/iterations/c8896a44-b6f5-4004-a26c-2f13fb780d97',
              self:
                'https://api.prod-preview.openshift.io/api/iterations/c8896a44-b6f5-4004-a26c-2f13fb780d97',
            },
            type: 'iterations',
          },
        },
        labels: {
          data: [
            {
              id: 'c454d899-319c-4979-8a6c-9fae5457664e',
              type: 'labels',
            },
          ],
          links: {
            related:
              'https://api.prod-preview.openshift.io/api/workitems/7682f143-af83-49d6-ae9d-94bdaa480291/labels',
          },
        },
        parent: {},
        space: {
          data: {
            id: 'f88c2cb3-56c5-4bdd-b0da-0365f646f65c',
            type: 'spaces',
          },
          links: {
            related:
              'https://api.prod-preview.openshift.io/api/spaces/f88c2cb3-56c5-4bdd-b0da-0365f646f65c',
            self:
              'https://api.prod-preview.openshift.io/api/spaces/f88c2cb3-56c5-4bdd-b0da-0365f646f65c',
          },
        },
        workItemLinks: {
          links: {
            related:
              'https://api.prod-preview.openshift.io/api/workitems/7682f143-af83-49d6-ae9d-94bdaa480291/links',
          },
        },
      },
      type: 'workitems',
    },
    {
      attributes: {
        acceptance_criteria: null,
        business_value: null,
        effort: null,
        'system.created_at': '2018-06-25T09:45:05.130991Z',
        'system.description': '',
        'system.description.markup': 'PlainText',
        'system.description.rendered': '',
        'system.number': 8,
        'system.order': 8000,
        'system.remote_item_id': null,
        'system.state': 'In Progress',
        'system.title': 'Theme - 41',
        'system.updated_at': '2018-06-25T09:45:49.09587Z',
        target_date: null,
        time_criticality: null,
        version: 4,
      },
      id: '2615f1c4-eddb-47d1-b60f-b1bb80de62da',
      links: {
        related:
          'https://api.prod-preview.openshift.io/api/workitems/2615f1c4-eddb-47d1-b60f-b1bb80de62da',
        self:
          'https://api.prod-preview.openshift.io/api/workitems/2615f1c4-eddb-47d1-b60f-b1bb80de62da',
      },
      relationships: {
        area: {
          data: {
            id: 'ad6d3ec8-baa1-41fe-b611-262ac411d880',
            links: {
              related:
                'https://api.prod-preview.openshift.io/api/areas/ad6d3ec8-baa1-41fe-b611-262ac411d880',
              self:
                'https://api.prod-preview.openshift.io/api/areas/ad6d3ec8-baa1-41fe-b611-262ac411d880',
            },
            type: 'areas',
          },
        },
        assignees: {
          data: [
            {
              id: '596ec6b8-9f39-49b0-a8c3-7f6d1483c352',
              links: {
                related:
                  'https://api.prod-preview.openshift.io/api/users/596ec6b8-9f39-49b0-a8c3-7f6d1483c352',
                self:
                  'https://api.prod-preview.openshift.io/api/users/596ec6b8-9f39-49b0-a8c3-7f6d1483c352',
              },
              type: 'users',
            },
          ],
        },
        baseType: {
          data: {
            id: '5182fc8c-b1d6-4c3d-83ca-6a3c781fa18a',
            type: 'workitemtypes',
          },
          links: {
            self:
              'https://api.prod-preview.openshift.io/api/workitemtypes/5182fc8c-b1d6-4c3d-83ca-6a3c781fa18a',
          },
        },
        children: {
          links: {
            related:
              'https://api.prod-preview.openshift.io/api/workitems/2615f1c4-eddb-47d1-b60f-b1bb80de62da/children',
          },
          meta: {
            hasChildren: false,
          },
        },
        comments: {
          links: {
            related:
              'https://api.prod-preview.openshift.io/api/workitems/2615f1c4-eddb-47d1-b60f-b1bb80de62da/comments',
            self:
              'https://api.prod-preview.openshift.io/api/workitems/2615f1c4-eddb-47d1-b60f-b1bb80de62da/relationships/comments',
          },
        },
        creator: {
          data: {
            id: '86c20119-9442-4459-940d-33ef9c628760',
            links: {
              related:
                'https://api.prod-preview.openshift.io/api/users/86c20119-9442-4459-940d-33ef9c628760',
              self:
                'https://api.prod-preview.openshift.io/api/users/86c20119-9442-4459-940d-33ef9c628760',
            },
            type: 'users',
          },
        },
        events: {
          links: {
            related:
              'https://api.prod-preview.openshift.io/api/workitems/2615f1c4-eddb-47d1-b60f-b1bb80de62da/events',
          },
        },
        iteration: {
          data: {
            id: '4a2ee84d-e246-41b2-9769-c50eecade0d6',
            links: {
              related:
                'https://api.prod-preview.openshift.io/api/iterations/4a2ee84d-e246-41b2-9769-c50eecade0d6',
              self:
                'https://api.prod-preview.openshift.io/api/iterations/4a2ee84d-e246-41b2-9769-c50eecade0d6',
            },
            type: 'iterations',
          },
        },
        labels: {
          data: [
            {
              id: 'b3ddabbd-9de5-43dd-8bc6-8d29d78132bb',
              type: 'labels',
            },
            {
              id: 'c454d899-319c-4979-8a6c-9fae5457664e',
              type: 'labels',
            },
          ],
          links: {
            related:
              'https://api.prod-preview.openshift.io/api/workitems/2615f1c4-eddb-47d1-b60f-b1bb80de62da/labels',
          },
        },
        parent: {},
        space: {
          data: {
            id: 'f88c2cb3-56c5-4bdd-b0da-0365f646f65c',
            type: 'spaces',
          },
          links: {
            related:
              'https://api.prod-preview.openshift.io/api/spaces/f88c2cb3-56c5-4bdd-b0da-0365f646f65c',
            self:
              'https://api.prod-preview.openshift.io/api/spaces/f88c2cb3-56c5-4bdd-b0da-0365f646f65c',
          },
        },
        workItemLinks: {
          links: {
            related:
              'https://api.prod-preview.openshift.io/api/workitems/2615f1c4-eddb-47d1-b60f-b1bb80de62da/links',
          },
        },
      },
      type: 'workitems',
    },
  ],
  links: {
    first:
      'https://api.prod-preview.openshift.io/api/search?page[offset]=0\u0026page[limit]=100\u0026filter[expression]={"$AND":[{"space":{"$EQ":"f88c2cb3-56c5-4bdd-b0da-0365f646f65c"}},{"typegroup.name":{"$EQ":"Work Items"}},{"state":{"$NE":"closed"}},{"state":{"$NE":"Done"}},{"state":{"$NE":"Removed"}}],"$OPTS":{"tree-view":true}}',
    last:
      'https://api.prod-preview.openshift.io/api/search?page[offset]=0\u0026page[limit]=100\u0026filter[expression]={"$AND":[{"space":{"$EQ":"f88c2cb3-56c5-4bdd-b0da-0365f646f65c"}},{"typegroup.name":{"$EQ":"Work Items"}},{"state":{"$NE":"closed"}},{"state":{"$NE":"Done"}},{"state":{"$NE":"Removed"}}],"$OPTS":{"tree-view":true}}',
  },
  meta: {
    ancestorIDs: [
      '21208ede-694d-4078-998d-6e96db987bb6',
      '3e7060f8-b699-4ac9-ad31-b04c080cef72',
      'a8bb6852-982a-4cc9-a038-46af6319ab18',
    ],
    totalCount: 8,
  },
  included: [
    {
      attributes: {
        acceptance_criteria: null,
        business_value: null,
        effort: null,
        'system.created_at': '2018-06-14T13:32:47.237365Z',
        'system.description': '',
        'system.description.markup': 'PlainText',
        'system.description.rendered': '',
        'system.number': 2,
        'system.order': 2000,
        'system.remote_item_id': null,
        'system.state': 'New',
        'system.title': 'Theme - 2',
        'system.updated_at': '2018-06-14T13:32:47.237365Z',
        target_date: null,
        time_criticality: null,
        version: 0,
      },
      id: 'd3786dd3-e4ed-4553-bee8-5373c0ef52b3',
      links: {
        related:
          'https://api.prod-preview.openshift.io/api/workitems/d3786dd3-e4ed-4553-bee8-5373c0ef52b3',
        self:
          'https://api.prod-preview.openshift.io/api/workitems/d3786dd3-e4ed-4553-bee8-5373c0ef52b3',
      },
      relationships: {
        area: {
          data: {
            id: 'f4f5a8e1-abd4-463b-9bc3-7a652fa91d9e',
            links: {
              related:
                'https://api.prod-preview.openshift.io/api/areas/f4f5a8e1-abd4-463b-9bc3-7a652fa91d9e',
              self:
                'https://api.prod-preview.openshift.io/api/areas/f4f5a8e1-abd4-463b-9bc3-7a652fa91d9e',
            },
            type: 'areas',
          },
        },
        assignees: {},
        baseType: {
          data: {
            id: '5182fc8c-b1d6-4c3d-83ca-6a3c781fa18a',
            type: 'workitemtypes',
          },
          links: {
            self:
              'https://api.prod-preview.openshift.io/api/workitemtypes/5182fc8c-b1d6-4c3d-83ca-6a3c781fa18a',
          },
        },
        children: {
          links: {
            related:
              'https://api.prod-preview.openshift.io/api/workitems/d3786dd3-e4ed-4553-bee8-5373c0ef52b3/children',
          },
          meta: {
            hasChildren: true,
          },
        },
        comments: {
          links: {
            related:
              'https://api.prod-preview.openshift.io/api/workitems/d3786dd3-e4ed-4553-bee8-5373c0ef52b3/comments',
            self:
              'https://api.prod-preview.openshift.io/api/workitems/d3786dd3-e4ed-4553-bee8-5373c0ef52b3/relationships/comments',
          },
        },
        creator: {
          data: {
            id: '86c20119-9442-4459-940d-33ef9c628760',
            links: {
              related:
                'https://api.prod-preview.openshift.io/api/users/86c20119-9442-4459-940d-33ef9c628760',
              self:
                'https://api.prod-preview.openshift.io/api/users/86c20119-9442-4459-940d-33ef9c628760',
            },
            type: 'users',
          },
        },
        events: {
          links: {
            related:
              'https://api.prod-preview.openshift.io/api/workitems/d3786dd3-e4ed-4553-bee8-5373c0ef52b3/events',
          },
        },
        iteration: {
          data: {
            id: '4734cbb8-46cc-42ed-b47b-5ab497b4f418',
            links: {
              related:
                'https://api.prod-preview.openshift.io/api/iterations/4734cbb8-46cc-42ed-b47b-5ab497b4f418',
              self:
                'https://api.prod-preview.openshift.io/api/iterations/4734cbb8-46cc-42ed-b47b-5ab497b4f418',
            },
            type: 'iterations',
          },
        },
        labels: {
          links: {
            related:
              'https://api.prod-preview.openshift.io/api/workitems/d3786dd3-e4ed-4553-bee8-5373c0ef52b3/labels',
          },
        },
        parent: {},
        space: {
          data: {
            id: 'fd332182-df3d-4ea1-b4f6-df225849b856',
            type: 'spaces',
          },
          links: {
            related:
              'https://api.prod-preview.openshift.io/api/spaces/fd332182-df3d-4ea1-b4f6-df225849b856',
            self:
              'https://api.prod-preview.openshift.io/api/spaces/fd332182-df3d-4ea1-b4f6-df225849b856',
          },
        },
        workItemLinks: {
          links: {
            related:
              'https://api.prod-preview.openshift.io/api/workitems/d3786dd3-e4ed-4553-bee8-5373c0ef52b3/links',
          },
        },
      },
      type: 'workitems',
    },
  ],
};

export const getWorkItemResponseSnapshot = {
  workItems: workItemSnapshot.data,
  nextLink: null,
  totalCount: workItemSnapshot.meta.totalCount,
  included: workItemSnapshot.included,
  ancestorIDs: workItemSnapshot.meta.ancestorIDs,
};

export const getMoreWorkItemResponseSnapshot = {
  workItems: workItemSnapshot.data,
  nextLink: null,
  included: workItemSnapshot.included,
  ancestorIDs: workItemSnapshot.meta.ancestorIDs,
};

export const getSingleWorkItemSnapShot = {
  data: {
    attributes: {
      acceptance_criteria: null,
      business_value: null,
      effort: null,
      'system.created_at': '2018-06-14T13:32:47.237365Z',
      'system.description': '',
      'system.description.markup': 'PlainText',
      'system.description.rendered': '',
      'system.number': 2,
      'system.order': 2000,
      'system.remote_item_id': null,
      'system.state': 'New',
      'system.title': 'Theme - 2',
      'system.updated_at': '2018-06-14T13:32:47.237365Z',
      target_date: null,
      time_criticality: null,
      version: 0,
    },
    id: 'd3786dd3-e4ed-4553-bee8-5373c0ef52b3',
    links: {
      related:
        'https://api.prod-preview.openshift.io/api/workitems/d3786dd3-e4ed-4553-bee8-5373c0ef52b3',
      self:
        'https://api.prod-preview.openshift.io/api/workitems/d3786dd3-e4ed-4553-bee8-5373c0ef52b3',
    },
    relationships: {
      area: {
        data: {
          id: 'f4f5a8e1-abd4-463b-9bc3-7a652fa91d9e',
          links: {
            related:
              'https://api.prod-preview.openshift.io/api/areas/f4f5a8e1-abd4-463b-9bc3-7a652fa91d9e',
            self:
              'https://api.prod-preview.openshift.io/api/areas/f4f5a8e1-abd4-463b-9bc3-7a652fa91d9e',
          },
          type: 'areas',
        },
      },
      assignees: {},
      baseType: {
        data: {
          id: '5182fc8c-b1d6-4c3d-83ca-6a3c781fa18a',
          type: 'workitemtypes',
        },
        links: {
          self:
            'https://api.prod-preview.openshift.io/api/workitemtypes/5182fc8c-b1d6-4c3d-83ca-6a3c781fa18a',
        },
      },
      children: {
        links: {
          related:
            'https://api.prod-preview.openshift.io/api/workitems/d3786dd3-e4ed-4553-bee8-5373c0ef52b3/children',
        },
        meta: {
          hasChildren: true,
        },
      },
      comments: {
        links: {
          related:
            'https://api.prod-preview.openshift.io/api/workitems/d3786dd3-e4ed-4553-bee8-5373c0ef52b3/comments',
          self:
            'https://api.prod-preview.openshift.io/api/workitems/d3786dd3-e4ed-4553-bee8-5373c0ef52b3/relationships/comments',
        },
        meta: {
          totalCount: 1,
        },
      },
      creator: {
        data: {
          id: '86c20119-9442-4459-940d-33ef9c628760',
          links: {
            related:
              'https://api.prod-preview.openshift.io/api/users/86c20119-9442-4459-940d-33ef9c628760',
            self:
              'https://api.prod-preview.openshift.io/api/users/86c20119-9442-4459-940d-33ef9c628760',
          },
          type: 'users',
        },
      },
      events: {
        links: {
          related:
            'https://api.prod-preview.openshift.io/api/workitems/d3786dd3-e4ed-4553-bee8-5373c0ef52b3/events',
        },
      },
      iteration: {
        data: {
          id: '4734cbb8-46cc-42ed-b47b-5ab497b4f418',
          links: {
            related:
              'https://api.prod-preview.openshift.io/api/iterations/4734cbb8-46cc-42ed-b47b-5ab497b4f418',
            self:
              'https://api.prod-preview.openshift.io/api/iterations/4734cbb8-46cc-42ed-b47b-5ab497b4f418',
          },
          type: 'iterations',
        },
      },
      labels: {
        links: {
          related:
            'https://api.prod-preview.openshift.io/api/workitems/d3786dd3-e4ed-4553-bee8-5373c0ef52b3/labels',
        },
      },
      space: {
        data: {
          id: 'fd332182-df3d-4ea1-b4f6-df225849b856',
          type: 'spaces',
        },
        links: {
          related:
            'https://api.prod-preview.openshift.io/api/spaces/fd332182-df3d-4ea1-b4f6-df225849b856',
          self:
            'https://api.prod-preview.openshift.io/api/spaces/fd332182-df3d-4ea1-b4f6-df225849b856',
        },
      },
      workItemLinks: {
        links: {
          related:
            'https://api.prod-preview.openshift.io/api/workitems/d3786dd3-e4ed-4553-bee8-5373c0ef52b3/links',
        },
      },
    },
    type: 'workitems',
  },
};

export const workItemEventsSnapshot = {
  data: [
    {
      attributes: {
        name: 'component',
        newValue: 'saas',
        oldValue: '',
        timestamp: '2018-06-16T11:36:17.410817Z',
      },
      id: 'de0d28f7-3933-4577-a94c-154a46a44566',
      relationships: {
        modifier: {
          data: {
            id: '86c20119-9442-4459-940d-33ef9c628760',
            links: {
              related:
                'https://api.prod-preview.openshift.io/api/users/86c20119-9442-4459-940d-33ef9c628760',
            },
            type: 'identities',
          },
        },
      },
      type: 'events',
    },
    {
      attributes: {
        name: 'effort',
        newValue: '12.1',
        oldValue: '',
        timestamp: '2018-06-16T11:36:23.522262Z',
      },
      id: 'e3f919ea-ff15-4a8f-84dd-cf05d764c2c9',
      relationships: {
        modifier: {
          data: {
            id: '86c20119-9442-4459-940d-33ef9c628760',
            links: {
              related:
                'https://api.prod-preview.openshift.io/api/users/86c20119-9442-4459-940d-33ef9c628760',
            },
            type: 'identities',
          },
        },
      },
      type: 'events',
    },
    {
      attributes: {
        name: 'component',
        newValue: 'saa',
        oldValue: 'saas',
        timestamp: '2018-06-16T11:36:40.940138Z',
      },
      id: '73db67a3-29df-4c54-aa18-47ad7d6cdc4e',
      relationships: {
        modifier: {
          data: {
            id: '86c20119-9442-4459-940d-33ef9c628760',
            links: {
              related:
                'https://api.prod-preview.openshift.io/api/users/86c20119-9442-4459-940d-33ef9c628760',
            },
            type: 'identities',
          },
        },
      },
      type: 'events',
    },
    {
      attributes: {
        name: 'effort',
        newValue: '12.12',
        oldValue: '12.1',
        timestamp: '2018-06-16T11:36:59.901245Z',
      },
      id: '4f305e41-8ded-445f-93ef-4cb10ffc5fcb',
      relationships: {
        modifier: {
          data: {
            id: '86c20119-9442-4459-940d-33ef9c628760',
            links: {
              related:
                'https://api.prod-preview.openshift.io/api/users/86c20119-9442-4459-940d-33ef9c628760',
            },
            type: 'identities',
          },
        },
      },
      type: 'events',
    },
    {
      attributes: {
        name: 'component',
        newValue: 'saas',
        oldValue: 'saa',
        timestamp: '2018-06-16T11:37:20.180402Z',
      },
      id: 'e6c6a5f4-dfdf-4868-9a42-e624f1080208',
      relationships: {
        modifier: {
          data: {
            id: '86c20119-9442-4459-940d-33ef9c628760',
            links: {
              related:
                'https://api.prod-preview.openshift.io/api/users/86c20119-9442-4459-940d-33ef9c628760',
            },
            type: 'identities',
          },
        },
      },
      type: 'events',
    },
    {
      attributes: {
        name: 'component',
        newValue: 'saasa',
        oldValue: 'saas',
        timestamp: '2018-06-16T11:45:42.90078Z',
      },
      id: '72dc767a-bb2e-4b37-95f2-be2d739df2d4',
      relationships: {
        modifier: {
          data: {
            id: '86c20119-9442-4459-940d-33ef9c628760',
            links: {
              related:
                'https://api.prod-preview.openshift.io/api/users/86c20119-9442-4459-940d-33ef9c628760',
            },
            type: 'identities',
          },
        },
      },
      type: 'events',
    },
    {
      attributes: {
        name: 'effort',
        newValue: '',
        oldValue: '12.12',
        timestamp: '2018-06-17T02:16:35.306715Z',
      },
      id: 'e5f268e4-fffc-45c2-90e0-4fa5016c8899',
      relationships: {
        modifier: {
          data: {
            id: '86c20119-9442-4459-940d-33ef9c628760',
            links: {
              related:
                'https://api.prod-preview.openshift.io/api/users/86c20119-9442-4459-940d-33ef9c628760',
            },
            type: 'identities',
          },
        },
      },
      type: 'events',
    },
    {
      attributes: {
        name: 'effort',
        newValue: '12',
        oldValue: '',
        timestamp: '2018-06-17T02:17:13.542783Z',
      },
      id: 'd8a18d2a-ae63-457e-a721-5a8e44c63827',
      relationships: {
        modifier: {
          data: {
            id: '86c20119-9442-4459-940d-33ef9c628760',
            links: {
              related:
                'https://api.prod-preview.openshift.io/api/users/86c20119-9442-4459-940d-33ef9c628760',
            },
            type: 'identities',
          },
        },
      },
      type: 'events',
    },
    {
      attributes: {
        name: 'effort',
        newValue: '',
        oldValue: '12',
        timestamp: '2018-06-17T02:36:44.353633Z',
      },
      id: 'cbe21a08-4d93-4482-9d7e-6ede34708e11',
      relationships: {
        modifier: {
          data: {
            id: '86c20119-9442-4459-940d-33ef9c628760',
            links: {
              related:
                'https://api.prod-preview.openshift.io/api/users/86c20119-9442-4459-940d-33ef9c628760',
            },
            type: 'identities',
          },
        },
      },
      type: 'events',
    },
    {
      attributes: {
        name: 'component',
        newValue: 'saasa\ndsadad\nxaxasdasdhk djagd a\ndasjdgas',
        oldValue: 'saasa',
        timestamp: '2018-06-17T03:09:55.70733Z',
      },
      id: '68e970aa-f6c5-4eb3-8169-7364bf159017',
      relationships: {
        modifier: {
          data: {
            id: '86c20119-9442-4459-940d-33ef9c628760',
            links: {
              related:
                'https://api.prod-preview.openshift.io/api/users/86c20119-9442-4459-940d-33ef9c628760',
            },
            type: 'identities',
          },
        },
      },
      type: 'events',
    },
    {
      attributes: {
        name: 'component',
        newValue: 'saasa\ndsadad\nxaxasdasdhk djagd a\ndasjdgasds',
        oldValue: 'saasa\ndsadad\nxaxasdasdhk djagd a\ndasjdgas',
        timestamp: '2018-06-17T05:19:35.708654Z',
      },
      id: '3f4b8281-dd66-42ff-a996-3b5807191e51',
      relationships: {
        modifier: {
          data: {
            id: '86c20119-9442-4459-940d-33ef9c628760',
            links: {
              related:
                'https://api.prod-preview.openshift.io/api/users/86c20119-9442-4459-940d-33ef9c628760',
            },
            type: 'identities',
          },
        },
      },
      type: 'events',
    },
    {
      attributes: {
        name: 'component',
        newValue: '',
        oldValue: 'saasa\ndsadad\nxaxasdasdhk djagd a\ndasjdgasds',
        timestamp: '2018-06-17T05:19:49.699657Z',
      },
      id: '02d24174-901a-44b2-9108-58fd79a1d246',
      relationships: {
        modifier: {
          data: {
            id: '86c20119-9442-4459-940d-33ef9c628760',
            links: {
              related:
                'https://api.prod-preview.openshift.io/api/users/86c20119-9442-4459-940d-33ef9c628760',
            },
            type: 'identities',
          },
        },
      },
      type: 'events',
    },
    {
      attributes: {
        name: 'component',
        newValue: 'sss',
        oldValue: '',
        timestamp: '2018-06-17T05:20:03.92899Z',
      },
      id: '6480d26e-b7cd-416f-9e97-1230afaa7adf',
      relationships: {
        modifier: {
          data: {
            id: '86c20119-9442-4459-940d-33ef9c628760',
            links: {
              related:
                'https://api.prod-preview.openshift.io/api/users/86c20119-9442-4459-940d-33ef9c628760',
            },
            type: 'identities',
          },
        },
      },
      type: 'events',
    },
    {
      attributes: {
        name: 'effort',
        newValue: '12.65',
        oldValue: '',
        timestamp: '2018-06-17T05:20:11.105416Z',
      },
      id: '07b3a790-ec87-462f-9768-849a02df25cf',
      relationships: {
        modifier: {
          data: {
            id: '86c20119-9442-4459-940d-33ef9c628760',
            links: {
              related:
                'https://api.prod-preview.openshift.io/api/users/86c20119-9442-4459-940d-33ef9c628760',
            },
            type: 'identities',
          },
        },
      },
      type: 'events',
    },
  ],
};

export const commentsSnapshot = {
  data: [
    {
      attributes: {
        body: 'This is a comment.',
        'body.rendered': '\u003cp\u003eThis is a comment.\u003c/p\u003e\n',
        'created-at': '2018-06-28T04:16:02.288704Z',
        markup: 'Markdown',
        'updated-at': '2018-06-28T04:16:02.288704Z',
      },
      id: '02654ccf-a242-4812-894f-e29e53f90b23',
      links: {
        related:
          'https://api.prod-preview.openshift.io/api/comments/02654ccf-a242-4812-894f-e29e53f90b23',
        self:
          'https://api.prod-preview.openshift.io/api/comments/02654ccf-a242-4812-894f-e29e53f90b23',
      },
      relationships: {
        'created-by': {
          data: {
            id: '86c20119-9442-4459-940d-33ef9c628760',
            type: 'identities',
          },
          links: {
            related:
              'https://api.prod-preview.openshift.io/api/users/86c20119-9442-4459-940d-33ef9c628760',
          },
        },
        creator: {
          data: {
            id: '86c20119-9442-4459-940d-33ef9c628760',
            links: {
              related:
                'https://api.prod-preview.openshift.io/api/users/86c20119-9442-4459-940d-33ef9c628760',
            },
            type: 'identities',
          },
        },
      },
      type: 'comments',
    },
  ],
  links: {
    first:
      'https://api.prod-preview.openshift.io/api/workitems/089e7ad6-289f-4cef-9304-a3988f144a3e/comments?page[offset]=0\u0026page[limit]=20',
    last:
      'https://api.prod-preview.openshift.io/api/workitems/089e7ad6-289f-4cef-9304-a3988f144a3e/comments?page[offset]=0\u0026page[limit]=20',
  },
  meta: {
    totalCount: 1,
  },
};

export const linkResponseSnapShot = {
  data: [
    {
      attributes: {
        'created-at': '2018-06-16T11:36:10.68805Z',
        'updated-at': '2018-06-16T11:36:10.68805Z',
        version: 0,
      },
      id: '9e23a469-3957-4bc8-bc8f-030dc1403338',
      links: {
        self:
          'https://api.prod-preview.openshift.io/api/workitemlinks/9e23a469-3957-4bc8-bc8f-030dc1403338',
      },
      relationships: {
        link_type: {
          data: {
            id: '25c326a7-6d03-4f5a-b23b-86a9ee4171e9',
            type: 'workitemlinktypes',
          },
          links: {
            self:
              'https://api.prod-preview.openshift.io/api/workitemlinktypes/25c326a7-6d03-4f5a-b23b-86a9ee4171e9',
          },
        },
        source: {
          data: {
            id: 'a54fb25c-71f6-40e0-bd4c-638992e3faf5',
            type: 'workitems',
          },
          links: {
            related:
              'https://api.prod-preview.openshift.io/api/workitems/a54fb25c-71f6-40e0-bd4c-638992e3faf5',
          },
        },
        target: {
          data: {
            id: '089e7ad6-289f-4cef-9304-a3988f144a3e',
            type: 'workitems',
          },
          links: {
            related:
              'https://api.prod-preview.openshift.io/api/workitems/089e7ad6-289f-4cef-9304-a3988f144a3e',
          },
        },
      },
      type: 'workitemlinks',
    },
    {
      attributes: {
        'created-at': '2018-06-16T11:37:47.168205Z',
        'updated-at': '2018-06-16T11:37:47.168205Z',
        version: 0,
      },
      id: '73796e36-40ce-429b-9598-a290c0020b84',
      links: {
        self:
          'https://api.prod-preview.openshift.io/api/workitemlinks/73796e36-40ce-429b-9598-a290c0020b84',
      },
      relationships: {
        link_type: {
          data: {
            id: '25c326a7-6d03-4f5a-b23b-86a9ee4171e9',
            type: 'workitemlinktypes',
          },
          links: {
            self:
              'https://api.prod-preview.openshift.io/api/workitemlinktypes/25c326a7-6d03-4f5a-b23b-86a9ee4171e9',
          },
        },
        source: {
          data: {
            id: '089e7ad6-289f-4cef-9304-a3988f144a3e',
            type: 'workitems',
          },
          links: {
            related:
              'https://api.prod-preview.openshift.io/api/workitems/089e7ad6-289f-4cef-9304-a3988f144a3e',
          },
        },
        target: {
          data: {
            id: 'd09c29de-98d4-49df-b707-9407df90a1f7',
            type: 'workitems',
          },
          links: {
            related:
              'https://api.prod-preview.openshift.io/api/workitems/d09c29de-98d4-49df-b707-9407df90a1f7',
          },
        },
      },
      type: 'workitemlinks',
    },
    {
      attributes: {
        'created-at': '2018-06-17T10:03:49.730011Z',
        'updated-at': '2018-06-17T10:03:49.730011Z',
        version: 0,
      },
      id: '7a91995e-e9dd-4081-8ef0-70fdf8f01e9d',
      links: {
        self:
          'https://api.prod-preview.openshift.io/api/workitemlinks/7a91995e-e9dd-4081-8ef0-70fdf8f01e9d',
      },
      relationships: {
        link_type: {
          data: {
            id: '25c326a7-6d03-4f5a-b23b-86a9ee4171e9',
            type: 'workitemlinktypes',
          },
          links: {
            self:
              'https://api.prod-preview.openshift.io/api/workitemlinktypes/25c326a7-6d03-4f5a-b23b-86a9ee4171e9',
          },
        },
        source: {
          data: {
            id: '089e7ad6-289f-4cef-9304-a3988f144a3e',
            type: 'workitems',
          },
          links: {
            related:
              'https://api.prod-preview.openshift.io/api/workitems/089e7ad6-289f-4cef-9304-a3988f144a3e',
          },
        },
        target: {
          data: {
            id: '9606a210-c92a-4947-8957-cb791594fcc6',
            type: 'workitems',
          },
          links: {
            related:
              'https://api.prod-preview.openshift.io/api/workitems/9606a210-c92a-4947-8957-cb791594fcc6',
          },
        },
      },
      type: 'workitemlinks',
    },
  ],
  included: [
    {
      attributes: {
        'created-at': '0001-01-01T00:00:00Z',
        description: 'One work item is the parent of another one.',
        forward_name: 'is parent of',
        name: 'Parenting',
        reverse_name: 'is child of',
        topology: 'tree',
        'updated-at': '2018-06-27T11:12:43.660384Z',
        version: 3769,
      },
      id: '25c326a7-6d03-4f5a-b23b-86a9ee4171e9',
      relationships: {
        link_category: {
          data: {
            id: 'b1482c65-a64d-4058-beb0-62f7198cb0f4',
            type: 'workitemlinkcategories',
          },
          links: {
            related:
              'https://api.prod-preview.openshift.io/api/workitemlinkcategories/b1482c65-a64d-4058-beb0-62f7198cb0f4',
            self:
              'https://api.prod-preview.openshift.io/api/workitemlinkcategories/b1482c65-a64d-4058-beb0-62f7198cb0f4',
          },
        },
        space: {
          data: {
            id: '2e0698d8-753e-4cef-bb7c-f027634824a2',
            type: 'spaces',
          },
          links: {
            related:
              'https://api.prod-preview.openshift.io/api/spaces/2e0698d8-753e-4cef-bb7c-f027634824a2',
            self:
              'https://api.prod-preview.openshift.io/api/spaces/2e0698d8-753e-4cef-bb7c-f027634824a2',
          },
        },
        space_template: {
          data: {
            id: '1f48b7bf-bc51-4823-8101-9f10039035ba',
            type: 'spacetemplates',
          },
          links: {
            related:
              'https://api.prod-preview.openshift.io/api/spacetemplates/1f48b7bf-bc51-4823-8101-9f10039035ba',
            self:
              'https://api.prod-preview.openshift.io/api/spacetemplates/1f48b7bf-bc51-4823-8101-9f10039035ba',
          },
        },
      },
      type: 'workitemlinktypes',
    },
    {
      attributes: {
        acceptance_criteria: null,
        business_value: null,
        component: 'Hello world',
        effort: 10,
        'system.created_at': '2018-06-14T13:33:14.537102Z',
        'system.description': '',
        'system.description.markup': 'PlainText',
        'system.description.rendered': '',
        'system.number': 3,
        'system.order': 3000,
        'system.remote_item_id': null,
        'system.state': 'New',
        'system.title': 'Epic - 1',
        'system.updated_at': '2018-06-16T11:34:22.665617Z',
        time_criticality: 11,
        version: 17,
      },
      id: 'a54fb25c-71f6-40e0-bd4c-638992e3faf5',
      links: {
        related:
          'https://api.prod-preview.openshift.io/api/workitems/a54fb25c-71f6-40e0-bd4c-638992e3faf5',
        self:
          'https://api.prod-preview.openshift.io/api/workitems/a54fb25c-71f6-40e0-bd4c-638992e3faf5',
      },
      relationships: {
        area: {
          data: {
            id: 'f4f5a8e1-abd4-463b-9bc3-7a652fa91d9e',
            links: {
              related:
                'https://api.prod-preview.openshift.io/api/areas/f4f5a8e1-abd4-463b-9bc3-7a652fa91d9e',
              self:
                'https://api.prod-preview.openshift.io/api/areas/f4f5a8e1-abd4-463b-9bc3-7a652fa91d9e',
            },
            type: 'areas',
          },
        },
        assignees: {
          data: [
            {
              id: '86c20119-9442-4459-940d-33ef9c628760',
              links: {
                related:
                  'https://api.prod-preview.openshift.io/api/users/86c20119-9442-4459-940d-33ef9c628760',
                self:
                  'https://api.prod-preview.openshift.io/api/users/86c20119-9442-4459-940d-33ef9c628760',
              },
              type: 'users',
            },
          ],
        },
        baseType: {
          data: {
            id: '2c169431-a55d-49eb-af74-cc19e895356f',
            type: 'workitemtypes',
          },
          links: {
            self:
              'https://api.prod-preview.openshift.io/api/workitemtypes/2c169431-a55d-49eb-af74-cc19e895356f',
          },
        },
        children: {
          links: {
            related:
              'https://api.prod-preview.openshift.io/api/workitems/a54fb25c-71f6-40e0-bd4c-638992e3faf5/children',
          },
        },
        comments: {
          links: {
            related:
              'https://api.prod-preview.openshift.io/api/workitems/a54fb25c-71f6-40e0-bd4c-638992e3faf5/comments',
            self:
              'https://api.prod-preview.openshift.io/api/workitems/a54fb25c-71f6-40e0-bd4c-638992e3faf5/relationships/comments',
          },
        },
        creator: {
          data: {
            id: '86c20119-9442-4459-940d-33ef9c628760',
            links: {
              related:
                'https://api.prod-preview.openshift.io/api/users/86c20119-9442-4459-940d-33ef9c628760',
              self:
                'https://api.prod-preview.openshift.io/api/users/86c20119-9442-4459-940d-33ef9c628760',
            },
            type: 'users',
          },
        },
        events: {
          links: {
            related:
              'https://api.prod-preview.openshift.io/api/workitems/a54fb25c-71f6-40e0-bd4c-638992e3faf5/events',
          },
        },
        iteration: {
          data: {
            id: '4734cbb8-46cc-42ed-b47b-5ab497b4f418',
            links: {
              related:
                'https://api.prod-preview.openshift.io/api/iterations/4734cbb8-46cc-42ed-b47b-5ab497b4f418',
              self:
                'https://api.prod-preview.openshift.io/api/iterations/4734cbb8-46cc-42ed-b47b-5ab497b4f418',
            },
            type: 'iterations',
          },
        },
        labels: {
          data: [
            {
              id: '6bab05ad-56fd-4f96-bc12-bbfc8f4a1f65',
              type: 'labels',
            },
          ],
          links: {
            related:
              'https://api.prod-preview.openshift.io/api/workitems/a54fb25c-71f6-40e0-bd4c-638992e3faf5/labels',
          },
        },
        space: {
          data: {
            id: 'fd332182-df3d-4ea1-b4f6-df225849b856',
            type: 'spaces',
          },
          links: {
            related:
              'https://api.prod-preview.openshift.io/api/spaces/fd332182-df3d-4ea1-b4f6-df225849b856',
            self:
              'https://api.prod-preview.openshift.io/api/spaces/fd332182-df3d-4ea1-b4f6-df225849b856',
          },
        },
        workItemLinks: {
          links: {
            related:
              'https://api.prod-preview.openshift.io/api/workitems/a54fb25c-71f6-40e0-bd4c-638992e3faf5/links',
          },
        },
      },
      type: 'workitems',
    },
    {
      attributes: {
        acceptance_criteria: null,
        component: 'sss',
        effort: 12.65,
        'system.created_at': '2018-06-16T11:36:09.41232Z',
        'system.description': '',
        'system.description.markup': 'PlainText',
        'system.description.rendered': '',
        'system.number': 5,
        'system.order': 5000,
        'system.remote_item_id': null,
        'system.state': 'New',
        'system.title': 'Story',
        'system.updated_at': '2018-06-17T05:20:11.10289Z',
        version: 20,
      },
      id: '089e7ad6-289f-4cef-9304-a3988f144a3e',
      links: {
        related:
          'https://api.prod-preview.openshift.io/api/workitems/089e7ad6-289f-4cef-9304-a3988f144a3e',
        self:
          'https://api.prod-preview.openshift.io/api/workitems/089e7ad6-289f-4cef-9304-a3988f144a3e',
      },
      relationships: {
        area: {
          data: {
            id: 'f4f5a8e1-abd4-463b-9bc3-7a652fa91d9e',
            links: {
              related:
                'https://api.prod-preview.openshift.io/api/areas/f4f5a8e1-abd4-463b-9bc3-7a652fa91d9e',
              self:
                'https://api.prod-preview.openshift.io/api/areas/f4f5a8e1-abd4-463b-9bc3-7a652fa91d9e',
            },
            type: 'areas',
          },
        },
        assignees: {},
        baseType: {
          data: {
            id: '6ff83406-caa7-47a9-9200-4ca796be11bb',
            type: 'workitemtypes',
          },
          links: {
            self:
              'https://api.prod-preview.openshift.io/api/workitemtypes/6ff83406-caa7-47a9-9200-4ca796be11bb',
          },
        },
        children: {
          links: {
            related:
              'https://api.prod-preview.openshift.io/api/workitems/089e7ad6-289f-4cef-9304-a3988f144a3e/children',
          },
        },
        comments: {
          links: {
            related:
              'https://api.prod-preview.openshift.io/api/workitems/089e7ad6-289f-4cef-9304-a3988f144a3e/comments',
            self:
              'https://api.prod-preview.openshift.io/api/workitems/089e7ad6-289f-4cef-9304-a3988f144a3e/relationships/comments',
          },
        },
        creator: {
          data: {
            id: '86c20119-9442-4459-940d-33ef9c628760',
            links: {
              related:
                'https://api.prod-preview.openshift.io/api/users/86c20119-9442-4459-940d-33ef9c628760',
              self:
                'https://api.prod-preview.openshift.io/api/users/86c20119-9442-4459-940d-33ef9c628760',
            },
            type: 'users',
          },
        },
        events: {
          links: {
            related:
              'https://api.prod-preview.openshift.io/api/workitems/089e7ad6-289f-4cef-9304-a3988f144a3e/events',
          },
        },
        iteration: {
          data: {
            id: '4734cbb8-46cc-42ed-b47b-5ab497b4f418',
            links: {
              related:
                'https://api.prod-preview.openshift.io/api/iterations/4734cbb8-46cc-42ed-b47b-5ab497b4f418',
              self:
                'https://api.prod-preview.openshift.io/api/iterations/4734cbb8-46cc-42ed-b47b-5ab497b4f418',
            },
            type: 'iterations',
          },
        },
        labels: {
          links: {
            related:
              'https://api.prod-preview.openshift.io/api/workitems/089e7ad6-289f-4cef-9304-a3988f144a3e/labels',
          },
        },
        space: {
          data: {
            id: 'fd332182-df3d-4ea1-b4f6-df225849b856',
            type: 'spaces',
          },
          links: {
            related:
              'https://api.prod-preview.openshift.io/api/spaces/fd332182-df3d-4ea1-b4f6-df225849b856',
            self:
              'https://api.prod-preview.openshift.io/api/spaces/fd332182-df3d-4ea1-b4f6-df225849b856',
          },
        },
        workItemLinks: {
          links: {
            related:
              'https://api.prod-preview.openshift.io/api/workitems/089e7ad6-289f-4cef-9304-a3988f144a3e/links',
          },
        },
      },
      type: 'workitems',
    },
    {
      attributes: {
        'system.created_at': '2018-06-16T11:37:46.265715Z',
        'system.description': '',
        'system.description.markup': 'PlainText',
        'system.description.rendered': '',
        'system.number': 6,
        'system.order': 6000,
        'system.remote_item_id': null,
        'system.state': 'New',
        'system.title': 'Task - 1',
        'system.updated_at': '2018-06-16T11:37:46.265715Z',
        version: 0,
      },
      id: 'd09c29de-98d4-49df-b707-9407df90a1f7',
      links: {
        related:
          'https://api.prod-preview.openshift.io/api/workitems/d09c29de-98d4-49df-b707-9407df90a1f7',
        self:
          'https://api.prod-preview.openshift.io/api/workitems/d09c29de-98d4-49df-b707-9407df90a1f7',
      },
      relationships: {
        area: {
          data: {
            id: 'f4f5a8e1-abd4-463b-9bc3-7a652fa91d9e',
            links: {
              related:
                'https://api.prod-preview.openshift.io/api/areas/f4f5a8e1-abd4-463b-9bc3-7a652fa91d9e',
              self:
                'https://api.prod-preview.openshift.io/api/areas/f4f5a8e1-abd4-463b-9bc3-7a652fa91d9e',
            },
            type: 'areas',
          },
        },
        assignees: {},
        baseType: {
          data: {
            id: '2853459d-60ef-4fbe-aaf4-eccb9f554b34',
            type: 'workitemtypes',
          },
          links: {
            self:
              'https://api.prod-preview.openshift.io/api/workitemtypes/2853459d-60ef-4fbe-aaf4-eccb9f554b34',
          },
        },
        children: {
          links: {
            related:
              'https://api.prod-preview.openshift.io/api/workitems/d09c29de-98d4-49df-b707-9407df90a1f7/children',
          },
        },
        comments: {
          links: {
            related:
              'https://api.prod-preview.openshift.io/api/workitems/d09c29de-98d4-49df-b707-9407df90a1f7/comments',
            self:
              'https://api.prod-preview.openshift.io/api/workitems/d09c29de-98d4-49df-b707-9407df90a1f7/relationships/comments',
          },
        },
        creator: {
          data: {
            id: '86c20119-9442-4459-940d-33ef9c628760',
            links: {
              related:
                'https://api.prod-preview.openshift.io/api/users/86c20119-9442-4459-940d-33ef9c628760',
              self:
                'https://api.prod-preview.openshift.io/api/users/86c20119-9442-4459-940d-33ef9c628760',
            },
            type: 'users',
          },
        },
        events: {
          links: {
            related:
              'https://api.prod-preview.openshift.io/api/workitems/d09c29de-98d4-49df-b707-9407df90a1f7/events',
          },
        },
        iteration: {
          data: {
            id: '4734cbb8-46cc-42ed-b47b-5ab497b4f418',
            links: {
              related:
                'https://api.prod-preview.openshift.io/api/iterations/4734cbb8-46cc-42ed-b47b-5ab497b4f418',
              self:
                'https://api.prod-preview.openshift.io/api/iterations/4734cbb8-46cc-42ed-b47b-5ab497b4f418',
            },
            type: 'iterations',
          },
        },
        labels: {
          links: {
            related:
              'https://api.prod-preview.openshift.io/api/workitems/d09c29de-98d4-49df-b707-9407df90a1f7/labels',
          },
        },
        space: {
          data: {
            id: 'fd332182-df3d-4ea1-b4f6-df225849b856',
            type: 'spaces',
          },
          links: {
            related:
              'https://api.prod-preview.openshift.io/api/spaces/fd332182-df3d-4ea1-b4f6-df225849b856',
            self:
              'https://api.prod-preview.openshift.io/api/spaces/fd332182-df3d-4ea1-b4f6-df225849b856',
          },
        },
        workItemLinks: {
          links: {
            related:
              'https://api.prod-preview.openshift.io/api/workitems/d09c29de-98d4-49df-b707-9407df90a1f7/links',
          },
        },
      },
      type: 'workitems',
    },
    {
      attributes: {
        effort: null,
        environment: null,
        priority: 'P2 - High',
        repro_steps: null,
        resolution: 'Done',
        severity: 'SEV1 - Urgent',
        'system.created_at': '2018-06-17T10:03:47.532265Z',
        'system.description': '',
        'system.description.markup': 'PlainText',
        'system.description.rendered': '',
        'system.number': 7,
        'system.order': 7000,
        'system.remote_item_id': null,
        'system.state': 'New',
        'system.title': 'Defect',
        'system.updated_at': '2018-06-17T10:04:46.41688Z',
        version: 1,
      },
      id: '9606a210-c92a-4947-8957-cb791594fcc6',
      links: {
        related:
          'https://api.prod-preview.openshift.io/api/workitems/9606a210-c92a-4947-8957-cb791594fcc6',
        self:
          'https://api.prod-preview.openshift.io/api/workitems/9606a210-c92a-4947-8957-cb791594fcc6',
      },
      relationships: {
        area: {
          data: {
            id: 'f4f5a8e1-abd4-463b-9bc3-7a652fa91d9e',
            links: {
              related:
                'https://api.prod-preview.openshift.io/api/areas/f4f5a8e1-abd4-463b-9bc3-7a652fa91d9e',
              self:
                'https://api.prod-preview.openshift.io/api/areas/f4f5a8e1-abd4-463b-9bc3-7a652fa91d9e',
            },
            type: 'areas',
          },
        },
        assignees: {},
        baseType: {
          data: {
            id: 'fce0921f-ea70-4513-bb91-31d3aa8017f1',
            type: 'workitemtypes',
          },
          links: {
            self:
              'https://api.prod-preview.openshift.io/api/workitemtypes/fce0921f-ea70-4513-bb91-31d3aa8017f1',
          },
        },
        children: {
          links: {
            related:
              'https://api.prod-preview.openshift.io/api/workitems/9606a210-c92a-4947-8957-cb791594fcc6/children',
          },
        },
        comments: {
          links: {
            related:
              'https://api.prod-preview.openshift.io/api/workitems/9606a210-c92a-4947-8957-cb791594fcc6/comments',
            self:
              'https://api.prod-preview.openshift.io/api/workitems/9606a210-c92a-4947-8957-cb791594fcc6/relationships/comments',
          },
        },
        creator: {
          data: {
            id: '86c20119-9442-4459-940d-33ef9c628760',
            links: {
              related:
                'https://api.prod-preview.openshift.io/api/users/86c20119-9442-4459-940d-33ef9c628760',
              self:
                'https://api.prod-preview.openshift.io/api/users/86c20119-9442-4459-940d-33ef9c628760',
            },
            type: 'users',
          },
        },
        events: {
          links: {
            related:
              'https://api.prod-preview.openshift.io/api/workitems/9606a210-c92a-4947-8957-cb791594fcc6/events',
          },
        },
        iteration: {
          data: {
            id: '4734cbb8-46cc-42ed-b47b-5ab497b4f418',
            links: {
              related:
                'https://api.prod-preview.openshift.io/api/iterations/4734cbb8-46cc-42ed-b47b-5ab497b4f418',
              self:
                'https://api.prod-preview.openshift.io/api/iterations/4734cbb8-46cc-42ed-b47b-5ab497b4f418',
            },
            type: 'iterations',
          },
        },
        labels: {
          links: {
            related:
              'https://api.prod-preview.openshift.io/api/workitems/9606a210-c92a-4947-8957-cb791594fcc6/labels',
          },
        },
        space: {
          data: {
            id: 'fd332182-df3d-4ea1-b4f6-df225849b856',
            type: 'spaces',
          },
          links: {
            related:
              'https://api.prod-preview.openshift.io/api/spaces/fd332182-df3d-4ea1-b4f6-df225849b856',
            self:
              'https://api.prod-preview.openshift.io/api/spaces/fd332182-df3d-4ea1-b4f6-df225849b856',
          },
        },
        workItemLinks: {
          links: {
            related:
              'https://api.prod-preview.openshift.io/api/workitems/9606a210-c92a-4947-8957-cb791594fcc6/links',
          },
        },
      },
      type: 'workitems',
    },
  ],
  meta: {
    totalCount: 3,
  },
};

export const resolveLinkExpectedOutputSnapShot = [
  linkResponseSnapShot.data,
  linkResponseSnapShot.included,
];

export const workItemTypesResponseSnapshot = {
  data: [
    {
      attributes: {
        'can-construct': true,
        'created-at': '0001-01-01T00:00:00Z',
        description: 'TBD',
        fields: {
          'system.area': {
            description: 'The area to which the work item belongs',
            label: 'Area',
            required: false,
            type: {
              kind: 'area',
            },
          },
          'system.assignees': {
            description: 'The users that are assigned to the work item',
            label: 'Assignees',
            required: false,
            type: {
              componentType: 'user',
              kind: 'list',
            },
          },
          'system.codebase': {
            description: 'Contains codebase attributes to which this WI belongs to',
            label: 'Codebase',
            required: false,
            type: {
              kind: 'codebase',
            },
          },
          'system.created_at': {
            description: 'The date and time when the work item was created',
            label: 'Created at',
            required: false,
            type: {
              kind: 'instant',
            },
          },
          'system.creator': {
            description: 'The user that created the work item',
            label: 'Creator',
            required: true,
            type: {
              kind: 'user',
            },
          },
          'system.description': {
            description: 'A descriptive text of the work item',
            label: 'Description',
            required: false,
            type: {
              kind: 'markup',
            },
          },
          'system.iteration': {
            description: 'The iteration to which the work item belongs',
            label: 'Iteration',
            required: false,
            type: {
              kind: 'iteration',
            },
          },
          'system.labels': {
            description: 'List of labels attached to the work item',
            label: 'Labels',
            required: false,
            type: {
              componentType: 'label',
              kind: 'list',
            },
          },
          'system.number': {
            description: 'The unique number that was given to this workitem within its space.',
            label: 'Number',
            required: false,
            type: {
              kind: 'integer',
            },
          },
          'system.order': {
            description: 'Execution Order of the workitem',
            label: 'Execution Order',
            required: false,
            type: {
              kind: 'float',
            },
          },
          'system.remote_item_id': {
            description: 'The ID of the remote work item',
            label: 'Remote item',
            required: false,
            type: {
              kind: 'string',
            },
          },
          'system.state': {
            description: 'The state of the work item',
            label: 'State',
            required: true,
            type: {
              baseType: 'string',
              kind: 'enum',
              values: ['new', 'open', 'in progress', 'resolved', 'closed'],
            },
          },
          'system.title': {
            description: 'The title text of the work item',
            label: 'Title',
            required: true,
            type: {
              kind: 'string',
            },
          },
          'system.updated_at': {
            description: 'The date and time when the work item was last updated',
            label: 'Updated at',
            required: false,
            type: {
              kind: 'instant',
            },
          },
        },
        icon: 'fa fa-university',
        name: 'Fundamental',
        'updated-at': '2018-06-28T08:50:11.598499Z',
        version: 0,
      },
      id: 'ee7ca005-f81d-4eea-9b9b-1965df0988d0',
      relationships: {
        guidedChildTypes: {
          data: [
            {
              id: 'b9a71831-c803-4f66-8774-4193fffd1311',
              type: 'workitemtypes',
            },
            {
              id: '3194ab60-855b-4155-9005-9dce4a05f1eb',
              type: 'workitemtypes',
            },
          ],
        },
        space: {
          data: {
            id: '2e0698d8-753e-4cef-bb7c-f027634824a2',
            type: 'spaces',
          },
          links: {
            related:
              'https://api.prod-preview.openshift.io/api/spaces/2e0698d8-753e-4cef-bb7c-f027634824a2',
            self:
              'https://api.prod-preview.openshift.io/api/spaces/2e0698d8-753e-4cef-bb7c-f027634824a2',
          },
        },
        space_template: {
          data: {
            id: '929c963a-174c-4c37-b487-272067e88bd4',
            type: 'spacetemplates',
          },
          links: {
            related:
              'https://api.prod-preview.openshift.io/api/spacetemplates/929c963a-174c-4c37-b487-272067e88bd4',
            self:
              'https://api.prod-preview.openshift.io/api/spacetemplates/929c963a-174c-4c37-b487-272067e88bd4',
          },
        },
      },
      type: 'workitemtypes',
    },
    {
      attributes: {
        'can-construct': true,
        'created-at': '0001-01-01T00:00:00Z',
        description: 'TBD',
        fields: {
          'system.area': {
            description: 'The area to which the work item belongs',
            label: 'Area',
            required: false,
            type: {
              kind: 'area',
            },
          },
          'system.assignees': {
            description: 'The users that are assigned to the work item',
            label: 'Assignees',
            required: false,
            type: {
              componentType: 'user',
              kind: 'list',
            },
          },
          'system.codebase': {
            description: 'Contains codebase attributes to which this WI belongs to',
            label: 'Codebase',
            required: false,
            type: {
              kind: 'codebase',
            },
          },
          'system.created_at': {
            description: 'The date and time when the work item was created',
            label: 'Created at',
            required: false,
            type: {
              kind: 'instant',
            },
          },
          'system.creator': {
            description: 'The user that created the work item',
            label: 'Creator',
            required: true,
            type: {
              kind: 'user',
            },
          },
          'system.description': {
            description: 'A descriptive text of the work item',
            label: 'Description',
            required: false,
            type: {
              kind: 'markup',
            },
          },
          'system.iteration': {
            description: 'The iteration to which the work item belongs',
            label: 'Iteration',
            required: false,
            type: {
              kind: 'iteration',
            },
          },
          'system.labels': {
            description: 'List of labels attached to the work item',
            label: 'Labels',
            required: false,
            type: {
              componentType: 'label',
              kind: 'list',
            },
          },
          'system.number': {
            description: 'The unique number that was given to this workitem within its space.',
            label: 'Number',
            required: false,
            type: {
              kind: 'integer',
            },
          },
          'system.order': {
            description: 'Execution Order of the workitem',
            label: 'Execution Order',
            required: false,
            type: {
              kind: 'float',
            },
          },
          'system.remote_item_id': {
            description: 'The ID of the remote work item',
            label: 'Remote item',
            required: false,
            type: {
              kind: 'string',
            },
          },
          'system.state': {
            description: 'The state of the work item',
            label: 'State',
            required: true,
            type: {
              baseType: 'string',
              kind: 'enum',
              values: ['new', 'open', 'in progress', 'resolved', 'closed'],
            },
          },
          'system.title': {
            description: 'The title text of the work item',
            label: 'Title',
            required: true,
            type: {
              kind: 'string',
            },
          },
          'system.updated_at': {
            description: 'The date and time when the work item was last updated',
            label: 'Updated at',
            required: false,
            type: {
              kind: 'instant',
            },
          },
        },
        icon: 'fa fa-bullseye',
        name: 'Scenario',
        'updated-at': '2018-06-28T08:50:11.384153Z',
        version: 0,
      },
      id: '71171e90-6d35-498f-a6a7-2083b5267c18',
      relationships: {
        guidedChildTypes: {
          data: [
            {
              id: 'b9a71831-c803-4f66-8774-4193fffd1311',
              type: 'workitemtypes',
            },
            {
              id: '3194ab60-855b-4155-9005-9dce4a05f1eb',
              type: 'workitemtypes',
            },
          ],
        },
        space: {
          data: {
            id: '2e0698d8-753e-4cef-bb7c-f027634824a2',
            type: 'spaces',
          },
          links: {
            related:
              'https://api.prod-preview.openshift.io/api/spaces/2e0698d8-753e-4cef-bb7c-f027634824a2',
            self:
              'https://api.prod-preview.openshift.io/api/spaces/2e0698d8-753e-4cef-bb7c-f027634824a2',
          },
        },
        space_template: {
          data: {
            id: '929c963a-174c-4c37-b487-272067e88bd4',
            type: 'spacetemplates',
          },
          links: {
            related:
              'https://api.prod-preview.openshift.io/api/spacetemplates/929c963a-174c-4c37-b487-272067e88bd4',
            self:
              'https://api.prod-preview.openshift.io/api/spacetemplates/929c963a-174c-4c37-b487-272067e88bd4',
          },
        },
      },
      type: 'workitemtypes',
    },
    {
      attributes: {
        'can-construct': true,
        'created-at': '0001-01-01T00:00:00Z',
        description: 'TBD',
        fields: {
          'system.area': {
            description: 'The area to which the work item belongs',
            label: 'Area',
            required: false,
            type: {
              kind: 'area',
            },
          },
          'system.assignees': {
            description: 'The users that are assigned to the work item',
            label: 'Assignees',
            required: false,
            type: {
              componentType: 'user',
              kind: 'list',
            },
          },
          'system.codebase': {
            description: 'Contains codebase attributes to which this WI belongs to',
            label: 'Codebase',
            required: false,
            type: {
              kind: 'codebase',
            },
          },
          'system.created_at': {
            description: 'The date and time when the work item was created',
            label: 'Created at',
            required: false,
            type: {
              kind: 'instant',
            },
          },
          'system.creator': {
            description: 'The user that created the work item',
            label: 'Creator',
            required: true,
            type: {
              kind: 'user',
            },
          },
          'system.description': {
            description: 'A descriptive text of the work item',
            label: 'Description',
            required: false,
            type: {
              kind: 'markup',
            },
          },
          'system.iteration': {
            description: 'The iteration to which the work item belongs',
            label: 'Iteration',
            required: false,
            type: {
              kind: 'iteration',
            },
          },
          'system.labels': {
            description: 'List of labels attached to the work item',
            label: 'Labels',
            required: false,
            type: {
              componentType: 'label',
              kind: 'list',
            },
          },
          'system.number': {
            description: 'The unique number that was given to this workitem within its space.',
            label: 'Number',
            required: false,
            type: {
              kind: 'integer',
            },
          },
          'system.order': {
            description: 'Execution Order of the workitem',
            label: 'Execution Order',
            required: false,
            type: {
              kind: 'float',
            },
          },
          'system.remote_item_id': {
            description: 'The ID of the remote work item',
            label: 'Remote item',
            required: false,
            type: {
              kind: 'string',
            },
          },
          'system.state': {
            description: 'The state of the work item',
            label: 'State',
            required: true,
            type: {
              baseType: 'string',
              kind: 'enum',
              values: ['new', 'open', 'in progress', 'resolved', 'closed'],
            },
          },
          'system.title': {
            description: 'The title text of the work item',
            label: 'Title',
            required: true,
            type: {
              kind: 'string',
            },
          },
          'system.updated_at': {
            description: 'The date and time when the work item was last updated',
            label: 'Updated at',
            required: false,
            type: {
              kind: 'instant',
            },
          },
        },
        icon: 'fa fa-bug',
        name: 'Bug',
        'updated-at': '2018-06-28T08:50:11.331753Z',
        version: 0,
      },
      id: '26787039-b68f-4e28-8814-c2f93be1ef4e',
      relationships: {
        guidedChildTypes: {
          data: [
            {
              id: 'bbf35418-04b6-426c-a60b-7f80beb0b624',
              type: 'workitemtypes',
            },
          ],
        },
        space: {
          data: {
            id: '2e0698d8-753e-4cef-bb7c-f027634824a2',
            type: 'spaces',
          },
          links: {
            related:
              'https://api.prod-preview.openshift.io/api/spaces/2e0698d8-753e-4cef-bb7c-f027634824a2',
            self:
              'https://api.prod-preview.openshift.io/api/spaces/2e0698d8-753e-4cef-bb7c-f027634824a2',
          },
        },
        space_template: {
          data: {
            id: '929c963a-174c-4c37-b487-272067e88bd4',
            type: 'spacetemplates',
          },
          links: {
            related:
              'https://api.prod-preview.openshift.io/api/spacetemplates/929c963a-174c-4c37-b487-272067e88bd4',
            self:
              'https://api.prod-preview.openshift.io/api/spacetemplates/929c963a-174c-4c37-b487-272067e88bd4',
          },
        },
      },
      type: 'workitemtypes',
    },
    {
      attributes: {
        'can-construct': true,
        'created-at': '0001-01-01T00:00:00Z',
        description: 'TBD',
        fields: {
          'system.area': {
            description: 'The area to which the work item belongs',
            label: 'Area',
            required: false,
            type: {
              kind: 'area',
            },
          },
          'system.assignees': {
            description: 'The users that are assigned to the work item',
            label: 'Assignees',
            required: false,
            type: {
              componentType: 'user',
              kind: 'list',
            },
          },
          'system.codebase': {
            description: 'Contains codebase attributes to which this WI belongs to',
            label: 'Codebase',
            required: false,
            type: {
              kind: 'codebase',
            },
          },
          'system.created_at': {
            description: 'The date and time when the work item was created',
            label: 'Created at',
            required: false,
            type: {
              kind: 'instant',
            },
          },
          'system.creator': {
            description: 'The user that created the work item',
            label: 'Creator',
            required: true,
            type: {
              kind: 'user',
            },
          },
          'system.description': {
            description: 'A descriptive text of the work item',
            label: 'Description',
            required: false,
            type: {
              kind: 'markup',
            },
          },
          'system.iteration': {
            description: 'The iteration to which the work item belongs',
            label: 'Iteration',
            required: false,
            type: {
              kind: 'iteration',
            },
          },
          'system.labels': {
            description: 'List of labels attached to the work item',
            label: 'Labels',
            required: false,
            type: {
              componentType: 'label',
              kind: 'list',
            },
          },
          'system.number': {
            description: 'The unique number that was given to this workitem within its space.',
            label: 'Number',
            required: false,
            type: {
              kind: 'integer',
            },
          },
          'system.order': {
            description: 'Execution Order of the workitem',
            label: 'Execution Order',
            required: false,
            type: {
              kind: 'float',
            },
          },
          'system.remote_item_id': {
            description: 'The ID of the remote work item',
            label: 'Remote item',
            required: false,
            type: {
              kind: 'string',
            },
          },
          'system.state': {
            description: 'The state of the work item',
            label: 'State',
            required: true,
            type: {
              baseType: 'string',
              kind: 'enum',
              values: ['new', 'open', 'in progress', 'resolved', 'closed'],
            },
          },
          'system.title': {
            description: 'The title text of the work item',
            label: 'Title',
            required: true,
            type: {
              kind: 'string',
            },
          },
          'system.updated_at': {
            description: 'The date and time when the work item was last updated',
            label: 'Updated at',
            required: false,
            type: {
              kind: 'instant',
            },
          },
        },
        icon: 'fa fa-tasks',
        name: 'Task',
        'updated-at': '2018-06-28T08:50:11.319344Z',
        version: 0,
      },
      id: 'bbf35418-04b6-426c-a60b-7f80beb0b624',
      relationships: {
        space: {
          data: {
            id: '2e0698d8-753e-4cef-bb7c-f027634824a2',
            type: 'spaces',
          },
          links: {
            related:
              'https://api.prod-preview.openshift.io/api/spaces/2e0698d8-753e-4cef-bb7c-f027634824a2',
            self:
              'https://api.prod-preview.openshift.io/api/spaces/2e0698d8-753e-4cef-bb7c-f027634824a2',
          },
        },
        space_template: {
          data: {
            id: '929c963a-174c-4c37-b487-272067e88bd4',
            type: 'spacetemplates',
          },
          links: {
            related:
              'https://api.prod-preview.openshift.io/api/spacetemplates/929c963a-174c-4c37-b487-272067e88bd4',
            self:
              'https://api.prod-preview.openshift.io/api/spacetemplates/929c963a-174c-4c37-b487-272067e88bd4',
          },
        },
      },
      type: 'workitemtypes',
    },
    {
      attributes: {
        'can-construct': true,
        'created-at': '0001-01-01T00:00:00Z',
        description: 'TBD',
        fields: {
          'system.area': {
            description: 'The area to which the work item belongs',
            label: 'Area',
            required: false,
            type: {
              kind: 'area',
            },
          },
          'system.assignees': {
            description: 'The users that are assigned to the work item',
            label: 'Assignees',
            required: false,
            type: {
              componentType: 'user',
              kind: 'list',
            },
          },
          'system.codebase': {
            description: 'Contains codebase attributes to which this WI belongs to',
            label: 'Codebase',
            required: false,
            type: {
              kind: 'codebase',
            },
          },
          'system.created_at': {
            description: 'The date and time when the work item was created',
            label: 'Created at',
            required: false,
            type: {
              kind: 'instant',
            },
          },
          'system.creator': {
            description: 'The user that created the work item',
            label: 'Creator',
            required: true,
            type: {
              kind: 'user',
            },
          },
          'system.description': {
            description: 'A descriptive text of the work item',
            label: 'Description',
            required: false,
            type: {
              kind: 'markup',
            },
          },
          'system.iteration': {
            description: 'The iteration to which the work item belongs',
            label: 'Iteration',
            required: false,
            type: {
              kind: 'iteration',
            },
          },
          'system.labels': {
            description: 'List of labels attached to the work item',
            label: 'Labels',
            required: false,
            type: {
              componentType: 'label',
              kind: 'list',
            },
          },
          'system.number': {
            description: 'The unique number that was given to this workitem within its space.',
            label: 'Number',
            required: false,
            type: {
              kind: 'integer',
            },
          },
          'system.order': {
            description: 'Execution Order of the workitem',
            label: 'Execution Order',
            required: false,
            type: {
              kind: 'float',
            },
          },
          'system.remote_item_id': {
            description: 'The ID of the remote work item',
            label: 'Remote item',
            required: false,
            type: {
              kind: 'string',
            },
          },
          'system.state': {
            description: 'The state of the work item',
            label: 'State',
            required: true,
            type: {
              baseType: 'string',
              kind: 'enum',
              values: ['new', 'open', 'in progress', 'resolved', 'closed'],
            },
          },
          'system.title': {
            description: 'The title text of the work item',
            label: 'Title',
            required: true,
            type: {
              kind: 'string',
            },
          },
          'system.updated_at': {
            description: 'The date and time when the work item was last updated',
            label: 'Updated at',
            required: false,
            type: {
              kind: 'instant',
            },
          },
        },
        icon: 'pficon pficon-infrastructure',
        name: 'Experience',
        'updated-at': '2018-06-28T08:50:11.357481Z',
        version: 0,
      },
      id: 'b9a71831-c803-4f66-8774-4193fffd1311',
      relationships: {
        guidedChildTypes: {
          data: [
            {
              id: '0a24d3c2-e0a6-4686-8051-ec0ea1915a28',
              type: 'workitemtypes',
            },
            {
              id: '26787039-b68f-4e28-8814-c2f93be1ef4e',
              type: 'workitemtypes',
            },
          ],
        },
        space: {
          data: {
            id: '2e0698d8-753e-4cef-bb7c-f027634824a2',
            type: 'spaces',
          },
          links: {
            related:
              'https://api.prod-preview.openshift.io/api/spaces/2e0698d8-753e-4cef-bb7c-f027634824a2',
            self:
              'https://api.prod-preview.openshift.io/api/spaces/2e0698d8-753e-4cef-bb7c-f027634824a2',
          },
        },
        space_template: {
          data: {
            id: '929c963a-174c-4c37-b487-272067e88bd4',
            type: 'spacetemplates',
          },
          links: {
            related:
              'https://api.prod-preview.openshift.io/api/spacetemplates/929c963a-174c-4c37-b487-272067e88bd4',
            self:
              'https://api.prod-preview.openshift.io/api/spacetemplates/929c963a-174c-4c37-b487-272067e88bd4',
          },
        },
      },
      type: 'workitemtypes',
    },
    {
      attributes: {
        'can-construct': true,
        'created-at': '0001-01-01T00:00:00Z',
        description: 'TBD',
        fields: {
          'system.area': {
            description: 'The area to which the work item belongs',
            label: 'Area',
            required: false,
            type: {
              kind: 'area',
            },
          },
          'system.assignees': {
            description: 'The users that are assigned to the work item',
            label: 'Assignees',
            required: false,
            type: {
              componentType: 'user',
              kind: 'list',
            },
          },
          'system.codebase': {
            description: 'Contains codebase attributes to which this WI belongs to',
            label: 'Codebase',
            required: false,
            type: {
              kind: 'codebase',
            },
          },
          'system.created_at': {
            description: 'The date and time when the work item was created',
            label: 'Created at',
            required: false,
            type: {
              kind: 'instant',
            },
          },
          'system.creator': {
            description: 'The user that created the work item',
            label: 'Creator',
            required: true,
            type: {
              kind: 'user',
            },
          },
          'system.description': {
            description: 'A descriptive text of the work item',
            label: 'Description',
            required: false,
            type: {
              kind: 'markup',
            },
          },
          'system.iteration': {
            description: 'The iteration to which the work item belongs',
            label: 'Iteration',
            required: false,
            type: {
              kind: 'iteration',
            },
          },
          'system.labels': {
            description: 'List of labels attached to the work item',
            label: 'Labels',
            required: false,
            type: {
              componentType: 'label',
              kind: 'list',
            },
          },
          'system.number': {
            description: 'The unique number that was given to this workitem within its space.',
            label: 'Number',
            required: false,
            type: {
              kind: 'integer',
            },
          },
          'system.order': {
            description: 'Execution Order of the workitem',
            label: 'Execution Order',
            required: false,
            type: {
              kind: 'float',
            },
          },
          'system.remote_item_id': {
            description: 'The ID of the remote work item',
            label: 'Remote item',
            required: false,
            type: {
              kind: 'string',
            },
          },
          'system.state': {
            description: 'The state of the work item',
            label: 'State',
            required: true,
            type: {
              baseType: 'string',
              kind: 'enum',
              values: ['new', 'open', 'in progress', 'resolved', 'closed'],
            },
          },
          'system.title': {
            description: 'The title text of the work item',
            label: 'Title',
            required: true,
            type: {
              kind: 'string',
            },
          },
          'system.updated_at': {
            description: 'The date and time when the work item was last updated',
            label: 'Updated at',
            required: false,
            type: {
              kind: 'instant',
            },
          },
        },
        icon: 'fa fa-puzzle-piece',
        name: 'Feature',
        'updated-at': '2018-06-28T08:50:11.344194Z',
        version: 0,
      },
      id: '0a24d3c2-e0a6-4686-8051-ec0ea1915a28',
      relationships: {
        guidedChildTypes: {
          data: [
            {
              id: 'bbf35418-04b6-426c-a60b-7f80beb0b624',
              type: 'workitemtypes',
            },
            {
              id: '26787039-b68f-4e28-8814-c2f93be1ef4e',
              type: 'workitemtypes',
            },
          ],
        },
        space: {
          data: {
            id: '2e0698d8-753e-4cef-bb7c-f027634824a2',
            type: 'spaces',
          },
          links: {
            related:
              'https://api.prod-preview.openshift.io/api/spaces/2e0698d8-753e-4cef-bb7c-f027634824a2',
            self:
              'https://api.prod-preview.openshift.io/api/spaces/2e0698d8-753e-4cef-bb7c-f027634824a2',
          },
        },
        space_template: {
          data: {
            id: '929c963a-174c-4c37-b487-272067e88bd4',
            type: 'spacetemplates',
          },
          links: {
            related:
              'https://api.prod-preview.openshift.io/api/spacetemplates/929c963a-174c-4c37-b487-272067e88bd4',
            self:
              'https://api.prod-preview.openshift.io/api/spacetemplates/929c963a-174c-4c37-b487-272067e88bd4',
          },
        },
      },
      type: 'workitemtypes',
    },
    {
      attributes: {
        'can-construct': true,
        'created-at': '0001-01-01T00:00:00Z',
        description: 'TBD',
        fields: {
          'system.area': {
            description: 'The area to which the work item belongs',
            label: 'Area',
            required: false,
            type: {
              kind: 'area',
            },
          },
          'system.assignees': {
            description: 'The users that are assigned to the work item',
            label: 'Assignees',
            required: false,
            type: {
              componentType: 'user',
              kind: 'list',
            },
          },
          'system.codebase': {
            description: 'Contains codebase attributes to which this WI belongs to',
            label: 'Codebase',
            required: false,
            type: {
              kind: 'codebase',
            },
          },
          'system.created_at': {
            description: 'The date and time when the work item was created',
            label: 'Created at',
            required: false,
            type: {
              kind: 'instant',
            },
          },
          'system.creator': {
            description: 'The user that created the work item',
            label: 'Creator',
            required: true,
            type: {
              kind: 'user',
            },
          },
          'system.description': {
            description: 'A descriptive text of the work item',
            label: 'Description',
            required: false,
            type: {
              kind: 'markup',
            },
          },
          'system.iteration': {
            description: 'The iteration to which the work item belongs',
            label: 'Iteration',
            required: false,
            type: {
              kind: 'iteration',
            },
          },
          'system.labels': {
            description: 'List of labels attached to the work item',
            label: 'Labels',
            required: false,
            type: {
              componentType: 'label',
              kind: 'list',
            },
          },
          'system.number': {
            description: 'The unique number that was given to this workitem within its space.',
            label: 'Number',
            required: false,
            type: {
              kind: 'integer',
            },
          },
          'system.order': {
            description: 'Execution Order of the workitem',
            label: 'Execution Order',
            required: false,
            type: {
              kind: 'float',
            },
          },
          'system.remote_item_id': {
            description: 'The ID of the remote work item',
            label: 'Remote item',
            required: false,
            type: {
              kind: 'string',
            },
          },
          'system.state': {
            description: 'The state of the work item',
            label: 'State',
            required: true,
            type: {
              baseType: 'string',
              kind: 'enum',
              values: ['new', 'open', 'in progress', 'resolved', 'closed'],
            },
          },
          'system.title': {
            description: 'The title text of the work item',
            label: 'Title',
            required: true,
            type: {
              kind: 'string',
            },
          },
          'system.updated_at': {
            description: 'The date and time when the work item was last updated',
            label: 'Updated at',
            required: false,
            type: {
              kind: 'instant',
            },
          },
        },
        icon: 'fa fa-diamond',
        name: 'Value Proposition',
        'updated-at': '2018-06-28T08:50:11.370728Z',
        version: 0,
      },
      id: '3194ab60-855b-4155-9005-9dce4a05f1eb',
      relationships: {
        guidedChildTypes: {
          data: [
            {
              id: '0a24d3c2-e0a6-4686-8051-ec0ea1915a28',
              type: 'workitemtypes',
            },
            {
              id: '26787039-b68f-4e28-8814-c2f93be1ef4e',
              type: 'workitemtypes',
            },
          ],
        },
        space: {
          data: {
            id: '2e0698d8-753e-4cef-bb7c-f027634824a2',
            type: 'spaces',
          },
          links: {
            related:
              'https://api.prod-preview.openshift.io/api/spaces/2e0698d8-753e-4cef-bb7c-f027634824a2',
            self:
              'https://api.prod-preview.openshift.io/api/spaces/2e0698d8-753e-4cef-bb7c-f027634824a2',
          },
        },
        space_template: {
          data: {
            id: '929c963a-174c-4c37-b487-272067e88bd4',
            type: 'spacetemplates',
          },
          links: {
            related:
              'https://api.prod-preview.openshift.io/api/spacetemplates/929c963a-174c-4c37-b487-272067e88bd4',
            self:
              'https://api.prod-preview.openshift.io/api/spacetemplates/929c963a-174c-4c37-b487-272067e88bd4',
          },
        },
      },
      type: 'workitemtypes',
    },
    {
      attributes: {
        'can-construct': true,
        'created-at': '0001-01-01T00:00:00Z',
        description: 'TBD',
        fields: {
          'system.area': {
            description: 'The area to which the work item belongs',
            label: 'Area',
            required: false,
            type: {
              kind: 'area',
            },
          },
          'system.assignees': {
            description: 'The users that are assigned to the work item',
            label: 'Assignees',
            required: false,
            type: {
              componentType: 'user',
              kind: 'list',
            },
          },
          'system.codebase': {
            description: 'Contains codebase attributes to which this WI belongs to',
            label: 'Codebase',
            required: false,
            type: {
              kind: 'codebase',
            },
          },
          'system.created_at': {
            description: 'The date and time when the work item was created',
            label: 'Created at',
            required: false,
            type: {
              kind: 'instant',
            },
          },
          'system.creator': {
            description: 'The user that created the work item',
            label: 'Creator',
            required: true,
            type: {
              kind: 'user',
            },
          },
          'system.description': {
            description: 'A descriptive text of the work item',
            label: 'Description',
            required: false,
            type: {
              kind: 'markup',
            },
          },
          'system.iteration': {
            description: 'The iteration to which the work item belongs',
            label: 'Iteration',
            required: false,
            type: {
              kind: 'iteration',
            },
          },
          'system.labels': {
            description: 'List of labels attached to the work item',
            label: 'Labels',
            required: false,
            type: {
              componentType: 'label',
              kind: 'list',
            },
          },
          'system.number': {
            description: 'The unique number that was given to this workitem within its space.',
            label: 'Number',
            required: false,
            type: {
              kind: 'integer',
            },
          },
          'system.order': {
            description: 'Execution Order of the workitem',
            label: 'Execution Order',
            required: false,
            type: {
              kind: 'float',
            },
          },
          'system.remote_item_id': {
            description: 'The ID of the remote work item',
            label: 'Remote item',
            required: false,
            type: {
              kind: 'string',
            },
          },
          'system.state': {
            description: 'The state of the work item',
            label: 'State',
            required: true,
            type: {
              baseType: 'string',
              kind: 'enum',
              values: ['new', 'open', 'in progress', 'resolved', 'closed'],
            },
          },
          'system.title': {
            description: 'The title text of the work item',
            label: 'Title',
            required: true,
            type: {
              kind: 'string',
            },
          },
          'system.updated_at': {
            description: 'The date and time when the work item was last updated',
            label: 'Updated at',
            required: false,
            type: {
              kind: 'instant',
            },
          },
        },
        icon: 'fa fa-scissors',
        name: 'Papercuts',
        'updated-at': '2018-06-28T08:50:11.612794Z',
        version: 0,
      },
      id: '6d603ab4-7c5e-4c5f-bba8-a3ba9d370985',
      relationships: {
        guidedChildTypes: {
          data: [
            {
              id: 'b9a71831-c803-4f66-8774-4193fffd1311',
              type: 'workitemtypes',
            },
            {
              id: '3194ab60-855b-4155-9005-9dce4a05f1eb',
              type: 'workitemtypes',
            },
          ],
        },
        space: {
          data: {
            id: '2e0698d8-753e-4cef-bb7c-f027634824a2',
            type: 'spaces',
          },
          links: {
            related:
              'https://api.prod-preview.openshift.io/api/spaces/2e0698d8-753e-4cef-bb7c-f027634824a2',
            self:
              'https://api.prod-preview.openshift.io/api/spaces/2e0698d8-753e-4cef-bb7c-f027634824a2',
          },
        },
        space_template: {
          data: {
            id: '929c963a-174c-4c37-b487-272067e88bd4',
            type: 'spacetemplates',
          },
          links: {
            related:
              'https://api.prod-preview.openshift.io/api/spacetemplates/929c963a-174c-4c37-b487-272067e88bd4',
            self:
              'https://api.prod-preview.openshift.io/api/spacetemplates/929c963a-174c-4c37-b487-272067e88bd4',
          },
        },
      },
      type: 'workitemtypes',
    },
  ],
};

export const singleCommentResponseSnapshot = {
  data: {
    attributes: {
      body: 'This is comment',
      'body.rendered': '\u003cp\u003eThis is comment\u003c/p\u003e\n',
      'created-at': '2018-06-29T11:01:00.280557Z',
      markup: 'Markdown',
      'updated-at': '2018-06-29T11:01:00.280557Z',
    },
    id: '64110861-ccfc-4885-82ef-97e792b0b6ef',
    links: {
      related:
        'https://api.prod-preview.openshift.io/api/comments/64110861-ccfc-4885-82ef-97e792b0b6ef',
      self:
        'https://api.prod-preview.openshift.io/api/comments/64110861-ccfc-4885-82ef-97e792b0b6ef',
    },
    relationships: {
      'created-by': {
        data: {
          id: '86c20119-9442-4459-940d-33ef9c628760',
          type: 'identities',
        },
        links: {
          related:
            'https://api.prod-preview.openshift.io/api/users/86c20119-9442-4459-940d-33ef9c628760',
        },
      },
      creator: {
        data: {
          id: '86c20119-9442-4459-940d-33ef9c628760',
          links: {
            related:
              'https://api.prod-preview.openshift.io/api/users/86c20119-9442-4459-940d-33ef9c628760',
          },
          type: 'identities',
        },
      },
    },
    type: 'comments',
  },
};
