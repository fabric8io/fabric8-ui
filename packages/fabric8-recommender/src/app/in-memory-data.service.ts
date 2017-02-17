import { InMemoryDbService } from 'angular-in-memory-web-api';

export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    let identities = [
      {
        attributes: {
          fullName: 'Harry Potter',
          imageURL: 'http://nerdist.com/wp-content/uploads/2016/02/20160210_nerdistnews_harrypottercursedchild_1x1.jpg'
        },
        id: '779efdcc-ac87-4720-925e-949ff21dbf5d'
      }, {
        attributes: {
          fullName: 'Walter Mitty',
          imageURL: 'http://bestwatchbrandshq.com/wp-content/uploads/2015/01/Ben-Stiller-Watch-In-The-Secret-Life-Of-Walter-Mitty-Movie-9.jpg'
        },
        id: '39d44ed6-1246-48d6-9190-51ffab67c42e'
      }, {
        attributes: {
          fullName: 'Draco Malfoy',
          imageURL: 'http://www.hercampus.com/sites/default/files/2016/01/05/tom-felton-as-draco-malfoy-from-harry-potter.jpg'
        },
        id: '498c69a9-bb6f-464b-b89c-a1976ed46301'
      }
    ];

    let workitems = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((n) => {
      return {
        'attributes': {
          'system.created_at': null,
          'system.description': 'Some Description ' + n,
          'system.remote_item_id': null,
          'system.state': 'new',
          'system.title': 'Some Title ' + n,
          'version': 1
        },
        'id': '' + n,
        'relationships': {
          'assignees': {},
          'baseType': {
            'data': {
              'id': 'system.userstory',
              'type': 'workitemtypes'
            }
          },
          'creator': {
            'data': {
              'id': identities[1].id,
              'type': 'identities'
            }
          },
          'comments': {
            'links': {
              'self': ''
            }
          }
        },
        'type': 'workitems'
      };
    });

    let loginStatus = {
      'status': 200,
      'responseText': 'Good Job'
    };

    let workitemtypes = [
    {
      'fields': {
        'system.assignee': {
          'required': false,
          'type': {
            'kind': 'user'
          }
        },
        'system.creator': {
          'required': true,
          'type': {
            'kind': 'user'
          }
        },
        'system.description': {
          'required': false,
          'type': {
            'kind': 'string'
          }
        },
        'system.remote_item_id': {
          'required': false,
          'type': {
            'kind': 'string'
          }
        },
        'system.state': {
          'required': true,
          'type': {
            'baseType': 'string',
            'kind': 'enum',
            'values': [
              'new',
              'open',
              'in progress',
              'resolved',
              'closed'
            ]
          }
        },
        'system.title': {
          'required': true,
          'type': {
            'kind': 'string'
          }
        }
      },
      'name': 'system.userstory',
      'version': 0
    },
    {
      'fields': {
        'system.assignee': {
          'required': false,
          'type': {
            'kind': 'user'
          }
        },
        'system.creator': {
          'required': true,
          'type': {
            'kind': 'user'
          }
        },
        'system.description': {
          'required': false,
          'type': {
            'kind': 'string'
          }
        },
        'system.remote_item_id': {
          'required': false,
          'type': {
            'kind': 'string'
          }
        },
        'system.state': {
          'required': true,
          'type': {
            'baseType': 'string',
            'kind': 'enum',
            'values': [
              'new',
              'open',
              'in progress',
              'resolved',
              'closed'
            ]
          }
        },
        'system.title': {
          'required': true,
          'type': {
            'kind': 'string'
          }
        }
      },
      'name': 'system.valueproposition',
      'version': 0
    },
    {
      'fields': {
        'system.assignee': {
          'required': false,
          'type': {
            'kind': 'user'
          }
        },
        'system.creator': {
          'required': true,
          'type': {
            'kind': 'user'
          }
        },
        'system.description': {
          'required': false,
          'type': {
            'kind': 'string'
          }
        },
        'system.remote_item_id': {
          'required': false,
          'type': {
            'kind': 'string'
          }
        },
        'system.state': {
          'required': true,
          'type': {
            'baseType': 'string',
            'kind': 'enum',
            'values': [
              'new',
              'open',
              'in progress',
              'resolved',
              'closed'
            ]
          }
        },
        'system.title': {
          'required': true,
          'type': {
            'kind': 'string'
          }
        }
      },
      'name': 'system.fundamental',
      'version': 0
    },
    {
      'fields': {
        'system.assignee': {
          'required': false,
          'type': {
            'kind': 'user'
          }
        },
        'system.creator': {
          'required': true,
          'type': {
            'kind': 'user'
          }
        },
        'system.description': {
          'required': false,
          'type': {
            'kind': 'string'
          }
        },
        'system.remote_item_id': {
          'required': false,
          'type': {
            'kind': 'string'
          }
        },
        'system.state': {
          'required': true,
          'type': {
            'baseType': 'string',
            'kind': 'enum',
            'values': [
              'new',
              'open',
              'in progress',
              'resolved',
              'closed'
            ]
          }
        },
        'system.title': {
          'required': true,
          'type': {
            'kind': 'string'
          }
        }
      },
      'name': 'system.experience',
      'version': 0
    },
    {
      'fields': {
        'system.assignee': {
          'required': false,
          'type': {
            'kind': 'user'
          }
        },
        'system.creator': {
          'required': true,
          'type': {
            'kind': 'user'
          }
        },
        'system.description': {
          'required': false,
          'type': {
            'kind': 'string'
          }
        },
        'system.remote_item_id': {
          'required': false,
          'type': {
            'kind': 'string'
          }
        },
        'system.state': {
          'required': true,
          'type': {
            'baseType': 'string',
            'kind': 'enum',
            'values': [
              'new',
              'open',
              'in progress',
              'resolved',
              'closed'
            ]
          }
        },
        'system.title': {
          'required': true,
          'type': {
            'kind': 'string'
          }
        }
      },
      'name': 'system.feature',
      'version': 0
    },
    {
      'fields': {
        'system.assignee': {
          'required': false,
          'type': {
            'kind': 'user'
          }
        },
        'system.creator': {
          'required': true,
          'type': {
            'kind': 'user'
          }
        },
        'system.description': {
          'required': false,
          'type': {
            'kind': 'string'
          }
        },
        'system.remote_item_id': {
          'required': false,
          'type': {
            'kind': 'string'
          }
        },
        'system.state': {
          'required': true,
          'type': {
            'baseType': 'string',
            'kind': 'enum',
            'values': [
              'new',
              'open',
              'in progress',
              'resolved',
              'closed'
            ]
          }
        },
        'system.title': {
          'required': true,
          'type': {
            'kind': 'string'
          }
        }
      },
      'name': 'system.bug',
      'version': 0
    }
  ];


    let user = {
      attributes: {
          fullName: 'Draco Malfoy',
          imageURL: 'http://www.hercampus.com/sites/default/files/2016/01/05/tom-felton-as-draco-malfoy-from-harry-potter.jpg'
        },
        id: '498c69a9-bb6f-464b-b89c-a1976ed46301'
    };

    let linkCategories = {
      'data': {
        'attributes': {
          'description': 'A work item link category that is meant only for work item link types goverened by the system alone.',
          'name': 'system',
          'version': 0
        },
        'id': '6c5610be-30b2-4880-9fec-81e4f8e4fd76',
        'type': 'workitemlinkcategories'
      }
    };

    let workitemlinktypes = [
        {
         'id': '4f8d8e8c-ab1c-4396-b725-105aa69a789c',
         'type': 'workitemlinktypes',
         'attributes': {
          'description': 'A test work item can if a the code in a pull request passes the tests.',
          'forward_name': 'story-story',
          'name': 'story-story',
          'reverse_name': 'story by',
          'topology': 'network', 
          'version': 0
        },
        // 'id': '40bbdd3d-8b5d-4fd6-ac90-7236b669af04',
        'relationships': {
          'link_category': {
            'data': {
              'id': 'c08d244f-ca36-4943-b12c-1cdab3525f12',
              'type': 'workitemlinkcategories'
            }
          },
          'source_type': {
            'data': {
              'id': 'system.userstory',
              'type': 'workitemtypes'
            }
          },
          'target_type': {
            'data': {
              'id': 'system.userstory',
              'type': 'workitemtypes'
            }
          }
      }
    },
      {
         'id': '9cd02068-d76e-4733-9df8-f18bc39002ee',
         'type': 'workitemlinktypes',
         'attributes': {
          'description': 'A test work item can if a the code in a pull request passes the tests.',
          'forward_name': 'abc-abc',
          'name': 'abc-abc',
          'reverse_name': 'story by',
          'topology': 'network', 
          'version': 0
        },
        // 'id': '40bbdd3d-8b5d-4fd6-ac90-7236b669af04',
        'relationships': {
          'link_category': {
            'data': {
              'id': 'c08d244f-ca36-4943-b12c-1cdab3525f12',
              'type': 'workitemlinkcategories'
            }
          },
          'source_type': {
            'data': {
              'id': 'system.userstory',
              'type': 'workitemtypes'
            }
          },
          'target_type': {
            'data': {
              'id': 'system.userstory',
              'type': 'workitemtypes'
            }
          }
      }
    }];

    let workitemlinks = [
        {
            attributes: {
                version: 0
            },
            id: 'd66b0ad5-bca8-4642-a43c-80cc0c831b25',
            relationships: {
                link_type: {
                data: {
                    id: '4f8d8e8c-ab1c-4396-b725-105aa69a789c',
                    type: 'workitemlinktypes'
                }
                },
                source: {
                data: {
                    id: '3',
                    type: 'workitems'
                }
                },
                target: {
                data: {
                    id: '4',
                    type: 'workitems'
                }
                }
            },
            type: 'workitemlinks'
        },
        {
            attributes: {
                version: 0
            },
            id: 'c241e025-87a4-4c59-aed0-8333de346666',
            relationships: {
                link_type: {
                data: {
                    id: '9cd02068-d76e-4733-9df8-f18bc39002ee',
                    type: 'workitemlinktypes'
                }
                },
                source: {
                data: {
                    id: '3',
                    type: 'workitems'
                }
                },
                target: {
                data: {
                    id: '6',
                    type: 'workitems'
                }
                }
            },
            type: 'workitemlinks'
        },
        {
            attributes: {
                version: 0
            },
            id: 'dcaff8b1-8d4d-40c9-9408-c0f4dc1961c7',
            relationships: {
                link_type: {
                data: {
                    id: '4f8d8e8c-ab1c-4396-b725-105aa69a789c',
                    type: 'workitemlinktypes'
                }
                },
                source: {
                data: {
                    id: '3',
                    type: 'workitems'
                }
                },
                target: {
                data: {
                    id: '1',
                    type: 'workitems'
                }
                }
            },
            type: 'workitemlinks'
        }
    ];

    return {loginStatus, workitems, workitemtypes, user, linkCategories, workitemlinktypes, workitemlinks, identities};
  }
}